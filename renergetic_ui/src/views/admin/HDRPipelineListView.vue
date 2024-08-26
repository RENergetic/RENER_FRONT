<template>
  <!-- Admin workflows -->
  <Card class="ren-page-content">
    <template #title>{{ $t("menu.manage_hdr_pipeline") }}</template>
    <template #content>
      <RenSpinner ref="spinner" :lock="true" style="width: 100%">
        <template #content>
          <pipeline-list v-model:pagination="pagination" v-model:filters="filters" :workflow-list="workflowList" @reload="reload" />
        </template>
      </RenSpinner>
    </template>
  </Card>
</template>
<script>
import PipelineList from "@/components/admin/HDRPipelineList.vue";
export default {
  name: "HDRPipelineListView",
  components: { PipelineList },
  data() {
    return { workflowList: [], filters: null };
  },
  watch: {
    filters: {
      handler: function () {
        this.loadWorkflows();
      },
      deep: true,
      immediate: false,
    },
  },
  mounted() {
    this.loadWorkflows();
  },
  methods: {
    async loadWorkflows() {
      let f = this.filters ? this.filters : {};
      if (f.hdr_pipeline) {
        await this.$refs.spinner.run(async () => {
          this.workflowList = await this.$ren.kubeflowApi.listHDRPipelines();
        });
      } else {
        await this.$refs.spinner.run(async () => {
          this.workflowList = await this.$ren.kubeflowApi.list();
        });
      }
    },
    async reload() {
      await this.loadWorkflows();
    },
  },
};
</script>
