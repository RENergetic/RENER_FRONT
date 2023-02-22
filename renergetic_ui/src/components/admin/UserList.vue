<template>
  <div>
    TODO: view roless
    <!-- v-model:expandedRows="users.roles" -->
    <!-- {{ expanded }} todo: expand on @row-click='onrowclick' -->
    <!-- https://stackoverflow.com/questions/33910615/is-there-an-api-call-for-changing-user-password-on-keycloak -->
    <DataTable
      v-model:expandedRows="expanded"
      :value="users"
      data-key="id"
      responsive-layout="scroll"
      @row-expand="onUserExpand"
    >
      <Column :expander="true" header-style="width: 3rem" />
      <Column field="username" header="Username" sortable></Column>
      <Column field="name" header="Name" sortable></Column>
      <Column field="email" header="Email" sortable></Column>
      <Column :exportable="false" style="min-width: 8rem">
        <template #body="user">
          TODO:
          <Button
            icon="pi pi-user-edit"
            class="p-button-rounded p-button-warning mr-2"
            @click="
              userToEdit = user.data;
              addUserDialog = true;
            "
          />
          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-danger"
            @click="openDialog('deleteUser', user.data)"
          />
        </template>
      </Column>
      <template #expansion="user">
        <!-- refresh button: TODO: :ref="'roles_' + user.data.id" :user="user.data.id"-->

        <UserRoleList :user="user.data" @reload-roles="onRolesReload" />
      </template>
    </DataTable>
    <Toolbar>
      <template #start>
        <Button
          label="Add new user"
          icon="pi pi-user-plus"
          class="mr-2 p-button-success"
          @click="
            userToEdit = undefined;
            addUserDialog = true;
          "
        />
      </template>
    </Toolbar>

    <!-- <UserAdd  :edit-user="mUser" :visible="addUserDialog" @close="closeAddUserDialog"></UserAdd> -->
    <Dialog v-model:visible="editDialog" :style="{ width: '75vw' }" :modal="true" :dismissable-mask="true">
      <UserForm v-if="selectedRow" :user="selectedUser" @save="onEdit" @cancel="editDialog = false" />
      <UserForm v-else @save="onCreate" @cancel="editDialog = false" />
    </Dialog>
    <Dialog v-model:visible="addDialog" :style="{ width: '75vw' }" :modal="true" :dismissable-mask="true">
      <UserForm @save="onCreate" @cancel="addDialog = false" />
    </Dialog>
  </div>
</template>

<script>
import UserForm from "@/components/admin/UserForm.vue";
import UserRoleList from "./UserRoleList.vue";

import { RenRolesStr } from "@/plugins/model/Enums";
export default {
  name: "Users",
  components: {
    UserForm,
    UserRoleList,
  },
  props: {
    users: { type: Array, default: () => [] },
  },
  data() {
    return {
      mUsers: this.$datausers,
      roles: RenRolesStr.values(),
      expanded: [],
      editDialog: false,
      addDialog: false,
      selectedUser: null,
      // userToEdit: undefined,
      // userToChange: undefined,
      // roleToChange: undefined,
      // addUserDialog: false,
    };
  },
  async created() {},
  mounted() {},
  methods: {
    edit(row) {
      // console.info(row);
      this.selectedUser = row;
      this.editDialog = true;
    },

    async onEdit(o) {
      await this.$ren.dashboardApi.update(o).then((res) => {
        if (res) {
          this.$emitter.emit("information", { message: this.$t("information.dashboard_updated") });
          this.editDialog = false;
          this.reload();
        } else {
          this.$emitter.emit("error", { message: this.$t("information.dashboard_not_updated") });
        }
      });
    },
    async onCreate(o) {
      // console.log(o);
      await this.$ren.dashboardApi.add(o).then((dashboard) => {
        console.info("add dashboard:" + dashboard.name);
        this.$emitter.emit("information", { message: this.$t("information.dashboard_created") });
      });
      this.addDialog = false;
      this.reload();
    },

    onRolesReload(evt) {
      console.info(evt);
    },
    async onUserExpand() {},
    // async onUserExpand(evt) {
    //   var user = evt.data;
    //   if (user.roles) {
    //     return;
    //   } else {
    //     // await this.$refs["roles_" + user.id][0].reloadRoles();
    //     // await this.getRoles(user);
    //   }
    // },
  },
};
</script>

<style lang="scss" scoped></style>
