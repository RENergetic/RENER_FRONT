<template>
  <RenSpinner ref="spinner" :lock="true" style="margin: auto; max-width: 80vw; width: 100%">
    <template #content>
      <div v-if="mRoles && mRoles.length > 0" class="role-table">
        <DataTable :value="mRoles" responsive-layout="scroll">
          <Column :exportable="false" style="min-width: 8rem">
            <template #body="role">
              <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="confirmRevoke(role.data)" />
            </template>
          </Column>
          <Column field="name" header="Role Name">
            <!-- TODO: sortable -->
            <template #body="slotProps">
              {{ slotProps.data }}
            </template>
          </Column>
        </DataTable>
      </div>
      <Message v-else severity="info">{{ `${mUser.username} haven't assigned roles` }}</Message>
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
</template>
<!-- option-label="label"
            option-value="name" -->
<!-- <select class="p-component" style="width: 100%; text-align: center" @change="selectRole($event, user.data)">
            <option v-for="role of availableRoles(user.data)" :key="role.id" :value="JSON.stringify(role)">
              {{ role }}
            </option>
          </select> -->
<script>
import { RenRolesStr } from "@/plugins/model/Enums";
//TODO: emit update
export default {
  name: "UserRoleList",
  components: {},
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
      // roles: RenRolesStr,
    };
  },
  // computed: {

  // },
  async mounted() {
    // console.info("ddd333");
    if (!this.mUser.roles) {
      await this.reloadRoles();
    } else if (this.mUser.roles) this.remainingRoles = await this.getRemainingRoles(this.mUser);
    else {
      //roles notloaded todo:
    }
  },
  // created() {
  // },
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
      // console.info(this.renRoles);
      // console.info(user);
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
// .confirmation-content {
//   display: flex;
//   align-items: center;
//   justify-content: center;
// }
// @media screen and (max-width: 960px) {
//   ::v-deep(.p-toolbar) {
//     flex-wrap: wrap;

//     .p-button {
//       margin-bottom: 0.25rem;
//     }
//   }
// }
</style>
