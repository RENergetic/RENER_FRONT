<template>
  <Card class="col-12" style="width: 90%; margin: auto; margin-top: 1rem">
    <template #content>
      <RenSpinner ref="spinner" :lock="true" style="margin: auto; max-width: 80rem">
        <!--  max-width: 80vw -->
        <template #content>
          <user-list :users="users" @on-delete="confirmDeleteUser" @on-create="loadUsers" @on-update="loadUsers" />
        </template>
      </RenSpinner>
    </template>
  </Card>
</template>

<script>
// import UserAdd from "@/components/admin/UserAdd.vue"; @reload="reload"
import UserList from "@/components/admin/UserList.vue";

export default {
  name: "Users",
  components: {
    UserList,
  },
  data() {
    return {
      users: [],
    };
  },
  async created() {},
  mounted() {
    this.loadUsers();
  },
  methods: {
    async loadUsers() {
      await this.$refs.spinner.run(async () => {
        this.users = await this.$ren.userApi.listUsers();
      });
    },
    async deleteUser(user) {
      await this.$refs.spinner.run(async () => {
        await this.$ren.userApi.deleteUser(user.id);
      });
      await this.loadUsers();
    },
    confirmDeleteUser(user) {
      this.$confirm.require({
        message: this.$t("view.user_delete_confirm", {
          user: user,
          username: user.username,
        }),
        header: this.$t("view.user_delete"),
        icon: "pi pi-exclamation-triangle",
        accept: () => this.deleteUser(user),
        reject: () => this.$confirm.close(),
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
