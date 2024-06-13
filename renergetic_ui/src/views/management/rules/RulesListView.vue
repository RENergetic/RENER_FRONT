<template>
  <Card style="width: 95%; margin: auto; margin-top: 1%">
    <template #title>{{ $t("view.rules_page_title") }} </template>
    <template #content>
      <div class="w-full md:w-200rem">
        <TreeTable v-model:expandedKeys="expandedKeys" :value="localRules">
          <Column field="label" headerStyle="width: 15rem" header="Rules" expander></Column>
          <Column headerStyle="width: 10rem" header="Status">
            <template #body="slotProps">
              <div v-if="!slotProps.node.selectable" class="flex justify-content-center flex-fill gap-2">
                <Checkbox v-model="slotProps.node.active" :binary="true" />
              </div>
              <div v-else>
                <Dropdown
                  v-if="slotProps.node.selectable"
                  v-model="slotProps.node.data.selected"
                  :placeholder="$t('view.rules_node_type')"
                  :options="nodeTypes"
                  optionLabel="label"
                  optionValue="value"
                  @change="onRuleTypeChange($event, slotProps.node)"
                  class="w-full md:w-8rem"
                />
              </div>
            </template>
          </Column>
          <Column header="Definition/Action">
            <template #body="slotProps">
              <div class="flex flex-wrap gap-2">
                <div class="fixed-error" :class="{ 'has-error': hasError(slotProps.node.key) }"></div>
                <div v-if="slotProps.node.data.selected === 'rule'" class="flex justify-content-center flex-column flex-wrap flex-fill gap-2">
                  <div class="flex justify-content-center flex-fill flex-wrap gap-2">
                    <div class="flex flex-column gap-2">
                      <label>{{ $t("view.rules_multiplier_label") }}</label>
                      <InputText
                        v-model="slotProps.node.data.ruleDefinition.measurement1.multiplier"
                        v-tooltip.bottom="$t('view.rules_number_tooltip')"
                        class="md:w-5rem"
                        :class="{ 'invalid-input': hasError(slotProps.node.key, 'ms1-multiplier') }"
                        type="number"
                        @input="(event) => validateOnlyNumberOrEmpty(event.target.value, slotProps.node.key, 'ms1-multiplier')"
                      />
                    </div>
                    <div class="flex flex-column gap-2">
                      <label>{{ $t("view.rules_function_label") }}</label>
                      <Dropdown
                        v-model="slotProps.node.data.ruleDefinition.measurement1.function"
                        :placeholder="dropdownMeasurementFunction[0]"
                        :options="dropdownMeasurementFunction"
                        class="w-full md:w-7rem"
                      />
                    </div>
                    <div class="flex flex-column gap-2">
                      <label>{{ $t("view.rules_measurement_label") }}</label>
                      <Button
                        :label="formatMeasurements(slotProps.node.data.ruleDefinition.measurement1.measurementId)"
                        @click="measurementSelectionDialog(slotProps.node.data.ruleDefinition.measurement1, slotProps.node.key, 'ms1-id')"
                        :class="{ 'invalid-input': hasError(slotProps.node.key, 'ms1-id') }"
                      ></Button>
                    </div>
                    <div class="flex flex-column gap-2">
                      <label>{{ $t("view.rules_from_label") }}</label>
                      <InputText
                        v-model="slotProps.node.data.ruleDefinition.measurement1.rangeFrom"
                        v-tooltip.bottom="$t('view.rules_literal_tooltip')"
                        class="md:w-6rem"
                        :class="{ 'invalid-input': hasError(slotProps.node.key, 'ms1-from') }"
                        type="text"
                        @input="(event) => validateTimeLiteral(event.target.value, slotProps.node.key, 'ms1-from')"
                      />
                    </div>
                    <div class="flex flex-column gap-2">
                      <label>{{ $t("view.rules_to_label") }}</label>
                      <InputText
                        v-model="slotProps.node.data.ruleDefinition.measurement1.rangeTo"
                        v-tooltip.bottom="$t('view.rules_literal_tooltip')"
                        class="md:w-6rem"
                        :class="{ 'invalid-input': hasError(slotProps.node.key, 'ms1-to') }"
                        type="text"
                        @input="(event) => validateTimeLiteral(event.target.value, slotProps.node.key, 'ms1-to')"
                      />
                    </div>
                  </div>
                  <div class="flex justify-content-center flex-fill flex-wrap gap-2">
                    <div class="flex flex-column gap-2">
                      <label>{{ $t("view.rules_comparator_label") }}</label>
                      <Dropdown
                        v-model="slotProps.node.data.ruleDefinition.comparator"
                        :placeholder="dropdownOperation[0]"
                        :options="dropdownOperation"
                        class="w-full md:w-5rem"
                      />
                    </div>
                    <div class="flex flex-column gap-2">
                      <label>{{ $t("view.rules_compare_to_label") }}</label>
                      <Dropdown
                        v-model="slotProps.node.data.ruleDefinition.selected"
                        :placeholder="dropdownThresholdMeasurement[0]"
                        :options="dropdownThresholdMeasurement"
                        class="w-full md:w-10rem"
                      />
                    </div>
                    <div v-if="slotProps.node.data.ruleDefinition.selected === dropdownThresholdMeasurement[0]" class="flex flex-column gap-2">
                      <label>{{ $t("view.rules_threshold_label") }}</label>
                      <InputText
                        v-model="slotProps.node.data.ruleDefinition.manualThreshold"
                        v-tooltip.bottom="$t('view.rules_number_tooltip')"
                        class="md:w-4rem"
                        :class="{ 'invalid-input': hasError(slotProps.node.key, 'manualThreshold') }"
                        type="text"
                        @input="(event) => validateOnlyNumber(event.target.value, slotProps.node.key, 'manualThreshold')"
                      />
                    </div>
                  </div>
                  <div
                    v-if="slotProps.node.data.ruleDefinition.selected === dropdownThresholdMeasurement[1]"
                    class="flex justify-content-center flex-fill flex-wrap gap-2"
                  >
                    <div class="flex flex-column gap-2">
                      <label>{{ $t("view.rules_multiplier_label") }}</label>
                      <InputText
                        v-model="slotProps.node.data.ruleDefinition.measurement2.multiplier"
                        v-tooltip.bottom="$t('view.rules_number_tooltip')"
                        class="md:w-5rem"
                        :class="{ 'invalid-input': hasError(slotProps.node.key, 'ms2-multiplier') }"
                        type="number"
                        @input="(event) => validateOnlyNumberOrEmpty(event.target.value, slotProps.node.key, 'ms2-multiplier')"
                      />
                    </div>
                    <div class="flex flex-column gap-2">
                      <label>{{ $t("view.rules_function_label") }}</label>
                      <Dropdown
                        v-model="slotProps.node.data.ruleDefinition.measurement2.function"
                        :placeholder="dropdownMeasurementFunction[0]"
                        :options="dropdownMeasurementFunction"
                        class="w-full md:w-7rem"
                      />
                    </div>
                    <div class="flex flex-column gap-2">
                      <label>{{ $t("view.rules_measurement_label") }}</label>
                      <Button
                        :label="formatMeasurements(slotProps.node.data.ruleDefinition.measurement2.measurementId)"
                        @click="measurementSelectionDialog(slotProps.node.data.ruleDefinition.measurement2, slotProps.node.key, 'ms2-id')"
                        :class="{ 'invalid-input': hasError(slotProps.node.key, 'ms2-id') }"
                      ></Button>
                    </div>
                    <div class="flex flex-column gap-2">
                      <label>{{ $t("view.rules_from_label") }}</label>
                      <InputText
                        v-model="slotProps.node.data.ruleDefinition.measurement2.rangeFrom"
                        v-tooltip.bottom="$t('view.rules_literal_tooltip')"
                        class="md:w-6rem"
                        :class="{ 'invalid-input': hasError(slotProps.node.key, 'ms2-from') }"
                        type="text"
                        @input="(event) => validateTimeLiteral(event.target.value, slotProps.node.key, 'ms2-from')"
                      />
                    </div>
                    <div class="flex flex-column gap-2">
                      <label>{{ $t("view.rules_to_label") }}</label>
                      <InputText
                        v-model="slotProps.node.data.ruleDefinition.measurement2.rangeTo"
                        v-tooltip.bottom="$t('view.rules_literal_tooltip')"
                        class="md:w-6rem"
                        :class="{ 'invalid-input': hasError(slotProps.node.key, 'ms2-to') }"
                        type="text"
                        @input="(event) => validateTimeLiteral(event.target.value, slotProps.node.key, 'ms2-to')"
                      />
                    </div>
                  </div>
                </div>
                <div v-if="slotProps.node.data.selected === 'action'" class="flex justify-content-center flex-fill gap-2">
                  <div class="flex flex-column gap-2">
                    <label>{{ $t("view.rules_asset_label") }}</label>
                    <Button
                      :label="formattedAssetValue(slotProps.node.data.ruleAction)"
                      @click="selectAsset(slotProps.node)"
                      :class="{ 'invalid-input': hasError(slotProps.node.key, 'actionAsset') }"
                    ></Button>
                  </div>
                  <div class="flex flex-column gap-2">
                    <label>{{ $t("view.rules_duration_label") }}</label>
                    <InputText
                      v-model="slotProps.node.data.ruleAction.fixedDuration"
                      v-tooltip.bottom="$t('view.rules_duration_tooltip')"
                      class="inputTextCondition md:w-5rem"
                      type="text"
                      placeholder="Message"
                      :class="{ 'invalid-input': hasError(slotProps.node.key, 'fixedDuration') }"
                      @input="(event) => validateSimpleTimeLiteral(event.target.value, slotProps.node.key, 'fixedDuration')"
                    />
                  </div>
                  <div class="flex flex-column gap-2">
                    <label>{{ $t("view.rules_action_label") }}</label>
                    <Dropdown
                      v-model="slotProps.node.data.ruleAction.demandDefinition.action"
                      optionValue="value"
                      optionLabel="label"
                      placeholder="Action"
                      :options="demandActionsList"
                      class="w-full md:w-16rem"
                    />
                  </div>
                  <div class="flex flex-column gap-2">
                    <label>{{ $t("view.rules_action_type_label") }}</label>
                    <Dropdown
                      v-model="slotProps.node.data.ruleAction.demandDefinition.action_type"
                      optionValue="value"
                      optionLabel="label"
                      placeholder="Action type"
                      :options="demandActionTypesList"
                      class="w-full md:w-8rem"
                    />
                  </div>
                  <div class="flex flex-column gap-2">
                    <label>{{ $t("view.rules_message_label") }}</label>
                    <InputText
                      v-model="slotProps.node.data.ruleAction.demandDefinition.message"
                      class="inputTextCondition md:w-20rem"
                      type="text"
                      placeholder="Message"
                    />
                  </div>
                </div>
              </div>
            </template>
          </Column>
          <Column field="label" headerStyle="width: 5rem" header="Delete">
            <template #body="slotProps">
              <Button
                v-if="!slotProps.node.selectable"
                type="button"
                icon="pi pi-trash"
                class="p-button-rounded p-button-danger"
                @click="deleteRule(slotProps.node)"
              />
            </template>
          </Column>
        </TreeTable>
        <MeasurementSelectionList ref="measurementSelectionList" @selected-measurement="handleMeasurementSelection"></MeasurementSelectionList>
        <AssetSelectDialog ref="assetSelectDialog" @submit="onAssetUpdate"></AssetSelectDialog>
        <div class="gap-3 field grid button-grid">
          <Button @click="addRule">{{ $t("view.rules_add_label") }}</Button>
          <Button @click="save">{{ $t("view.rules_save_label") }}</Button>
        </div>
      </div>
    </template>
  </Card>
</template>

<script>
import { DemandAction } from "@/plugins/model/Enums.js";
import { DemandActionType } from "@/plugins/model/Enums.js";
import AssetSelectDialog from "@/components/management/infrastructure/AssetSelectDialog.vue";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import Column from "primevue/column";
import MeasurementSelectionList from "@/components/management/infrastructure/MeasurementSelectionList.vue";
import TreeTable from "primevue/treetable";
export default {
  name: "RulesListView",
  components: {
    AssetSelectDialog,
    Button,
    Checkbox,
    Column,
    MeasurementSelectionList,
    TreeTable,
  },
  data() {
    return {
      localRules: [],
      newIncrement: 0,
      deletedRootIds: [],
      nodeTypes: [
        {
          label: "Inactive",
          value: null,
        },
        {
          label: "Rule",
          value: "rule",
        },
        {
          label: "Action",
          value: "action",
        },
      ],
      errors: {},
      demandActionsList: [],
      demandActionTypesList: [],
      dropdownMeasurementList: [],
      dropdownMeasurementFunction: ["count", "distinct", "mean", "median", "sum", "max", "min", "first", "last"],
      dropdownOperation: [">", ">=", "<", "<="],
      dropdownThresholdMeasurement: ["Threshold", "Measurement"],
      ongoingMeasurementEdit: null,
      ongoingAssetEdit: null,
      expandedKeys: {},
    };
  },
  async created() {
    this.demandActionsList = [];
    for (const [, value] of Object.entries(DemandAction)) {
      this.demandActionsList.push({ label: this.$t(`enums.demand_action.${value}`), value: value.toUpperCase() });
    }
    this.demandActionTypesList = [];
    for (const [, value] of Object.entries(DemandActionType)) {
      this.demandActionTypesList.push({ label: this.$t(`enums.demand_action_type.${value}`), value: value.toUpperCase() });
    }

    let rules = await this.$ren.managementApi.getAllRules();
    this.dropdownMeasurementList = await this.$ren.managementApi.getAllMeasurementsPaginationWorkaround();
    this.setInitialState(rules);
  },
  methods: {
    setInitialState(rules) {
      this.localRules = [];
      this.localRules = this.convertToLocalData(rules);
      this.errors = {};
      this.newIncrement = 0;
      this.deletedRootIds = [];
      this.ongoingMeasurementEdit = null;
      this.ongoingAssetEdit = null;
      this.expandedKeys = {};
    },
    onRuleTypeChange(event, rule) {
      //let rule = this.findRuleByKey(key);
      switch (event.value) {
        case "rule":
          if (rule.data.ruleDefinition !== null) {
            return;
          }
          rule.data.ruleAction = null;
          rule.data.ruleDefinition = this.createEmptyRuleDefinition();
          rule.children.push(this.createOrConvertRule(null, this.$t("view.rules_true_label"), rule.key, rule.children.length));
          rule.children.push(this.createOrConvertRule(null, this.$t("view.rules_false_label"), rule.key, rule.children.length));
          break;
        case "action":
          if (rule.data.ruleAction !== null) {
            return;
          }
          rule.data.ruleAction = this.createEmptyRuleAction();
          rule.data.ruleDefinition = null;
          rule.children.splice(0, rule.children.length);
          break;
        default:
          rule.data.ruleAction = null;
          rule.data.ruleDefinition = null;
          rule.children.splice(0, rule.children.length);
          break;
      }
    },
    addRule() {
      this.localRules.push(this.createOrConvertRule(null, this.$t("view.rules_root_rule_label"), null, this.localRules.length));
    },
    deleteRule(rule) {
      let index = this.localRules.findIndex((elem) => elem.key === rule.key);
      this.localRules.splice(index, 1);
      if (rule.id !== null) {
        this.deletedRootIds.push(rule.id);
      }
    },
    async save() {
      this.validateAll();
      if (this.containsErrorAndDisplay()) {
        this.$emitter.emit("error", { message: this.$t("view.rules_contains_error") });
        console.log("has errors", this.expandedKeys);
        return;
      }

      this.$emitter.emit("information", { message: this.$t("view.rules_saving") });
      this.$ren.managementApi
        .updateCreateDeleteRules(this.getAsJson(), this.deletedRootIds)
        .then((rules) => {
          this.setInitialState(rules);
          this.$emitter.emit("success", { title: this.$t("view.rules_saved") });
        })
        .catch(() => {
          this.$emitter.emit("error", { message: this.$t("view.rules_not_saved") });
        });
    },
    containsErrorAndDisplay() {
      this.expandedKeys = {};
      var found = false;
      for (const [key, error] of Object.entries(this.errors)) {
        for (const [, value] of Object.entries(error)) {
          if (value) {
            found = true;
            let indexes = key.split("-");
            var aggr = indexes[0];
            this.expandedKeys[aggr] = true;
            //No need to open the element having the error.
            for (let i = 1; i < indexes.length - 1; i++) {
              aggr += "-" + indexes[i];
              this.expandedKeys[aggr] = true;
            }
            break;
          }
        }
      }
      return found;
    },
    validateAll() {
      this.errors = {};
      for (const rule of this.localRules) {
        this.validateRule(rule);
      }
    },
    validateRule(rule) {
      if (rule.selected === this.dropdownThresholdMeasurement[0]) {
        this.errors[rule.key] = {};
        return;
      }

      if (rule.data.selected === "rule") {
        this.validateOnlyNumberOrEmpty(rule.data.ruleDefinition.measurement1.multiplier, rule.key, "ms1-multiplier");
        this.validateMeasurement(rule.data.ruleDefinition.measurement1.measurementId, rule.key, "ms1-id");
        this.validateTimeLiteral(rule.data.ruleDefinition.measurement1.rangeFrom, rule.key, "ms1-from");
        this.validateTimeLiteral(rule.data.ruleDefinition.measurement1.rangeTo, rule.key, "ms1-to");
        if (rule.data.ruleDefinition.selected === this.dropdownThresholdMeasurement[0]) {
          this.validateOnlyNumber(rule.data.ruleDefinition.manualThreshold, rule.key, "manualThreshold");
        } else {
          this.validateOnlyNumberOrEmpty(rule.data.ruleDefinition.measurement2.multiplier, rule.key, "ms2-multiplier");
          this.validateMeasurement(rule.data.ruleDefinition.measurement2.measurementId, rule.key, "ms2-id");
          this.validateTimeLiteral(rule.data.ruleDefinition.measurement2.rangeFrom, rule.key, "ms2-from");
          this.validateTimeLiteral(rule.data.ruleDefinition.measurement2.rangeTo, rule.key, "ms2-to");
        }
      }
      if (rule.data.selected === "action") {
        this.validateAsset(rule.data.ruleAction.asset, rule.key, "actionAsset");
        this.validateSimpleTimeLiteral(rule.data.ruleAction.fixedDuration, rule.key, "fixedDuration");
      }
      if (rule.children.length > 0) this.validateRule(rule.children[0]);
      if (rule.children.length > 1) this.validateRule(rule.children[1]);
    },
    hasError(key, field) {
      if (field === null || field === undefined) {
        if (this.errors[key] === null || this.errors[key] === undefined) return false;
        for (const [, value] of Object.entries(this.errors[key])) {
          if (value) {
            return true;
          }
        }
        return false;
      }
      return this.errors[key] && this.errors[key][field];
    },
    clearError(key, field) {
      if (!this.errors[key]) {
        this.errors[key] = {};
      }
      this.errors[key][field] = false;
    },
    setError(key, field) {
      if (!this.errors[key]) {
        this.errors[key] = {};
      }
      this.errors[key][field] = true;
    },
    validateOnlyNumberOrEmpty(value, key, field) {
      this.clearError(key, field);
      if (value !== null && value !== undefined && isNaN(value * 1)) {
        this.setError(key, field);
      }
    },
    validateOnlyNumber(value, key, field) {
      this.clearError(key, field);
      if (value === null || value === undefined || isNaN(value * 1)) {
        this.setError(key, field);
      }
    },
    validateMeasurement(value, key, field) {
      this.clearError(key, field);
      if (value === null || value === undefined) {
        this.setError(key, field);
      }
    },
    validateAsset(value, key, field) {
      this.clearError(key, field);
      if (value === null || value === undefined) {
        this.setError(key, field);
      }
    },
    validateTimeLiteral(value, key, field) {
      this.clearError(key, field);
      if (
        value === null ||
        (!this.isAllowedText(value) &&
          (!this.startsOk(value) || !this.endsOk(value) || value.length < 6 || this.notANumber(value.substring(4, value.length - 1))))
      ) {
        this.setError(key, field);
      }
    },
    validateSimpleTimeLiteral(value, key, field) {
      this.clearError(key, field);
      if (value === null || !this.endsOk(value) || value.length < 2 || this.notANumber(value.substring(0, value.length - 1))) {
        this.setError(key, field);
      }
    },
    isAllowedText(value) {
      return value === "now" || value === "day-start" || value === "day-end";
    },
    startsOk(value) {
      return value.startsWith("now+") || value.startsWith("now-");
    },
    endsOk(value) {
      return value.endsWith("s") || value.endsWith("m") || value.endsWith("h") || value.endsWith("d");
    },
    notANumber(value) {
      return isNaN(value * 1);
    },
    findRuleByKey(key) {
      let indexes = key.split("-");
      var current = this.localRules[indexes[0]];
      for (let i = 1; i < indexes.length; i++) {
        current = current.children[indexes[i]];
      }
      return current;
    },
    async selectAsset(rule) {
      this.ongoingAssetEdit = rule;
      if (rule.data.ruleAction.asset !== null) {
        this.$refs.assetSelectDialog.open(rule.data.ruleAction.asset);
      } else {
        this.$refs.assetSelectDialog.open();
      }
    },
    async onAssetUpdate(asset) {
      this.ongoingAssetEdit.data.ruleAction.asset = asset;
      this.validateAsset(asset, this.ongoingAssetEdit.key, "actionAsset");
      //this.validateDemandAssetFalse();
    },
    formattedAssetValue(ruleAction) {
      if (ruleAction === null || ruleAction.asset === null) {
        return "Asset Select";
      }
      return ruleAction.asset.label;
    },
    measurementSelectionDialog(measurement, key, field) {
      this.ongoingMeasurementEdit = {
        measurement: measurement,
        key: key,
        field: field,
      };
      this.$refs.measurementSelectionList.open();
    },
    handleMeasurementSelection(selectedMeasurementId) {
      this.ongoingMeasurementEdit.measurement.measurementId = selectedMeasurementId;
      this.validateMeasurement(selectedMeasurementId, this.ongoingMeasurementEdit.key, this.ongoingMeasurementEdit.field);
    },
    formatMeasurements(measurementId) {
      let formattedMeasurement = this.dropdownMeasurementList.find((m) => m.id === measurementId);
      if (formattedMeasurement) {
        formattedMeasurement = formattedMeasurement.name + " : " + (formattedMeasurement.label || "No label");
      } else {
        formattedMeasurement = "Measurements";
      }
      return formattedMeasurement;
    },
    getAsJson() {
      var rules = [];
      console.log("a", this.localRules);
      for (const local of this.localRules) {
        rules.push(this.convertToJson(local));
      }
      return rules;
    },
    convertToJson(local) {
      if (local.data.selected === null) return null;

      var json = {
        id: local.id,
        ruleDefinition: null,
        ruleAction: null,
        positiveRule: null,
        negativeRule: null,
        active: local.active,
      };
      if (local.data.selected === "rule") {
        json.ruleDefinition = {
          id: local.data.ruleDefinition.id,
          measurement1: {
            id: local.data.ruleDefinition.measurement1.id,
            function: local.data.ruleDefinition.measurement1.function,
            multiplier: local.data.ruleDefinition.measurement1.multiplier,
            measurementId: local.data.ruleDefinition.measurement1.measurementId,
            rangeFrom: local.data.ruleDefinition.measurement1.rangeFrom,
            rangeTo: local.data.ruleDefinition.measurement1.rangeTo,
          },
          measurement2:
            local.data.ruleDefinition.selection !== this.dropdownThresholdMeasurement[1]
              ? null
              : {
                  id: local.data.ruleDefinition.measurement2.id,
                  function: local.data.ruleDefinition.measurement2.function,
                  multiplier: local.data.ruleDefinition.measurement2.multiplier,
                  measurementId: local.data.ruleDefinition.measurement2.measurementId,
                  rangeFrom: local.data.ruleDefinition.measurement2.rangeFrom,
                  rangeTo: local.data.ruleDefinition.measurement2.rangeTo,
                },
          manualThreshold: local.data.ruleDefinition.manualThreshold,
          comparator: local.data.ruleDefinition.comparator,
        };
        if (local.children.length > 0) json.positiveRule = this.convertToJson(local.children[0]);
        if (local.children.length > 1) json.negativeRule = this.convertToJson(local.children[1]);
      } else if (local.data.selected === "action") {
        json.ruleAction = {
          id: local.data.ruleAction.id,
          asset: local.data.ruleAction.asset,
          demandDefinition: {
            id: null,
            action: local.data.ruleAction.demandDefinition.action,
            message: local.data.ruleAction.demandDefinition.message,
            ext: null,
            action_type: local.data.ruleAction.demandDefinition.action_type,
          },
          fixedDuration: local.data.ruleAction.fixedDuration,
        };
      }
      return json;
    },
    convertToLocalData(rules) {
      var localFormat = [];
      for (let i = 0; i < rules.length; i++) {
        localFormat.push(this.createOrConvertRule(rules[i], this.$t("view.rules_root_rule_label"), null, localFormat.length));
      }
      return localFormat;
    },
    createOrConvertRule(rule, type, parent, siblings) {
      var convert = {
        id: rule === null ? null : rule.id,
        active: rule === null ? true : rule.active,
        selectable: type !== this.$t("view.rules_root_rule_label"),
        //key: rule === null ? "new-" + this.newIncrement : "exist-" + rule.id,
        key: parent == null ? siblings + "" : parent + "-" + siblings,
        type: type,
        data: {
          label: type,
          ruleAction: null,
          ruleDefinition: null,
        },
        children: [],
      };

      if (rule === null) {
        this.newIncrement += 1;
        if (convert.selectable) {
          convert.data.selected = null;
        } else {
          convert.data.selected = "rule";
          convert.data.ruleAction = null;
          convert.data.ruleDefinition = this.createEmptyRuleDefinition();
          convert.children.push(this.createOrConvertRule(null, this.$t("view.rules_true_label"), convert.key, convert.children.length));
          convert.children.push(this.createOrConvertRule(null, this.$t("view.rules_false_label"), convert.key, convert.children.length));
        }
      } else if (rule.ruleAction !== null) {
        convert.data.selected = "action";
        convert.data.ruleAction = rule.ruleAction;
      } else if (rule.ruleDefinition !== null) {
        convert.data.selected = "rule";
        convert.data.ruleDefinition = rule.ruleDefinition;
        convert.data.ruleDefinition.selected =
          convert.data.ruleDefinition.measurement2 === null ? this.dropdownThresholdMeasurement[0] : this.dropdownThresholdMeasurement[1];
        if (convert.data.ruleDefinition.measurement1 == null) {
          convert.data.ruleDefinition.measurement1 = this.createEmptyMeasurement();
        }
        if (convert.data.ruleDefinition.measurement2 == null) {
          convert.data.ruleDefinition.measurement2 = this.createEmptyMeasurement();
        }
        convert.children.push(this.createOrConvertRule(rule.positiveRule, this.$t("view.rules_true_label"), convert.key, convert.children.length));
        convert.children.push(this.createOrConvertRule(rule.negativeRule, this.$t("view.rules_false_label"), convert.key, convert.children.length));
      }
      return convert;
    },
    createEmptyRuleDefinition() {
      return {
        comparator: this.dropdownOperation[0],
        id: null,
        manualThreshold: null,
        selected: this.dropdownThresholdMeasurement[0],
        measurement1: this.createEmptyMeasurement(),
        measurement2: this.createEmptyMeasurement(),
      };
    },
    createEmptyMeasurement() {
      return {
        function: this.dropdownMeasurementFunction[0],
        id: null,
        measurementId: null,
        multiplier: null,
        rangeFrom: null,
        rangeTo: null,
      };
    },
    createEmptyRuleAction() {
      return {
        id: null,
        asset: null,
        fixedDuration: null,
        demandDefinition: {
          action: this.demandActionsList[0].value,
          action_type: this.demandActionTypesList[0].value,
          id: null,
          message: null,
          ext: null,
        },
      };
    },
  },
};
</script>
<style scoped lang="scss">
.button-grid {
  margin-top: 5px;
  margin-left: 5px;
}
.invisible-button {
  background-color: transparent;
  border: none;
  box-shadow: none;
  color: #000;
  padding: 0;
  font-size: 1rem;
  font-weight: bold;
}
.invisible-button:hover {
  text-decoration: underline;
}
.invalid-input {
  border-color: red; /* Set any style you want for invalid input */
}
.fixed-error {
  width: 2px;
  height: auto;
}
.has-error {
  background-color: red;
}
</style>
