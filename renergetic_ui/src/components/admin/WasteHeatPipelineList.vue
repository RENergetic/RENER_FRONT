<template>
  <RenSpinner ref="spinner_temp" :lock="true" style="width: 100%">
    <template #content>
      <!-- v-model:selection="selectedWorkflow"
        :selection-mode="'single'" -->

      <!-- <template #header>
           </template> -->

      <!-- filter-display="row" -->
      <DataTable
        v-if="workflowList"
        v-model:expandedRows="expanded"
        :lazy="true"
        :filters="mFilters"
        data-key="pipeline_id"
        :value="workflowList"
        class="sticky-header"
        @filter="onFilter"
      >
        <template #header>
          <ren-switch v-model="mFilters.wasteheat_pipeline.value" :text-label="'model.workflow.property.wasteheat_pipeline'" />
        </template>
        <Column :expander="true" header-style="width: 3rem" />
        <Column field="name" :header="$t('model.workflow.name')" :show-filter-menu="false" />
        <Column field="pipeline_id" :header="$t('model.workflow.pipeline_id')" :show-filter-menu="false" />
        <template #expansion="slotProps">
          <h3 v-if="Object.keys(slotProps.data.parameters).length === 0">{{ $t("model.workflow.no_parameters") }}</h3>
          <h3 v-if="Object.keys(slotProps.data.parameters).length !== 0">{{ $t("model.workflow.parameters") }}</h3>
          <ul v-if="Object.keys(slotProps.data.parameters).length !== 0" class="ren">
            <li v-for="key in Object.keys(slotProps.data.parameters)" :key="key">
              {{ key }}
            </li>
          </ul>
          <span v-else> {{ $t("view.na") }} </span>
        </template>
        <Column field="current_run" :header="$t('model.workflow.current_run')" :show-filter-menu="false">
          <template #body="slotProps">
            <div v-if="isTaskRunning(slotProps.data.current_run)" @click="showRunDetails(slotProps.data.current_run)">
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

            <span v-else> {{ $t("model.workflowrun.run_state.not_running") }} </span>
          </template>
        </Column>
        <Column field="visible" :header="$t('model.workflow.property.wasteheat_pipeline')" :show-filter-menu="false">
          <template #body="slotProps">
            <span>
              <i
                v-if="!isWasteHeatEnabled(slotProps.data)"
                style="font-size: 1.5rem"
                class="pi pi-eye-slash"
                @click="setWasteHeatPipeline(slotProps.data, true)"
              />
              <i v-else style="font-size: 1.5rem" class="pi pi-eye" @click="setWasteHeatPipeline(slotProps.data, false)" />
            </span>
          </template>
        </Column>
        <Column field="default" :header="$t('model.workflow.property.wasteheat_default_pipeline')" :show-filter-menu="false">
          <template #body="slotProps">
            <span>
              <i
                v-if="!isWasteHeatDefault(slotProps.data)"
                style="font-size: 1.5rem"
                class="pi pi-star"
                @click="setDefaultWasteHeatPipeline(slotProps.data, true)"
              />
              <i v-else style="font-size: 1.5rem" class="pi pi-star-fill" @click="setDefaultWasteHeatPipeline(slotProps.data, false)" />
            </span>
          </template>
        </Column>
        <Column :show-filter-menu="false">
          <template #body="item">
            <i v-tooltip="$t('view.run_log')" class="pi pi-list" @click="showRunLog(item.data)" />
          </template>
        </Column>
      </DataTable>
    </template>
  </RenSpinner>

  <RenSpinner ref="spinner" />
  <Dialog v-model:visible="editParameterDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <WorkflowParameterForm
      v-if="selectedWorkflow && selectedParameter"
      v-model="selectedParameter"
      @update="onParameterUpdate($event)"
      @cancel="editParameterDialog = false"
    />
  </Dialog>
  <Dialog v-model:visible="workflowRunDetailsDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <WorkflowRunDetails :workflow-run="selectedWorkflow" @on-stop="onWorkflowStop" />
  </Dialog>
  <Dialog v-model:visible="runlogDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <PipelineRunLog :workflow="selectedWorkflow" />
  </Dialog>
</template>

<script>
import { DeferredFunction } from "@/plugins/renergetic/utils.js";
import WorkflowParameterForm from "./WorkflowParameterForm.vue";
import WorkflowRunDetails from "./WorkflowRunDetails.vue";
import PipelineRunLog from "./PipelineRunLog.vue";

export default {
  name: "WasteHeatPipelineList",
  components: { WorkflowParameterForm, WorkflowRunDetails, PipelineRunLog },
  props: {
    workflowList: { type: Array, default: () => [] },
    basic: { type: Boolean, default: false },
    filters: { type: Object, default: null },
  },
  emits: ["reload", "update:filters", "select"],
  data() {
    return {
      editParameterDialog: false,
      mOffset: 0,
      columns: [],
      expanded: [],
      runLogList: [],
      mFilters: this.initFilters(),
      selectedWorkflow: null,
      deferredEmitFilter: null,
      selectedWorkflowRunDetails: null,
      workflowRunDetailsDialog: false,
      runlogDialog: false,
    };
  },
  watch: {
    selectedWorkflow: function (v) {
      this.$emit("select", v);
    },
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
    // if (this.workflowList != null && this.workflowList.length > 0) {
    //   this.columns = await Object.keys(this.workflowList[0]);
    // }
  },
  methods: {
    onWorkflowStop(state) {
      console.debug(`Stop state ${state}`);
      this.workflowRunDetailsDialog = false;
      this.$emit("reload");
    },
    showRunDetails(workflowRun) {
      this.selectedWorkflowRunDetails = workflowRun;
      this.workflowRunDetailsDialog = true;
    },
    isWasteHeatEnabled: function (pipeline) {
      return (
        pipeline.properties &&
        pipeline.properties[this.WASTEHEAT_KUBEFLOW_PIPELINE] &&
        pipeline.properties[this.WASTEHEAT_KUBEFLOW_PIPELINE].value == "true"
      );
    },
    isWasteHeatDefault: function (pipeline) {
      return (
        pipeline.properties &&
        pipeline.properties[this.WASTEHEAT_KUBEFLOW_DEFAULT_PIPELINE] &&
        pipeline.properties[this.WASTEHEAT_KUBEFLOW_DEFAULT_PIPELINE].value == "true"
      );
    },
    isTaskRunning(workflowRun) {
      return workflowRun && workflowRun.start_time && (workflowRun.end_time == null || workflowRun.end_time < 0);
    },

    async showRunLog(workflow) {
      this.selectedWorkflow = workflow;
      this.runlogDialog = true;
    },

    async setWasteHeatPipeline(pipeline, state) {
      if (!state && this.isWasteHeatDefault(pipeline)) {
        await this.setDefaultWasteHeatPipeline(pipeline, false);
        // this.$emitter.emit("error", { message: this.$t("information.hdr_cannot_disable_default") });
        // return;
      }
      await this.$refs.spinner.run(async () => {
        let res = await this.$ren.kubeflowApi.setPipelineProperty(pipeline.pipeline_id, this.WASTEHEAT_KUBEFLOW_PIPELINE, state);
        if (res.value == state.toString()) {
          this.$emitter.emit("information", { message: this.$t("information.pipeline_property_changed") });
          this.$emit("reload");
        } else this.$emitter.emit("error", { message: this.$t("information.pipeline_property_not_changed") });
      });
    },
    async setDefaultWasteHeatPipeline(pipeline, state) {
      if (state && !this.isWasteHeatEnabled(pipeline)) {
        await this.setWasteHeatPipeline(pipeline, true);
      }
      await this.$refs.spinner.run(async () => {
        let res = await this.$ren.kubeflowApi.setPipelineProperty(pipeline.pipeline_id, this.WASTEHEAT_KUBEFLOW_DEFAULT_PIPELINE, state, true);
        if (res && res.value == state.toString()) {
          this.$emitter.emit("information", { message: this.$t("information.pipeline_property_changed") });
          this.$emit("reload");
        } else this.$emitter.emit("error", { message: this.$t("information.pipeline_property_not_changed") });
      });
    },
    initFilters() {
      let pf = this.$ren.utils.toPrimeFilter(this.filters);
      return { ...{ wasteheat_pipeline: { value: null } }, ...pf };
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
  },
};
</script>

<style lang="scss"></style>
