<template>
  <DataTable
    v-if="workflowList"
    v-model:selection="selectedWorkflow"
    :selection-mode="'single'"
    :filters="mFilters"
    :lazy="true"
    data-key="experiment_id"
    :value="workflowList"
    filter-display="row"
    class="sticky-header"
    @filter="onFilter"
  >
    <template #header>
      <!-- <ren-switch v-model="mFilters.visible.value" :text-label="'model.workflow.visibility'" /> -->
    </template>

    <Column field="name" :header="$t('model.workflow.name')" :show-filter-menu="false" />
    <Column field="experiment_id" :header="$t('model.workflow.experiment_id')" :show-filter-menu="false" />
    <Column field="parameters" :header="$t('model.workflow.parameters')" :show-filter-menu="false">
      <template #body="slotProps">
        <ul v-if="slotProps.data.parameters">
          <li v-for="key in Object.keys(slotProps.data.parameters)" :key="key">{{ key }}</li>
        </ul>
        <span v-else> {{ $t("view.na") }} </span>
      </template>
    </Column>
    <Column field="pipelines" :header="$t('model.workflow.pipelines')" :show-filter-menu="false">
      <template #body="slotProps">
        <span v-if="slotProps.data.pipelines"> {{ $t("model.workflow.pipelines", { length: slotProps.data.pipelines.length }) }}</span>
        <span v-else> {{ $t("view.na") }} </span>
      </template>
    </Column>
    <Column field="current_run" :header="$t('model.workflow.current_run')" :show-filter-menu="false">
      <template #body="slotProps">
        <div
          v-if="
            slotProps.data.current_run &&
            slotProps.data.current_run.start_time &&
            (slotProps.data.current_run.end_time == null || slotProps.data.current_run.end_time < 0)
          "
          @click="showRunDetails(slotProps.data.current_run)"
        >
          <div>
            {{ slotProps.data.current_run.run_id }}
          </div>
          <div class="disabled">_start time:{{ new Date(slotProps.data.current_run.start_time).toUTCString() }}</div>
        </div>

        <span v-else> {{ $t("model.workflow.run_state.not_running") }} </span>
      </template>
    </Column>

    <Column :header="$t('model.workflow.run_task')" :show-filter-menu="false">
      TODO: check if task hasn't already been running
      <template #body="item"> <Button :label="$t('view.button.start')" icon="pi pi-cog" @click="runTask(item.data)" /> </template>
    </Column>
    <!-- <Column v-if="!basic" selection-mode="multiple" header-style="width: 3rem"></Column> -->
  </DataTable>
  <RenSpinner ref="spinner" />

  <!-- <ren-paginator v-if="measurementList" v-model:offset="mOffset" style="left: 0" sticky :current-rows="measurementList.length" @update="reload" /> -->
  <Dialog v-model:visible="workflowRunDetailsDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <WorkflowRunDetails :workflow="selectedWorkflowRunDetails" />
  </Dialog>
</template>

<script>
// import InfoIcon from "@/components/miscellaneous/InfoIcon.vue";
import { DeferredFunction } from "@/plugins/renergetic/utils.js";
import WorkflowRunDetails from "./WorkflowRunDetails.vue";

export default {
  name: "WorkflowList",
  components: { WorkflowRunDetails },
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
      mFilters: this.initFilters(),
      selectedWorkflow: null,
      deferredEmitFilter: null,
      selectedWorkflowRunDetails: null,
      workflowRunDetailsDialog: false,
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
    async runTask(selectedExperiment) {
      console.warn(selectedExperiment);
      console.error(" TODO: check if task hasn't already been running");
      await this.$ren.kubeflowApi.startExperiment(selectedExperiment.experiment_id, {});
    },
    async setExperimentVisibility(selectedExperiment, state) {
      await this.$refs.spinner.run(async () => {
        let res;
        if (state) {
          res = await this.$ren.kubeflowApi.showExperiment(selectedExperiment.experiment_id);
        } else {
          res = await this.$ren.kubeflowApi.hideExperiment(selectedExperiment.experiment_id);
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
    showRunDetails(workflowRun) {
      this.selectedWorkflowRunDetails = workflowRun;
      this.workflowRunDetailsDialog = true;
    },
  },
};
</script>

<style lang="scss"></style>
