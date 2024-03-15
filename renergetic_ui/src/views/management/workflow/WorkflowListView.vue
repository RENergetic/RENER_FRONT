<template>
  <Card class="ren-page-content">
    <template #title>{{ $t("menu.manage_workflows") }}</template>
    <template #content>
      <RenSpinner ref="spinner" :lock="true" style="width: 100%">
        <!--  max-width: 80vw -->
        <template #content>
          <workflow-list v-model:pagination="pagination" :workflow-list="workflowList" @reload="reload" />
        </template>
      </RenSpinner>
    </template>
  </Card>
</template>

<script>
import WorkflowList from "@/components/management/workflow/WorkflowList.vue";

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
    // filters: {
    //   handler: function () {
    //     this.loadWorkflows();
    //   },
    //   deep: true,
    //   immediate: true,
    // },
  },
  async created() {},
  async mounted() {
    await this.loadWorkflows();
  },
  methods: {
    async loadWorkflows() {
      await this.$refs.spinner.run(async () => {
        this.workflowList = await this.$ren.kubeflowApi.list();
      });
    },
    async reload() {
      await this.loadWorkflows();
    },
  },
};
</script>

<style lang="scss" scoped></style>
