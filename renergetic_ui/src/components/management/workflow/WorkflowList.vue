<template>
  <DataTable
    v-if="workflowList"
    v-model:expandedRows="expanded"
    v-model:selection="selectedWorkflow"
    :selection-mode="'single'"
    :filters="mFilters"
    :lazy="true"
    data-key="pipeline_id"
    :value="workflowList"
    filter-display="row"
    class="sticky-header"
    @filter="onFilter"
  >
    <!-- <template #header>
       <ren-switch v-model="mFilters.visible.value" :text-label="'model.workflow.visibility'" /> 
    </template> -->

    <Column :expander="true" header-style="width: 3rem" />
    <Column field="name" :header="$t('model.workflow.name')" :show-filter-menu="false" />
    <Column field="pipeline_id" :header="$t('model.workflow.pipeline_id')" :show-filter-menu="false" />
    <template #expansion="slotProps">
      <ul v-if="slotProps.data.parameters">
        <li v-for="key in Object.keys(slotProps.data.parameters)" :key="key">{{ key }}</li>
      </ul>
      <span v-else> {{ $t("view.na") }} </span>
    </template>
    <Column field="parameters" :header="$t('model.workflow.parameters')" :show-filter-menu="false">
      <template #body="slotProps">
        <div v-if="slotProps.data.parameters">{{ Object.keys(slotProps.data.parameters).length }}</div>

        <span v-else> {{ $t("view.na") }} </span>
      </template>
    </Column>
    <!-- <Column field="pipelines" :header="$t('model.workflow.pipelines')" :show-filter-menu="false">
      <template #body="slotProps">
        <span v-if="slotProps.data.pipelines"> {{ $t("model.workflow.pipelines", { length: slotProps.data.pipelines.length }) }}</span>
        <span v-else> {{ $t("view.na") }} </span>
      </template>
    </Column> -->
    <Column field="current_run" :header="$t('model.workflow.current_run')" :show-filter-menu="false">
      <template #body="slotProps">
        <div v-if="isTaskRunning(slotProps.data.current_run)" @click="showRunDetails(slotProps.data)">
          <div>
            {{
              slotProps.data.current_run.name
                ? `${slotProps.data.current_run.name} (${slotProps.data.current_run.run_id})`
                : slotProps.data.current_run.run_id
            }}
          </div>
          <div class="disabled">
            {{ $t("model.workflowrun.start_time_formatted", { start_time: $ren.utils.dateString(slotProps.data.current_run.start_time) }) }}
          </div>
        </div>

        <span v-else class="disabled">
          <div v-if="slotProps.data.current_run != null" @click="showRunDetails(slotProps.data)">
            {{ $t("model.workflowrun.run_state.not_running") }}
          </div>
          <div v-else>{{ $t("model.workflowrun.run_state.not_running") }}</div>
        </span>
      </template>
    </Column>

    <Column :show-filter-menu="false">
      <template #body="slotProps">
        <Button
          :label="$t('view.button.start')"
          icon="pi pi-play"
          :disabled="false && isTaskRunning(slotProps.data)"
          @click="showStartDialog(slotProps.data)"
        />
      </template>
    </Column>
    <!-- <Column v-if="!basic" selection-mode="multiple" header-style="width: 3rem"></Column> -->
  </DataTable>
  <RenSpinner ref="spinner" />

  <!-- <ren-paginator v-if="measurementList" v-model:offset="mOffset" style="left: 0" sticky :current-rows="measurementList.length" @update="reload" /> -->
  <Dialog v-model:visible="workflowRunDetailsDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <WorkflowRunDetails :workflow-run="selectedWorkflowRunDetails" @on-stop="onWorkflowStop" @update="onRunUpdate" />
  </Dialog>
  <Dialog v-model:visible="workflowRunStartDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <WorkflowRun :workflow="selectedWorkflow" @on-start="onWorkflowStart" />
  </Dialog>
</template>

<script>
// import InfoIcon from "@/components/miscellaneous/InfoIcon.vue";
import { DeferredFunction } from "@/plugins/renergetic/utils.js";
import WorkflowRunDetails from "./WorkflowRunDetails.vue";
import WorkflowRun from "./WorkflowRun.vue";

export default {
  name: "WorkflowList",
  components: { WorkflowRunDetails, WorkflowRun },
  props: {
    workflowList: { type: Array, default: () => [] },
    basic: { type: Boolean, default: false },
    filters: { type: Object, default: null },
  },
  emits: ["reload", "update:filters", "select"],
  data() {
    return {
      mOffset: 0,
      columns: [],
      expanded: [],
      mFilters: this.initFilters(),
      selectedWorkflow: null,
      deferredEmitFilter: null,
      selectedWorkflowRunDetails: null,
      selectedWorkflowDetails: null,
      workflowRunDetailsDialog: false,
      workflowRunStartDialog: false,
    };
  },
  computed: {},
  watch: {
    // selectedWorkflow: function (v) {
    //   this.$emit("select", v);
    // },
    mFilters: {
      handler: async function () {
        this.onFilter();
      },
      deep: true,
    },
  },
  created() {
    this.mFilters = this.initFilters();
    this.deferredEmitFilter = new DeferredFunction(this._emitFilter);
  },
  async mounted() {
    if (this.measurementList != null && this.measurementList.length > 0) {
      this.columns = await Object.keys(this.measurementList[0]);
    }
    this.tagsKeys = await this.$ren.managementApi.listTagKeys();
  },
  methods: {
    isTaskRunning(workflowRun) {
      return workflowRun && workflowRun.start_time && (workflowRun.end_time == null || workflowRun.end_time < 0);
    },

    initFilters() {
      let pf = this.$ren.utils.toPrimeFilter(this.filters);
      return { ...{ visible: { value: true } }, ...pf };
    },
    _emitFilter() {
      this.$emit("update:filters", this.$ren.utils.fromPrimeFilter(this.mFilters));
    },
    async onFilter() {
      await this.deferredEmitFilter.run();
    },
    reload() {
      this.$emit("reload");
    },
    showRunDetails(workflow) {
      this.selectedWorkflowDetails = workflow;
      this.selectedWorkflowRunDetails = workflow.current_run;
      this.workflowRunDetailsDialog = true;
    },
    onRunUpdate(workflowRun) {
      this.selectedWorkflowDetails.current_run = workflowRun;
    },
    onWorkflowStop(state) {
      console.debug(`Stop state ${state}`);
      this.workflowRunDetailsDialog = false;
      this.$emit("reload");
    },
    showStartDialog(workflow) {
      console.warn(workflow);
      console.error(" TODO: check if task hasn't already been running");
      this.selectedWorkflow = workflow;
      this.workflowRunStartDialog = true;
    },
    onWorkflowStart(workflowRun) {
      console.debug(workflowRun);
      this.workflowRunStartDialog = false;
      this.$emit("reload");
    },
  },
};
</script>

<style lang="scss"></style>
