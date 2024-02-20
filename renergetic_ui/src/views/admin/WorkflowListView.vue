<template>
  <!-- Admin workflows -->
  <Card class="ren-page-content">
    <template #title>{{ $t("menu.manage_workflows") }}</template>
    <template #content>
      <RenSpinner ref="spinner" :lock="true" style="width: 100%">
        <template #content>
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
  components: { WorkflowList },
  data() {
    return { workflowList: [], filters: null };
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
  },
};
</script>
