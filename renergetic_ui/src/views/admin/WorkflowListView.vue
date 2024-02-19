<template>
  <Card class="ren-page-content">
    <template #title>{{ $t("menu.manage_workflows") }}</template>
    <template #content>
      <RenSpinner ref="spinner" :lock="true" style="width: 100%">
        <!--  max-width: 80vw -->
        <template #content>
          <!-- {{ filters }}  -->
          <workflow-list v-model:pagination="pagination" v-model:filters="filters" :workflow-list="workflowList" @reload="reload" />
        </template>
      </RenSpinner>
    </template>
  </Card>
</template>

<script>
import WorkflowList from "@/components/admin/WorkflowList.vue";

export default {
  name: "WorkflowListView",
  components: {
    WorkflowList,
  },
  data() {
    return {
      workflowList: [],
      filters: null,
    };
  },
  watch: {
    filters: {
      handler: function () {
        this.loadWorkflows();
      },
      deep: true,
      immediate: true,
    },
  },
  async created() {},
  mounted() {
    this.loadWorkflows();
  },
  methods: {
    async loadWorkflows() {
      let f = this.filters ? this.filters : {};
      await this.$refs.spinner.run(async () => {
        this.workflowList = await this.$ren.kubeflowApi.adminList(f);
      });
    },
    async reload() {
      await this.loadWorkflows();
    },
    // async deleteUser(user) {
    //   await this.$refs.spinner.run(async () => {
    //     await this.$ren.userApi.deleteUser(user.id);
    //   });
    //   await this.loadUsers();
    // },
    // confirmDeleteUser(user) {
    //   this.$confirm.require({
    //     message: this.$t("view.user_delete_confirm", {
    //       user: user,
    //       username: user.username,
    //     }),
    //     header: this.$t("view.user_delete"),
    //     icon: "pi pi-exclamation-triangle",
    //     accept: () => this.deleteUser(user),
    //     reject: () => this.$confirm.close(),
    //   });
    // },
  },
};
</script>

<style lang="scss" scoped></style>
