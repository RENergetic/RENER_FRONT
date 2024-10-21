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
          <div class="ren" style="width: 100; max-width: 30rem; margin: auto">
            <Stepper v-model:activeStep="active" orientation="vertical">
              <StepperPanel :header="$t('view.simulation_settings', [index])">
                <template #content="{ nextCallback }">
                  <ren-input-wrapper>
                    <template #content>
                      <ren-input-number
                        v-if="multiSteps"
                        v-model="simulationNumber"
                        :text-label="'model.workflow.simulation_number'"
                        :min="1"
                        :max="5"
                        :only-integer="true"
                      />
                      <ren-input v-model="simulationName" :text-label="'model.workflow.simulation_label'" :read-only="true" />
                    </template>
                  </ren-input-wrapper>
                  <ren-input-wrapper>
                    <template #content> <Button :label="$t('view.button.next')" @click="nextCallback" /> </template
                  ></ren-input-wrapper>
                </template>
              </StepperPanel>
              <StepperPanel v-if="!multiSteps" :header="$t('view.simulation_params')">
                <template #content="{ nextCallback }">
                  <ren-input-wrapper />

                  <ren-input-wrapper>
                    <template #content>
                      <!-- {{ item }} -->
                      <Settings v-if="schema && schema.length > 0" :schema="schema" :settings="item" />
                      <span v-else>{{ $t("view.no_parameters") }} </span>
                    </template>
                  </ren-input-wrapper>
                  <ren-input-wrapper>
                    <template #content> <Button :label="$t('view.button.next')" @click="nextCallback" /> </template>
                  </ren-input-wrapper>
                </template>
              </StepperPanel>

              <StepperPanel v-for="(item, idx) in runParametersList" :key="idx" :header="$t('model.workflow.simulation_index', [index])">
                <!-- <template #header="{ index, clickCallback }">
                  <div v-if="index == active" style="width: 100%">{{ $t("model.workflow.simulation_index", [index]) }}</div>
                  <div v-else style="width: 100%" @click="clickCallback">{{ $t("model.workflow.simulation_index", [index]) }}</div>
                </template> -->
                <template #content="{ prevCallback, nextCallback }">
                  <ren-input-wrapper />
                  <ren-input-wrapper v-if="multiSteps">
                    <template #content>
                      <div style="display: flex; width: 100%; justify-content: space-between">
                        <Button :disabled="active < 1 + 1" :label="$t('view.button.previous')" @click="prevCallback" />
                        <Button :disabled="active == 0 + 1" :label="$t('view.button.top')" @click="() => (active = 1)" />
                        <Button :disabled="active >= simulationNumber + 1" :label="$t('view.button.next')" @click="nextCallback" />
                      </div>
                    </template>
                  </ren-input-wrapper>
                  <ren-input-wrapper>
                    <template #content>
                      <Settings v-if="schema && schema.length > 0" :schema="schema" :settings="item" />
                      <span v-else>{{ $t("view.no_parameters") }} </span>
                    </template>
                  </ren-input-wrapper>
                </template>
              </StepperPanel>
              <StepperPanel :header="$t('view.start')">
                <template #content>
                  <!-- <template #content="{ prevCallback, nextCallback }"> -->
                  <ren-input-wrapper />
                  <!-- <ren-input-wrapper>
                    <template #content>
                      <div style="display: flex; width: 100%; justify-content: space-between; max-width: 20rem">
                        <Button :label="$t('view.button.previous')" @click="prevCallback" />
                        <Button :label="$t('view.button.top')" @click="() => (active = 1)" />
                        <Button :disabled="true" :label="$t('view.button.next')" @click="nextCallback" />
                      </div>
                    </template>
  </ren-input-wrapper> -->
                  <ren-input-wrapper>
                    <template #content>
                      <Button v-tooltip="$t('view.start')" icon="pi pi-play" :label="$t('view.button.start')" @click="startConfirm" />
                    </template>
                  </ren-input-wrapper>
                </template>
              </StepperPanel>
            </Stepper>
          </div>
        </template>
      </RenSpinner>
    </template>
  </Card>
</template>

<script>
import Settings from "@/components/miscellaneous/settings/Settings.vue";
import Stepper from "primevue/stepper";
import StepperPanel from "primevue/stepperpanel";
export default {
  name: "WorkflowRun",
  components: {
    Settings,
    Stepper,
    StepperPanel,
  },
  props: { workflow: { type: Object, default: () => ({}) }, multiSteps: { type: Boolean, default: false } },
  emits: ["update", "onStart"],
  data() {
    return {
      workflowParameters: this.workflow.parameters ? this.workflow.parameters : {},
      runParameters: {}, //this.multiSteps ? null : {},
      runParametersList: this.multiSteps ? [{}] : [],
      simulationNumber: 1,
      schema: null,
      active: 0,
      simulationName: "case1",
    };
  },
  computed: {
    workflowLabel: function () {
      if (this.workflow == null) return null;
      return this.workflow.name ? this.workflow.name : this.workflow.pipeline_id;
    },
  },
  watch: {
    simulationNumber: {
      handler: function (newVal) {
        if (this.runParametersList.length > newVal) {
          this.runParametersList = this.runParametersList.slice(0, newVal);
        } else if (this.runParametersList.length < newVal) {
          var arr = Array(newVal - this.runParametersList.length).fill({});
          arr = [...this.runParametersList, ...arr];
          this.runParametersList = arr;
        }
      },
    },
    multiSteps: {
      handler: function (newVal, prevVal) {
        if (newVal) {
          this.runParametersList = !prevVal ? [this.runParametersList] : [{}];
        } else {
          this.runParametersList = prevVal ? this.runParametersList[0] : {};
        }
      },
    },
  },
  async mounted() {
    // this.keys = Object.keys(this.mModel);
    let rp = Object.fromEntries(Object.keys(this.workflowParameters).map((key) => [key, null]));
    // this.runParameters = this.multiSteps ? [rp] : rp;

    this.runParameters = this.multiSteps ? {} : rp;
    this.runParametersList = this.multiSteps ? [rp] : [];
    this.schema = this.getSchema();
  },

  methods: {
    async start() {
      let experimentId = this.workflow.pipeline_id;
      let parameters = this.runParameters;
      if (this.multiSteps) {
        parameters.simulations_parameters = this.simulations_parameters;
      }
      parameters.simulation_name = this.simulationName;
      let res = null;
      await this.$refs.runspinner.run(
        async () => {
          res = await this.$ren.kubeflowApi.startExperiment(experimentId, this.simulationName, parameters);
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
    getType(param) {
      let propertyType = param.type ? param.type.toLowerCase() : String;
      if (propertyType == "array") propertyType == String;
      if (propertyType == "json") propertyType == String;
      return propertyType;
    },
    getExt(propertyType) {
      if (propertyType == "boolean") {
        return {
          true: this.$t("settings.yes"),
          false: this.$t("settings.no"),
        };
      }
      return {};
    },
    getSetting(param) {
      let key = param.key;
      let propertyType = this.getType(key);

      return {
        label: param.label ? `${param.label} (${key})` : key,
        description: param.description,
        ext: this.getExt(propertyType),
        type: this.getType(param),
        key: key,
        defaultValue: param.defaultValue,
      };
    },
    getSchema() {
      var schema = Object.values(this.workflowParameters).map((param) => this.getSetting(param));

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
