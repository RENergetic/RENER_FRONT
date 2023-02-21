<template>
  <div>
    TODO: view roless
    <!-- v-model:expandedRows="users.roles" -->
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

    <UserAdd :users="users" :edit-user="mUser" :visible="addUserDialog" @close="closeAddUserDialog"></UserAdd>
  </div>
</template>

<script>
import UserAdd from "@/components/admin/UserAdd.vue";
import UserRoleList from "./UserRoleList.vue";

import { RenRolesStr } from "@/plugins/model/Enums";
export default {
  name: "Users",
  components: {
    UserAdd,
    UserRoleList,
  },
  props: {
    users: { type: Array, default: () => [] },
  },
  data() {
    return {
      mUsers: this.$datausers,
      mUser: null,
      roles: RenRolesStr.values(),
      expanded: [],
      // userToEdit: undefined,
      // userToChange: undefined,
      // roleToChange: undefined,
      // deleteDialog: {
      //   visible: false,
      //   header: "Delete",
      //   text: "Are you sure to delete this",
      //   delete: undefined, // user | role,
      // },
      addUserDialog: false,
    };
  },
  async created() {},
  mounted() {},
  methods: {
    onRolesReload(evt) {
      console.info(evt);
    },
    async onUserExpand(evt) {
      var user = evt.data;
      if (user.roles) {
        return;
      } else {
        // await this.$refs["roles_" + user.id][0].reloadRoles();
        // await this.getRoles(user);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
