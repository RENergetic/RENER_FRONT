<template>
  <Card v-if="mModel">
    <template #content>
      <div class="ren">
        <ren-input v-model="mModel.run_id" :text-label="'model.workflowrun.run_id'" :read-only="true" />
        <ren-input v-model="startTime" :text-label="'model.workflowrun.start_time'" :read-only="true" :disabled="startTime == null" />
        <ren-input v-model="endTime" :text-label="'model.workflowrun.end_time'" :read-only="true" :disabled="endTime == null" />
        <ren-input v-model="state" :text-label="'model.workflowrun.state'" :read-only="true" :disabled="state == null" />
        <h3 v-if="mModel.parameters && Object.keys(mModel.parameters).length > 0">{{ $t("model.workflowrun.parameters") }}:</h3>
        <ren-input
          v-for="key in Object.keys(mModel.parameters)"
          :key="key"
          v-model="mModel.parameters[key]"
          :text-label="$t('view.workflowrun_param_format', { parameter: key })"
          :read-only="true"
        />

        <ren-input-wrapper v-if="workflowRun.start_time > 0 && !workflowRun.end_time">
          <template #content>
            <Button v-tooltip="$t('view.stop')" class="ren" icon="pi pi-stop" :label="$t('view.button.stop')" @click="stopConfirm" />
          </template>
        </ren-input-wrapper>
      </div>
    </template>
  </Card>
</template>

<script>
export default {
  name: "WorkflowRunDetails",
  components: {},
  props: { workflowRun: { type: Object, default: () => ({}) } },
  emits: ["onStop", "update"],
  data() {
    return {
      mModel: this.workflowRun,
      state: this.workflowRun.state
        ? this.$t("model.workflowrun.run_state." + this.workflowRun.state.toLowerCase())
        : this.$t("model.workflowrun.run_state.not_running"),
      startTime: this.workflowRun ? this.$ren.utils.dateString(this.workflowRun.start_time) : null,
      endTime: this.workflowRun ? this.$ren.utils.dateString(this.workflowRun.end_time) : null,
    };
  },
  computed: {
    workflowLabel: function () {
      let workflow = this.workflowRun != null && this.workflowRun.pipeline != null ? this.workflowRun.pipeline : null;
      if (workflow == null) return null;
      return workflow.name ? workflow.name : this.workflowRun.pipeline.pipeline_id;
    },
  },
  async mounted() {
    if (!this.mModel.endTime) {
      this.mModel = await this.$ren.kubeflowApi.getWorkflowRun(this.workflowRun.pipeline.pipeline_id);

      this.state = this.mModel.state
        ? this.$t("model.workflowrun.run_state." + this.mModel.state.toLowerCase())
        : this.$t("model.workflowrun.run_state.not_running");
      this.startTime = this.mModel ? this.$ren.utils.dateString(this.mModel.start_time) : null;
      this.endTime = this.mModel ? this.$ren.utils.dateString(this.mModel.end_time) : null;
      this.$emit("update", this.mModel);
    }
  },
  methods: {
    async stop() {
      let res = await this.$ren.kubeflowApi.stopExperiment(this.workflowRun.pipeline.pipeline_id);
      if (res) {
        this.$emitter.emit("information", {
          message: this.$t("information.worflow_stop", { label: this.workflowLabel }),
        });

        this.$emit("onStop", res);
      } else {
        this.$emitter.emit("error", { message: this.$t("error.worflow_stop", { label: this.workflowLabel }) });
        this.$emit("onStop", false);
      }
      console.error(res);
    },
    async stopConfirm() {
      await this.$confirm.require({
        message: this.$t("view.stop_run_confirm_body", {
          label: this.workflowRun.name ? this.workflowRun.name : this.workflowRun.id,
        }),
        header: this.$t("view.stop_run_confirm"),
        icon: "pi pi-exclamation-triangle",
        accept: async () => {
          await this.stop();
        },
        reject: () => {
          this.$confirm.close();
        },
      });
    },
  },
};
</script>
<style scoped lang="scss"></style>
