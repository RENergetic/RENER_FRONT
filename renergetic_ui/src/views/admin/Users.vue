<template>
  <Card style="margin: auto; margin-top: 0.5rem; max-width: 80rem">
    <template #title>{{ $t("menu.manage_users") }}</template>
    <template #content>
      <RenSpinner ref="spinner" :lock="true" style="width: 100%">
        <!--  max-width: 80vw -->
        <template #content>
          <user-list v-model:pagination="pagination" :users="users" @on-delete="confirmDeleteUser" @on-create="loadUsers" @on-update="loadUsers" />
        </template>
      </RenSpinner>
    </template>
  </Card>
</template>

<script>
import UserList from "@/components/admin/UserList.vue";

export default {
  name: "Users",
  components: {
    UserList,
  },
  data() {
    return {
      pagination: null,
      users: [],
    };
  },
  watch: {
    pagination: function () {
      this.loadUsers();
    },
  },
  async created() {},
  mounted() {
    if (this.pagination != null) this.loadUsers();
  },
  methods: {
    async loadUsers() {
      await this.$refs.spinner.run(async () => {
        this.users = await this.$ren.userApi.listUsers(null, this.pagination.offset, this.pagination.limit);
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
