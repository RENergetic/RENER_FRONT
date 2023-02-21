<template>
  <Card class="col-12">
    <template #content>
      <RenSpinner ref="spinner" :lock="true" style="margin: auto; max-width: 80vw">
        <template #content>
          <user-list :users="users" />
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
  async created() {
    // this.users = await this.$keycloak.getUsers();
    // console.log(this.users);
  },
  mounted() {
    this.loadUsers();
  },
  methods: {
    async loadUsers() {
      this.$refs.spinner.run(async () => {
        this.users = await this.$ren.userApi.listUsers();
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
