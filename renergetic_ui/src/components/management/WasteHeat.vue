<template>
  <Toolbar class="ren-toolbar ren-page-content ren-sticky top" style="z-index: 2000">
    <template #start>
      <!-- <h3>{{ $t("menu.wasteheat_view") }}</h3> -->

      <Button :label="$t('view.button.start_new_task')" :disabled="isTaskRunning" @click="showStartDialog(true)" />
      <!-- <Button :label="$t('view.button.start_new_task')" :disabled="isTaskRunning" @click="showStartDialog(false)" /> -->
    </template>
    <template #end>
      <!-- :disabled="isTaskRunning" -->
      <Button icon="pi pi-list" @click="showRunLog" />
    </template>
  </Toolbar>
  <!--  -->
  <!-- <div v-if="!isTaskRunning && isOldResult && !showPrevious" style="display: flex">
    <Button :label="$t('view.button.show_previous_results')" style="margin: auto" @click="showPrevious = true" />
  </div> -->
  <div v-if="!isTaskRunning && isOldResult && !showPrevious" style="display: flex">
    <Button :label="$t('view.button.show_previous_results')" style="margin: auto" @click="showPrevious = true" />
  </div>
  <div v-if="workflowRun && workflowRun.state === 'Error'" style="display: flex">
    <WorkflowRunDetails :workflow-run="workflowRun" style="margin: auto; max-width: 60rem" @on-stop="onWorkflowStop" @click="showPrevious = true" />
  </div>

  <!-- <InformationPanelWrapper
    v-else-if="
      informationPanel && !isTaskRunning && (!isOldResult || showPrevious) && workflowRun && (workflowRun.ext == null || !workflowRun.ext.panel)
    "
    ref="panel"
    :panel="informationPanel"
    :edit-mode="false"
    :panel-settings="panelSettings"
    :filter="panelFilter"
  ></InformationPanelWrapper> -->
  <InformationPanel
    v-if="hasResults && (!isOldResult || showPrevious)"
    :edit="false"
    :panel-data="workflowRun.results.data"
    :panel="workflowRun.results.panel"
    :locked="true"
    :settings="{ tile_preview: false }"
    :filter="{}"
  />
  <!-- <div v-if="workflowRun">{{ workflowRun.results }}</div> -->

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
  <Dialog
    v-model:visible="workflowRunStartDialog"
    :style="{ width: '40rem' }"
    :class="'narrow'"
    :maximizable="true"
    :modal="true"
    :dismissable-mask="true"
  >
    <WorkflowRun :workflow="workflow" :multi-steps="multiSteps" :ext="{ panel: informationPanel }" @on-start="onWorkflowStart" />
  </Dialog>
  <Dialog v-model:visible="workflowRunDetailsDialog" :style="{ width: '40rem' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <WorkflowRunDetails :workflow-run="workflowRun" @on-stop="onWorkflowStop" />
  </Dialog>
  <Dialog v-model:visible="runlogDialog" :style="{ width: '95vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <PipelineRunLog :workflow="workflow" />
  </Dialog>
</template>

<script>
import WorkflowRunDetails from "@/components/admin/workflow/WorkflowRunDetails.vue";
import PipelineRunLog from "@/components/admin/PipelineRunLog.vue";
// import PipelineRunLog from "./PipelineRunLog.vue";
import WorkflowRun from "@/components/management/workflow/WorkflowRun.vue";
// import InformationPanelWrapper from "@/components/dashboard/informationpanel/InformationPanelWrapper.vue";

// import ParsedDateFilter from "@/components/miscellaneous/settings/ParsedDateFilter.vue";
import InformationPanel from "@/components/dashboard/informationpanel/InformationPanel.vue";
// import customPanel from "./panel.json";
export default {
  name: "WasteHeat",
  components: {
    InformationPanel,
    WorkflowRun,
    WorkflowRunDetails,
    // InformationPanelWrapper,
    // ParsedDateFilter,
    PipelineRunLog,
  },
  props: {
    workflow: { type: Object, default: null },
    workflowRun: { type: Object, default: null },
    panelSettings: { type: Object, default: () => {} },
    informationPanel: { type: Object, default: null },
    panelFilter: { type: Object, default: () => {} },
  },
  emits: ["reload", "update:filters", "select"],
  data() {
    // customPanel.panel.props.tile_preview = false;
    return {
      // panelWrapper: customPanel,
      showPrevious: false,
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
    isOldResult() {
      return this.workflowRun != null && this.workflowRun.start_time && Date.now() - this.workflowRun.end_time > 24 * 3600 * 1000;
    },
    hasResults() {
      return this.workflowRun != null && this.workflowRun.state == "Succeeded" && this.workflowRun.results != null;
    },
  },
  watch: {},
  created() {},
  async mounted() {
    if (this.workflowRun != null) {
      console.debug(this.workflowRun);
      console.debug(JSON.stringify(this.workflowRun.ext));
    } else {
      console.info("No available runs");
    }
  },
  methods: {
    showStartDialog(multiSteps) {
      this.multiSteps = multiSteps == null ? false : multiSteps;
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
