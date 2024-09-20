<template>
  <Toolbar class="ren-toolbar ren-page-content ren-sticky top" style="z-index: 2000">
    <template #start>
      <!-- <h3>{{ $t("menu.wasteheat_view") }}</h3> -->

      <Button :label="$t('view.button.start_new_task')" :disabled="isTaskRunning" @click="showStartDialog" />
    </template>
    <template #end>
      <Button :disabled="isTaskRunning" icon="pi pi-list" @click="showRunLog" />
    </template>
  </Toolbar>

  <InformationPanelWrapper
    v-if="informationPanel && !isTaskRunning"
    ref="panel"
    :panel="informationPanel"
    :edit-mode="false"
    :panel-settings="panelSettings"
    :filter="panelFilter"
    @update:tile="onTileUpdate"
  ></InformationPanelWrapper>
  <Card v-if="isTaskRunning" class="ren-page-content" style="width: 100%; overflow: unset">
    <template #title>
      {{ $t("menu.wasteheat_view") }}
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
  <div v-if="informationPanel && !isTaskRunning" style="margin-left: 1rem; margin-top: 2rem">
    <ParsedDateFilter :key="parsedFilterRefresh" :filter="panelFilter" />
  </div>
  <Dialog v-model:visible="workflowRunStartDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <WorkflowRun :workflow="workflow" @on-start="onWorkflowStart" />
  </Dialog>
  <Dialog v-model:visible="workflowRunDetailsDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <WorkflowRunDetails :workflow-run="workflowRun" @on-stop="onWorkflowStop" />
  </Dialog>

  <Dialog v-model:visible="runlogDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <PipelineRunLog :workflow="workflow" />
  </Dialog>
</template>

<script>
import WorkflowRunDetails from "@/components/management/workflow/WorkflowRunDetails.vue";
import PipelineRunLog from "@/components/admin/PipelineRunLog.vue";
// import PipelineRunLog from "./PipelineRunLog.vue";
import WorkflowRun from "@/components/management/workflow/WorkflowRun.vue";
import InformationPanelWrapper from "@/components/dashboard/informationpanel/InformationPanelWrapper.vue";
import ParsedDateFilter from "@/components/miscellaneous/settings/ParsedDateFilter.vue";

export default {
  name: "WasteHeatPipelineList",
  components: { WorkflowRun, WorkflowRunDetails, InformationPanelWrapper, ParsedDateFilter, PipelineRunLog },
  props: {
    workflow: { type: Object, default: null },
    workflowRun: { type: Object, default: null },
    panelSettings: { type: Object, default: () => {} },
    informationPanel: { type: Object, default: null },
    panelFilter: { type: Object, default: () => {} },
  },
  emits: ["reload", "update:filters", "select"],
  data() {
    return {
      runLogList: [],
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
  },
  watch: {},
  created() {},
  async mounted() {},
  methods: {
    showStartDialog() {
      this.workflowRunStartDialog = true;
    },

    onWorkflowStop(state) {
      console.debug(`Stop state ${state}`);
      this.workflowRunDetailsDialog = false;
      this.$emit("reload");
    },
    showRunDetails() {
      this.workflowRunDetailsDialog = true;
    },

    async showRunLog() {
      this.runlogDialog = true;
    },
    onWorkflowStart(/*workflowRun*/) {
      this.workflowRunStartDialog = false;
      this.$emit("reload");
    },
    reload() {
      this.$emit("reload");
    },
  },
};
</script>

<style lang="scss"></style>
