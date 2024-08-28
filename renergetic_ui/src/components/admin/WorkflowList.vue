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
          <ren-switch v-model="mFilters.visible.value" :text-label="'model.workflow.visibility'" />
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
              <Button
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
              />
            </li>
          </ul>
          <span v-else> {{ $t("view.na") }} </span>
          <h3 v-if="Object.keys(slotProps.data.properties).length === 0">{{ $t("model.workflow.no_properties") }}</h3>
          <h3 v-if="Object.keys(slotProps.data.properties).length !== 0">{{ $t("model.workflow.properties") }}</h3>

          <ul v-if="Object.keys(slotProps.data.properties).length !== 0" class="ren">
            <li v-for="key in Object.keys(slotProps.data.properties)" :key="key">
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
        <Column field="visible" :header="$t('model.workflow.visible')" :show-filter-menu="false">
          <template #body="slotProps">
            <span v-if="!isTaskRunning(slotProps.data.current_run)">
              <i v-if="slotProps.data.visible" class="pi pi-eye" style="font-size: 1.5rem" @click="setPipelineVisibility(slotProps.data, false)" />
              <i v-else class="pi pi-eye-slash" style="font-size: 1.5rem" @click="setPipelineVisibility(slotProps.data, true)" />
            </span>
            <span v-else>
              <i v-if="slotProps.data.visible" style="font-size: 1.5rem" class="pi pi-eye disabled" />
              <i v-else style="font-size: 1.5rem" class="pi pi-eye-slash" @click="setPipelineVisibility(slotProps.data, true)" />
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
// TODO: move constant values to other file
// import InfoIcon from "@/components/miscellaneous/InfoIcon.vue";
import { DeferredFunction } from "@/plugins/renergetic/utils.js";
import WorkflowParameterForm from "./WorkflowParameterForm.vue";
import WorkflowRunDetails from "./WorkflowRunDetails.vue";
export default {
  name: "WorkflowList",
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
  computed: {},
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
    async onParameterUpdate(evt) {
      this.selectedWorkflow.parameters[evt.key] = evt;
      this.editParameterDialog = false;
      await this.$refs.spinner.run(async () => {
        let res = await this.$ren.kubeflowApi.setParameters(this.selectedWorkflow.pipeline_id, this.selectedWorkflow.parameters);
        if (res != null) this.selectedWorkflow.parameters = res;
      });
    },
    editParameter(workflow, selectedParameter) {
      this.selectedParameter = selectedParameter;
      this.selectedWorkflow = workflow;
      this.editParameterDialog = true;
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

    async runTask(selectedExperiment) {
      console.error("remove this option in the admin menu");
      console.warn(selectedExperiment);
      console.error(" TODO: check if task hasn't already been running");
      await this.$refs.spinner_temp.run(
        async () => {
          await this.$ren.kubeflowApi.startExperiment(selectedExperiment.pipeline_id, {});
        },
        500,
        5000,
      );
      alert("task scheduled");
      this.reload();
    },
    async setPipelineVisibility(selectedExperiment, state) {
      await this.$refs.spinner.run(async () => {
        let res;
        if (state) {
          res = await this.$ren.kubeflowApi.showExperiment(selectedExperiment.pipeline_id);
        } else {
          res = await this.$ren.kubeflowApi.hideExperiment(selectedExperiment.pipeline_id);
        }
        if (res == state) {
          this.$emitter.emit("information", { message: this.$t("information.visibility_changed") });
          selectedExperiment.visible = state;
          this.$emit("reload");
        } else this.$emitter.emit("error", { message: this.$t("information.visibility_not_changed") });
      });
    },
    initFilters() {
      let pf = this.$ren.utils.toPrimeFilter(this.filters);
      return { ...{ visible: { value: null } }, ...pf };
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
