<template>
  <Card>
    <template #header>
      <h3>
        {{ $t("view.workflowrun_preview", { label: workflowLabel }) }}
      </h3>
    </template>
    <template #content>
      <RenSpinner ref="runspinner" :lock="true" style="width: 100%">
        <template #content>
          <div class="ren">
            <!-- {{ runParameters }} aaaaa {{ workflowParameters }} bbb
  {{ workflow }} -->
            <ren-input-wrapper>
              <template #content>
                <Settings v-if="schema && schema.length > 0" :schema="schema" :settings="runParameters" />
                <span v-else>{{ $t("view.no_parameters") }} </span>
              </template>
            </ren-input-wrapper>
            <ren-input-wrapper>
              <template #content>
                <Button v-tooltip="$t('view.start')" class="ren" icon="pi pi-play" :label="$t('view.button.start')" @click="startConfirm" />
              </template>
            </ren-input-wrapper>
          </div>
        </template>
      </RenSpinner>
    </template>
  </Card>
</template>

<script>
import Settings from "@/components/miscellaneous/settings/Settings.vue";
var parameterTypes = {};
export default {
  name: "WorkflowRun",
  components: {
    Settings,
  },
  props: { workflow: { type: Object, default: () => ({}) } },
  emits: ["update", "onStart"],
  data() {
    return {
      workflowParameters: this.workflow.parameters ? this.workflow.parameters : {},
      runParameters: {},
      schema: null,
    };
  },
  computed: {
    workflowLabel: function () {
      if (this.workflow == null) return null;
      return this.workflow.name ? this.workflow.name : this.workflow.experiment_id;
    },
  },
  watch: {
    mModel: {
      // handler: function (newVal) {
      //   this.$emit("update", newVal);
      // },
      // deep: true,
    },
  },
  async mounted() {
    // this.keys = Object.keys(this.mModel);
    this.schema = this.getSchema();
  },

  methods: {
    async start() {
      let experimentId = this.workflow.experiment_id;
      let parameters = this.runParameters;
      let res = null;
      await this.$refs.runspinner.run(
        async () => {
          res = await this.$ren.kubeflowApi.startExperiment(experimentId, parameters);
        },
        500,
        5000,
      );

      if (res && res.run_id) {
        this.$emitter.emit("information", { message: this.$t("information.worflowrun_start", { run_id: res.run_id }) });
        this.$emit("onStart", res);
      } else {
        this.$emitter.emit("error", { message: this.$t("error.worflowrun_start", { label: this.workflowLabel }) });
      }
    },
    async startConfirm() {
      await this.$confirm.require({
        message: this.$t("view.start_run_confirm_body", {
          label: this.workflowLabel,
        }),
        header: this.$t("view.start_run_confirm"),
        icon: "pi pi-exclamation-triangle",
        accept: async () => {
          await this.start();
        },
        reject: () => {
          this.$confirm.close();
        },
      });
    },
    getType(key) {
      return parameterTypes[key] ? parameterTypes[key] : String;
    },
    getSetting(key) {
      return {
        label: key,
        description: this.workflowParameters[key],
        ext: {},
        type: this.getType(key),
        key: key,
        defaultValue: "",
      };
    },
    getSchema() {
      var schema = Object.keys(this.workflowParameters).map((k) => this.getSetting(k));
      // schema.push({
      //   label: this.$t("view.button.start"),
      //   ext: {
      //     click: this.onClick,
      //   },
      //   type: "Submit",
      //   key: "startTask",
      // });
      return schema;
    },
  },
};
</script>
<style scoped lang="scss"></style>
