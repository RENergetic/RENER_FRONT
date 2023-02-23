<template>
  <RenSpinner ref="spinner" :lock="true" style="margin: auto; width: 100%">
    <!-- max-width: 80vw; -->
    <template #content>
      <div v-if="mRoles && mRoles.length > 0" class="role-table">
        <DataTable :value="mRoles" responsive-layout="scroll">
          <Column :exportable="false" :style="{ width: '5rem' }">
            <template #body="role">
              <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="confirmRevoke(role.data)" />
            </template>
          </Column>
          <Column>
            <!-- TODO: sortable -->
            <template #body="slotProps">
              {{ slotProps.data }}
            </template>
            <template #header>
              {{ $t("model.role.name") }}
              <span class="pi pi-info-circle" style="margin-left: 0.5rem" @click="roleMatrixDialog = true" />
            </template>
          </Column>
        </DataTable>
      </div>
      <Message v-else severity="info">{{ $t("view.user_no_roles", { username: mUser.username }) }}</Message>
      <div v-if="remainingRoles.length > 0" class="grid p-fluid" style="margin: 0 2rem; max-width: 20rem">
        <div class="col-12">
          <div class="p-inputgroup">
            <Dropdown
              id="selectRole"
              v-model="selectedRole"
              :options="remainingRoles"
              :placeholder="$t('view.select_role')"
            />
            <Button v-if="selectedRole" icon="pi pi-plus" class="p-button-success" @click="confirmAdd()" />
          </div>
        </div>
      </div>
    </template>
  </RenSpinner>
  <Dialog
    v-model:visible="roleMatrixDialog"
    :style="{ width: '95vw', height: '95vh' }"
    :modal="true"
    :dismissable-mask="true"
  >
    <RoleMatrix />
  </Dialog>
</template>

<script>
import { RenRolesStr } from "@/plugins/model/Enums";
import RoleMatrix from "@/components/miscellaneous/settings/RoleMatrix.vue";
//TODO: emit update
export default {
  name: "UserRoleList",
  components: { RoleMatrix },
  props: {
    user: { type: Object, default: null },
  },
  emits: ["reloadRoles"],
  data() {
    return {
      mUser: this.user,
      renRoles: RenRolesStr.values(),
      mRoles: this.user ? this.user.roles : [],
      remainingRoles: [],
      selectedRole: null,
      roleMatrixDialog: false,
    };
  },
  async mounted() {
    if (!this.mUser.roles) {
      await this.reloadRoles();
    } else if (this.mUser.roles) this.remainingRoles = await this.getRemainingRoles(this.mUser);
    else {
      //roles notloaded todo:
    }
  },
  methods: {
    async reloadRoles() {
      await this.$refs.spinner.run(async () => {
        let roles = await this.getRoles(this.mUser);
        this.setRoles(roles);
      });
    },
    async getRoles(user) {
      return await this.$ren.userApi.getRoles(user.id);
    },
    getRemainingRoles(user) {
      /**
       * roles available to add
       */
      let r = [];
      for (let roleName of this.renRoles) {
        let push = true;
        for (let userrole of user.roles) {
          push &= userrole != roleName;
          if (!push) {
            break;
          }
        }
        if (push) {
          r.push(roleName);
        }
      }
      return r;
    },
    setRoles(roles) {
      console.info(roles);
      this.mUser.roles = roles;
      this.mRoles = roles;
      if (this.mUser.roles) this.remainingRoles = this.getRemainingRoles(this.mUser);
      this.$emit("reloadRoles", this.mUser);
    },

    async addRole(role) {
      this.$refs.spinner.run(async () => {
        let roles = await this.$ren.userApi.assignRole(this.mUser.id, role);
        this.setRoles(roles);
        this.selectedRole = null;
      });
    },
    confirmAdd() {
      this.$confirm.require({
        message: this.$t("view.user_role_add_confirm", {
          role: this.selectedRole,
          username: this.mUser.username,
        }),
        header: this.$t("view.user_role_add"),
        icon: "pi pi-exclamation-triangle",
        accept: () => this.addRole(this.selectedRole),
        reject: () => this.$confirm.close(),
      });
    },
    async revokeRole(role) {
      this.$refs.spinner.run(async () => {
        var roles = await this.$ren.userApi.revokeRole(this.mUser.id, role);
        this.setRoles(roles);
        this.selectedRole = null;
      });
    },
    confirmRevoke(role) {
      this.$confirm.require({
        message: this.$t("view.user_role_revoke_confirm", {
          role: role,
          username: this.mUser.username,
        }),
        header: this.$t("view.user_role_revoke"),
        icon: "pi pi-exclamation-triangle",
        accept: () => this.revokeRole(role),
        reject: () => this.$confirm.close(),
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.role-table {
  width: 100%;
  margin: 0;
}
</style>
