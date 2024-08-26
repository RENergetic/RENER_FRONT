<template>
  <!-- workflows: {{ workflowList }} -->
  <RenSpinner ref="spinner_temp" :lock="true" style="width: 100%">
    <template #content>
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
        <template #header>
          <ren-switch v-model="mFilters.hdr_pipeline.value" :text-label="'model.workflow.property.hdr_pipeline'" />
          <!-- <span class="p-input-icon-left" style="margin-left: 1rem">
        <i class="pi pi-search" /> -->
          <!-- <Dropdown v-model="mFilters.visible.value" show-clear :options="tagsKeys" :placeholder="$t('view.tag_filter')" /> -->
          <!-- </span> -->
        </template>
        <Column :expander="true" header-style="width: 3rem" />
        <Column field="name" :header="$t('model.workflow.name')" :show-filter-menu="false" />
        <Column field="pipeline_id" :header="$t('model.workflow.pipeline_id')" :show-filter-menu="false" />
        <template #expansion="slotProps">
          <h3 v-if="Object.keys(slotProps.data.parameters).length === 0">{{ $t("model.workflow.no_parameters") }}</h3>
          <h3 v-if="Object.keys(slotProps.data.parameters).length !== 0">{{ $t("model.workflow.parameters") }}</h3>
          <ul v-if="Object.keys(slotProps.data.parameters).length !== 0" class="ren">
            <li v-for="key in Object.keys(slotProps.data.parameters)" :key="key">
              <!-- {{ slotProps.data.parameters[key] }} -->

              {{ key }}
              <!-- <Button
                v-if="slotProps.data.parameters[key].visible"
                v-tooltip="$t('view.edit')"
                icon="pi pi-pencil"
                class="p-button-rounded"
                @click="editParameter(slotProps.data, slotProps.data.parameters[key])"
              />
              <Button
                v-else
                v-tooltip="$t('view.edit')"
                icon="pi pi-pencil"
                class="p-button-rounded state error"
                @click="editParameter(slotProps.data, slotProps.data.parameters[key])"
              /> -->
            </li>
          </ul>
          <span v-else> {{ $t("view.na") }} </span>
        </template>
        <!-- <Column field="parameters" :header="$t('model.workflow.parameters')" :show-filter-menu="false">
          <template #body="slotProps">
            <div v-if="slotProps.data.parameters">{{ Object.keys(slotProps.data.parameters).length }}</div>
            <span v-else> {{ $t("view.na") }} </span>
          </template>
        </Column>  -->
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
        <Column field="visible" :header="$t('model.workflow.property.hdr_pipeline')" :show-filter-menu="false">
          <template #body="slotProps">
            <span>
              <i
                v-if="!isHDREnabled(slotProps.data)"
                style="font-size: 1.5rem"
                class="pi pi-eye-slash"
                @click="setHDRPipeline(slotProps.data, true)"
              />
              <i v-else style="font-size: 1.5rem" class="pi pi-eye" @click="setHDRPipeline(slotProps.data, false)" />
            </span>
          </template>
        </Column>
        <Column field="default" :header="$t('model.workflow.default')" :show-filter-menu="false">
          <template #body="slotProps">
            <span>
              <i v-if="!isHDRDefault(slotProps.data)" style="font-size: 1.5rem" class="pi pi-star" @click="setDefaultHDRPipeline(slotProps.data)" />
              <i v-else style="font-size: 1.5rem" class="pi pi-star-fill" />
            </span>
          </template>
        </Column>
        <Column :show-filter-menu="false">
          <template #body="item">
            <i v-tooltip="$t('view.run_log')" class="pi pi-list" @click="showRunLog(item.data)" />

            <!-- <Button :label="$t('view.button.start')" icon="pi pi-cog" @click="runTask(item.data)" /> -->
          </template>
        </Column>
        <!-- <Column v-if="!basic" selection-mode="multiple" header-style="width: 3rem"></Column> -->
      </DataTable>
    </template>
  </RenSpinner>

  <RenSpinner ref="spinner" />
  <!-- <ren-paginator v-if="measurementList" v-model:offset="mOffset" style="left: 0" sticky :current-rows="measurementList.length" @update="reload" /> -->
  <Dialog v-model:visible="editParameterDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <WorkflowParameterForm
      v-if="selectedWorkflow && selectedParameter"
      v-model="selectedParameter"
      @update="onParameterUpdate($event)"
      @cancel="editParameterDialog = false"
    />
  </Dialog>
  <Dialog v-model:visible="workflowRunDetailsDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <WorkflowRunDetails :workflow-run="selectedWorkflowRunDetails" @on-stop="onWorkflowStop" />
  </Dialog>
  <Dialog v-model:visible="runlogDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <DataTable v-if="runLogList" :lazy="true" data-key="run_id" :value="runLogList" class="sticky-header">
      <Column field="run_id" :header="$t('model.workflowrun.run_id')" />

      <Column field="pipeline" :header="$t('model.workflowrun.pipeline')">
        <template #body="slotProps">
          <!-- {{ slotProps.data.pipeline.name }} :  -->
          {{ slotProps.data.pipeline.pipeline_id }}
        </template>
      </Column>
      <Column field="start_time" :header="$t('model.workflowrun.start_time')">
        <template #body="slotProps">
          {{ $ren.utils.dateString(slotProps.data.start_time) }}
        </template>
      </Column>
      <Column field="end_time" :header="$t('model.workflowrun.end_time')">
        <template #body="slotProps">
          {{ $ren.utils.dateString(slotProps.data.end_time) }}
        </template>
      </Column>
      <Column field="state" :header="$t('model.workflowrun.state')">
        <template #body="slotProps">
          {{ slotProps.data.state }}
        </template>
      </Column>
      <Column>
        <template #body="slotProps">
          <i class="pi pi-chevron-circle-right" @click="showRunDetails(slotProps.data)" />
        </template>
      </Column>
    </DataTable>
  </Dialog>
</template>

<script>
import { DeferredFunction } from "@/plugins/renergetic/utils.js";
import WorkflowParameterForm from "./WorkflowParameterForm.vue";
import WorkflowRunDetails from "./WorkflowRunDetails.vue";
export default {
  name: "HDRPipelineList",
  components: { WorkflowParameterForm, WorkflowRunDetails },
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
    if (this.measurementList != null && this.measurementList.length > 0) {
      this.columns = await Object.keys(this.measurementList[0]);
    }
    this.tagsKeys = await this.$ren.managementApi.listTagKeys();
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
    // async onParameterUpdate(evt) {
    //   this.selectedWorkflow.parameters[evt.key] = evt;
    //   this.editParameterDialog = false;
    //   await this.$refs.spinner.run(async () => {
    //     let res = await this.$ren.kubeflowApi.setParameters(this.selectedWorkflow.pipeline_id, this.selectedWorkflow.parameters);
    //     if (res != null) this.selectedWorkflow.parameters = res;
    //   });
    // },
    // editParameter(workflow, selectedParameter) {
    //   this.selectedParameter = selectedParameter;
    //   this.selectedWorkflow = workflow;
    //   this.editParameterDialog = true;
    // },
    isHDREnabled: function (pipeline) {
      return (
        pipeline.properties && pipeline.properties[this.HDR_KUBEFLOW_PIPELINE] && pipeline.properties[this.HDR_KUBEFLOW_PIPELINE].value == "true"
      );
    },
    isHDRDefault: function (pipeline) {
      return (
        pipeline.properties &&
        pipeline.properties[this.HDR_KUBEFLOW_DEFAULT_PIPELINE] &&
        pipeline.properties[this.HDR_KUBEFLOW_DEFAULT_PIPELINE].value == "true"
      );
    },
    isTaskRunning(workflowRun) {
      return workflowRun && workflowRun.start_time && (workflowRun.end_time == null || workflowRun.end_time < 0);
    },

    async showRunLog(workflow) {
      var lastWeek = this.$ren.utils.currentTimestamp() - 1000 * 3600 * 24 * 7;
      await this.$refs.spinner_temp.run(async () => {
        this.runLogList = await this.$ren.kubeflowApi.listRuns({ pipelineId: workflow.pipeline_id, from: lastWeek });
        this.runlogDialog = true;
      });
    },

    async setHDRPipeline(pipeline, state) {
      if (!state && this.isHDRDefault(pipeline)) {
        this.$emitter.emit("error", { message: this.$t("information.hdr_cannot_disable_default") });
        return;
      }
      await this.$refs.spinner.run(async () => {
        let res = await this.$ren.kubeflowApi.setHDRPipeline(pipeline.pipeline_id, state);
        if (res.value == state.toString()) {
          this.$emitter.emit("information", { message: this.$t("information.pipeline_property_changed") });
          this.$emit("reload");
        } else this.$emitter.emit("error", { message: this.$t("information.pipeline_property_not_changed") });
      });
    },
    async setDefaultHDRPipeline(pipeline) {
      if (!this.isHDREnabled(pipeline)) {
        await this.setHDRPipeline(pipeline, true);
      }
      await this.$refs.spinner.run(async () => {
        let res = await this.$ren.kubeflowApi.setDefaultHDRPipeline(pipeline.pipeline_id);
        if (res && res.value == "true") {
          this.$emitter.emit("information", { message: this.$t("information.pipeline_property_changed") });
          this.$emit("reload");
        } else this.$emitter.emit("error", { message: this.$t("information.pipeline_property_not_changed") });
      });
    },
    initFilters() {
      let pf = this.$ren.utils.toPrimeFilter(this.filters);
      return { ...{ hdr_pipeline: { value: null } }, ...pf };
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
