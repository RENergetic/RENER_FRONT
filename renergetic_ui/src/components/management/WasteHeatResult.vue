<template>
  <InformationPanel
    v-if="hasResults"
    :edit="false"
    :panel-data="workflowRun.results.data"
    :panel="workflowRun.results.panel"
    :locked="true"
    :settings="{ tile_preview: false }"
    :filter="{}"
  />

  <Card v-if="isTaskRunning" class="ren-page-content" style="width: 100%; overflow: unset">
    <template #title>
      {{ $t("menu.waste_heat") }}
    </template>
    <template #content>
      <div @click="showRunDetails()">
        <div>
          {{ workflowRun.name ? `${workflowRun.name} (${workflowRun.run_id})` : workflowRun.run_id }}
        </div>

        <div class="disabled">
          {{ $t("model.workflowrun.start_time_formatted", { start_time: $ren.utils.dateString(workflowRun.start_time) }) }}
        </div>
      </div>
    </template>
  </Card>

  <Dialog v-model:visible="workflowRunDetailsDialog" :style="{ width: '40rem' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <WorkflowRunDetails :workflow-run="workflowRun" @on-stop="onWorkflowStop" />
  </Dialog>
</template>

<script>
import WorkflowRunDetails from "@/components/admin/workflow/WorkflowRunDetails.vue";
import InformationPanel from "@/components/dashboard/informationpanel/InformationPanel.vue";
export default {
  name: "WasteHeatResult",
  components: {
    InformationPanel,
    WorkflowRunDetails,
  },
  props: {
    workflow: { type: Object, default: null },
    workflowRun: { type: Object, default: null },
  },
  emits: ["reload", "update:filters", "select"],
  data() {
    return {
      selectedWorkflowRunDetails: null,
      workflowRunDetailsDialog: false,
      runlogDialog: false,
      workflowRunStartDialog: false,
    };
  },
  computed: {
    isTaskRunning() {
      return this.workflowRun != null && this.workflowRun.start_time && (this.workflowRun.end_time == null || this.workflowRun.end_time < 0);
    },
    hasResults() {
      return this.workflowRun != null && this.workflowRun.state == "Succeeded" && this.workflowRun.results != null;
    },
  },
  async mounted() {},
  methods: {
    showRunDetails() {
      this.workflowRunDetailsDialog = true;
    },
  },
};
</script>

<style lang="scss"></style>
