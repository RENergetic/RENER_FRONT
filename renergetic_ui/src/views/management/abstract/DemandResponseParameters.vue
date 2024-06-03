<template>
  <Card style="width: 99%; margin: auto; margin-bottom: 1%">
    <template #content>
      <div class="gap-3 field grid container">
        <!-- obtained from the backend -->
        <Checkbox v-if="showCheckbox" v-model="rowActiveCheckBox" :binary="true" />
        <label v-if="showLabel"> {{ $t("view.enable_rule") }} </label>
        <!-- <Dropdown v-model="measurementList" :options="formattedOptions" :placeholder="'Measurements'" optionLabel="label" optionValue="value" /> -->
        <Button :label="formattedMeasurementValue" @click="measurementSelectionDialog(0)" :class="{ 'invalid-input': errors.measurement1 }"></Button>
        <Dropdown
          v-model="measurement1Function"
          :placeholder="dropdownMeasurementFunction[0]"
          :options="dropdownMeasurementFunction"
          class="w-full md:w-8rem"
        />
        <InputText v-model="timeRange" class="md:w-4rem" :class="{ 'invalid-input': errors.timeRange }" type="text" @input="validateTimeRange()" />
        <Dropdown v-model="durationSyntax" :placeholder="dropdownDurationSyntax[0]" :options="dropdownDurationSyntax" class="w-full md:w-6rem" />
        <Dropdown v-model="operationData" :placeholder="dropdownOperation[0]" :options="dropdownOperation" class="w-full md:w-5rem" />
        <Dropdown
          v-model="thresholdMeasurement"
          :placeholder="dropdownThresholdMeasurement[0]"
          :options="dropdownThresholdMeasurement"
          class="w-full md:w-11rem"
        />
        <div v-if="thresholdMeasurement == 'Threshold'" class="gap-3 container">
          <Checkbox v-model="checkBoxBool" :binary="true" />
          <label> {{ $t("view.from_config") }} </label>
          <InputText
            v-model="valueMeasurement"
            class="inputTextCondition"
            :class="{ 'invalid-input': errors.valueMeasurement }"
            type="text"
            :placeholder="'0'"
            @input="validateValueMeasurement()"
          />
        </div>
        <div v-else-if="thresholdMeasurement == 'Measurement'" class="gap-3 container">
          <Button
            :label="formattedMeasurementValue2"
            @click="measurementSelectionDialog(1)"
            :class="{ 'invalid-input': errors.measurement2 }"
          ></Button>
          <Dropdown
            v-model="measurement2Function"
            :placeholder="dropdownMeasurementFunction[0]"
            :options="dropdownMeasurementFunction"
            class="w-full md:w-8rem"
          />
          <InputText
            v-model="timeRange2"
            class="inputTextCondition md:w-4rem"
            :class="{ 'invalid-input': errors.timeRange2 }"
            type="text"
            @input="validateTimeRange2()"
          />
          <Dropdown v-model="durationSyntax2" :placeholder="dropdownDurationSyntax[0]" :options="dropdownDurationSyntax" class="w-full md:w-6rem" />
        </div>
        <div v-else>ERROR</div>
        <div v-if="detailsError">
          <label>{{ $t("view.asset_details_dont_exist") }}</label>
        </div>
        <Button v-if="showButton" icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="deleteDemandResponseUI()" />
        <MeasurementSelectionList ref="measurementSelectionList" @selected-measurement="handleMeasurementSelection"></MeasurementSelectionList>
      </div>
      <div class="gap-3 field grid container">
        <Checkbox v-model="sendDemandTrue" :binary="true" />
        <label>Demand (true)</label>
        <div class="gap-3 grid" v-if="sendDemandTrue">
          <Button
            :label="formattedAssetValue(demandAssetTrue)"
            @click="selectAssetTrue()"
            :class="{ 'invalid-input': errors.demandAssetTrue }"
          ></Button>
          <AssetSelectDialog ref="assetSelectDialogDemandTrue" @submit="onAssetDemandTrueUpdate"></AssetSelectDialog>
          <Dropdown
            v-model="demandDefinitionTrueAction"
            optionValue="value"
            optionLabel="label"
            placeholder="Action"
            :options="demandActionsList"
            class="w-full md:w-8rem"
          />
          <Dropdown
            v-model="demandDefinitionTrueActionType"
            optionValue="value"
            optionLabel="label"
            placeholder="Action type"
            :options="demandActionTypesList"
            class="w-full md:w-8rem"
          />
          <InputText v-model="demandDefinitionTrueActionMessage" class="inputTextCondition md:w-15rem" type="text" placeholder="Message" />
        </div>
      </div>
      <div class="gap-3 field grid container">
        <Checkbox v-model="sendDemandFalse" :binary="true" />
        <label>Demand (false)</label>
        <div class="gap-3 grid" v-if="sendDemandFalse">
          <Button
            :label="formattedAssetValue(demandAssetFalse)"
            @click="selectAssetFalse()"
            :class="{ 'invalid-input': errors.demandAssetFalse }"
          ></Button>
          <AssetSelectDialog ref="assetSelectDialogDemandFalse" @submit="onAssetDemandFalseUpdate"></AssetSelectDialog>
          <Dropdown
            v-model="demandDefinitionFalseAction"
            optionValue="value"
            optionLabel="label"
            placeholder="Action"
            :options="demandActionsList"
            class="w-full md:w-8rem"
          />
          <Dropdown
            v-model="demandDefinitionFalseActionType"
            optionValue="value"
            optionLabel="label"
            placeholder="Action type"
            :options="demandActionTypesList"
            class="w-full md:w-8rem"
          />
          <InputText v-model="demandDefinitionFalseActionMessage" class="inputTextCondition md:w-15rem" type="text" placeholder="Message" />
        </div>
      </div>
    </template>
  </Card>
</template>
<script>
import Checkbox from "primevue/checkbox";
import MeasurementSelectionList from "@/components/management/infrastructure/MeasurementSelectionList.vue";
import AssetSelectDialog from "@/components/management/infrastructure/AssetSelectDialog.vue";
import { DemandActionType } from "@/plugins/model/Enums.js";
import { DemandAction } from "@/plugins/model/Enums.js";
export default {
  name: "DemandResponseParameters",
  components: {
    AssetSelectDialog,
    Checkbox,
    MeasurementSelectionList,
  },
  emits: ["delete"],
  data() {
    return {
      measurementList: null,
      measurementList2: null,
      timeRange: null,
      timeRange2: null,
      thresholdMeasurement: null,
      operationData: null,
      durationSyntax: null,
      durationSyntax2: null,
      measurement1Function: null,
      measurement2Function: null,
      dropdownMeasurementList: ["Measurement1", "Measurement2"],
      dropdownMeasurementList2: ["Measurement1", "Measurement2"],
      dropdownThresholdMeasurement: ["Threshold", "Measurement"],
      dropdownOperation: [">", ">=", "<", "<="],
      showCheckbox: true,
      showButton: true,
      showLabel: true,
      checkBoxBool: true,
      valueMeasurement: null,
      rowActiveCheckBox: null,
      measurement1function: null,
      dropdownMeasurementFunction: ["count", "distinct", "mean", "median", "sum", "max", "min", "first", "last"],
      dropdownDurationSyntax: ["ns", "us", "ms", "s", "m", "h", "d", "w", "mo", "y"],
      validInput0: true,
      validInput1: true,
      validInput2: true,
      borderColor0: "",
      borderColor1: "",
      borderColor2: "",
      detailsError: false,
      measurementModified: null,
      sendDemandTrue: false,
      demandDefinitionTrueAction: "",
      demandDefinitionTrueActionType: "",
      demandDefinitionTrueActionMessage: "",
      demandAssetTrue: null,
      sendDemandFalse: false,
      demandDefinitionFalseAction: "",
      demandDefinitionFalseActionType: "",
      demandDefinitionFalseActionMessage: "",
      demandAssetFalse: null,
      demandActionsList: [],
      demandActionTypesList: [],
      errors: {
        measurement1: false,
        timeRange: false,
        measurement2: false,
        timeRange2: false,
        demandAssetTrue: false,
        demandAssetFalse: false,
        valueMeasurement: false,
      },
    };
  },
  computed: {
    /*
    formattedOptions() {
      let formattedMeasurement = this.dropdownMeasurementList.map((drop) => ({
        value: drop.id,
        label: drop.name + " : " + (drop.label || "No label"), // Example: Convert label to uppercase
      }));
      return formattedMeasurement;
    },
    */
    formattedMeasurementValue() {
      let formattedMeasurement = this.formatMeasurements(0);
      return formattedMeasurement;
    },
    formattedMeasurementValue2() {
      let formattedMeasurement = this.formatMeasurements(1);
      return formattedMeasurement;
    },
  },
  created() {
    this.demandActionTypesList = [];
    for (const [, value] of Object.entries(DemandActionType)) {
      this.demandActionTypesList.push({ label: this.$t(`enums.demand_action_type.${value}`), value: value.toUpperCase() });
    }
    this.demandActionsList = [];
    for (const [, value] of Object.entries(DemandAction)) {
      this.demandActionsList.push({ label: this.$t(`enums.demand_action.${value}`), value: value.toUpperCase() });
    }

    this.rowActiveCheckBox = false;
    this.showCheckbox = true;
    this.showButton = true;
    this.showLabel = true;
    this.measurementList = this.dropdownMeasurementList[0];
    this.measurement1Function = this.dropdownMeasurementFunction[0];
    this.operationData = this.dropdownOperation[0];
    this.thresholdMeasurement = this.dropdownThresholdMeasurement[0];
    this.measurementList2 = this.dropdownMeasurementFunction[0];
    this.measurement2Function = this.dropdownMeasurementFunction[0];
    this.durationSyntax = this.dropdownDurationSyntax[0];
    this.durationSyntax2 = this.dropdownDurationSyntax[0];

    this.sendDemandTrue = false;
    this.demandDefinitionTrueAction = this.demandActionsList[0].value;
    this.demandDefinitionTrueActionType = this.demandActionTypesList[0].value;
    this.demandDefinitionTrueActionMessage = "";
    this.demandAssetTrue = null;
    this.sendDemandFalse = false;
    this.demandDefinitionFalseAction = this.demandActionsList[0].value;
    this.demandDefinitionFalseActionType = this.demandActionTypesList[0].value;
    this.demandAssetFalse = null;

    this.measurementsGetter();
  },
  methods: {
    formatMeasurements(measureNumber) {
      /*let formatMeasurement = name + " : " + (label || "No label");
      return formatMeasurement;*/
      let formattedMeasurement;
      if (measureNumber == 0) {
        formattedMeasurement = this.dropdownMeasurementList.find((m) => m.id === this.measurementList);
      } else {
        formattedMeasurement = this.dropdownMeasurementList2.find((m) => m.id === this.measurementList2);
      }
      if (formattedMeasurement) {
        console.log(formattedMeasurement.name, formattedMeasurement.label);
        formattedMeasurement = formattedMeasurement.name + " : " + (formattedMeasurement.label || "No label");
      } else {
        formattedMeasurement = "Measurements";
      }
      console.log(formattedMeasurement);
      return formattedMeasurement;
    },
    //Process to obtain the asset rules from the DDBB
    async addPrecreatedAssetRule(assetRule) {
      this.rowActiveCheckBox = assetRule.active;
      this.measurementList = assetRule.measurement1Id;
      this.measurement1Function = assetRule.functionMeasurement1;
      [, this.timeRange, this.durationSyntax] = assetRule.timeRangeMeasurement1.match(/(\d+(?:\.\d+)?)([a-zA-Z]+)/);
      this.operationData = assetRule.comparator;
      if (assetRule.timeRangeMeasurement2 == null) {
        //threshold
        this.thresholdMeasurement = this.dropdownThresholdMeasurement[0];
        this.checkBoxBool = assetRule.compareToConfigThreshold;
        this.valueMeasurement = assetRule.manualThreshold;
        this.measurementList2 = this.dropdownMeasurementFunction[0];
        this.measurement2Function = this.dropdownMeasurementFunction[0];
        this.timeRange2 = null;
        this.durationSyntax2 = this.dropdownDurationSyntax[0];
      } else if (assetRule.timeRangeMeasurement2 != null) {
        //measurement
        this.thresholdMeasurement = this.dropdownThresholdMeasurement[1];
        this.checkBoxBool = null;
        this.valueMeasurement = null;
        this.measurementList2 = assetRule.measurement2Id;
        this.measurement2Function = assetRule.functionMeasurement2;
        [, this.timeRange2, this.durationSyntax2] = assetRule.timeRangeMeasurement2.match(/(\d+(?:\.\d+)?)([a-zA-Z]+)/);
      } else {
        console.error("MESSAGE ERROR");
      }

      this.sendDemandTrue = assetRule.sendDemandTrue;
      this.demandAssetTrue = assetRule.demandAssetTrue !== null ? await this.$ren.managementApi.getAsset(assetRule.demandAssetTrue) : null;
      if (assetRule.demandDefinitionTrue !== null) {
        this.demandDefinitionTrueAction = assetRule.demandDefinitionTrue.action;
        this.demandDefinitionTrueActionType = assetRule.demandDefinitionTrue.action_type;
        this.demandDefinitionTrueActionMessage = assetRule.demandDefinitionTrue.message;
      }

      this.sendDemandFalse = assetRule.sendDemandFalse;
      this.demandAssetFalse = assetRule.demandAssetFalse !== null ? await this.$ren.managementApi.getAsset(assetRule.demandAssetFalse) : null;
      if (assetRule.demandDefinitionFalse !== null) {
        this.demandDefinitionFalseAction = assetRule.demandDefinitionFalse.action;
        this.demandDefinitionFalseActionType = assetRule.demandDefinitionFalse.action_type;
        this.demandDefinitionFalseActionMessage = assetRule.demandDefinitionFalse.message;
      }
    },
    async selectAssetTrue() {
      if (this.demandAssetTrue !== null) {
        this.$refs.assetSelectDialogDemandTrue.open(this.demandAssetTrue);
      } else {
        this.$refs.assetSelectDialogDemandTrue.open();
      }
    },
    async onAssetDemandTrueUpdate(asset) {
      this.demandAssetTrue = asset;
      this.validateDemandAssetTrue();
    },
    async selectAssetFalse() {
      if (this.demandAssetFalse !== null) {
        this.$refs.assetSelectDialogDemandFalse.open(this.demandAssetFalse);
      } else {
        this.$refs.assetSelectDialogDemandFalse.open();
      }
    },
    async onAssetDemandFalseUpdate(asset) {
      this.demandAssetFalse = asset;
      this.validateDemandAssetFalse();
    },
    formattedAssetValue(asset) {
      if (asset === null) {
        return "Asset Select";
      }
      return asset.label;
    },
    async measurementsGetter() {
      this.dropdownMeasurementList = await this.$ren.managementApi.getAllMeasurementsPaginationWorkaround();
      this.dropdownMeasurementList2 = this.dropdownMeasurementList;
    },
    async deleteDemandResponseUI() {
      this.$emit("delete");
    },
    validateAll() {
      this.validateMeasurement1();
      this.validateTimeRange();
      this.validateMeasurement2();
      this.validateTimeRange2();
      this.validateDemandAssetTrue();
      this.validateDemandAssetFalse();
      this.validateValueMeasurement();

      return (
        this.errors.measurement1 ||
        this.errors.timeRange ||
        this.errors.measurement2 ||
        this.errors.timeRange2 ||
        this.errors.demandAssetTrue ||
        this.errors.demandAssetFalse ||
        this.errors.valueMeasurement
      );
    },
    validateMeasurement1() {
      console.log(this.measurementList);
      this.errors.measurementList = this.measurementList === null || this.measurementList === undefined;
    },
    validateTimeRange() {
      const expressionRegex = /^[0-9]+$/;
      this.errors.timeRange = this.timeRange === null || this.timeRange.length === 0 || !expressionRegex.test(this.timeRange);
    },
    validateMeasurement2() {
      this.errors.measurementList2 =
        this.thresholdMeasurement !== "Threshold" && (this.measurementList2 === null || this.measurementList2 === undefined);
    },
    validateTimeRange2() {
      const expressionRegex = /^[0-9]+$/;
      this.errors.timeRange2 =
        this.thresholdMeasurement !== "Threshold" &&
        (this.timeRange2 === null || this.timeRange2.length === 0 || !expressionRegex.test(this.timeRange2));
    },
    validateDemandAssetTrue() {
      console.log("=====1");
      console.log(this.sendDemandTrue);
      console.log(this.demandAssetTrue);
      this.errors.demandAssetTrue = this.sendDemandTrue && (this.demandAssetTrue === null || this.demandAssetTrue === undefined);
    },
    validateDemandAssetFalse() {
      console.log("=====2");
      console.log(this.sendDemandFalse);
      console.log(this.demandAssetFalse);
      this.errors.demandAssetFalse = this.sendDemandFalse && (this.demandAssetFalse === null || this.demandAssetFalse === undefined);
    },
    validateValueMeasurement() {
      const decimalExpressionValidation = /^[+-]?\d+(\.\d+)?$/;
      this.errors.valueMeasurement = this.thresholdMeasurement === "Threshold" && !decimalExpressionValidation.test(this.valueMeasurement);
    },
    validateInput(index) {
      const expressionRegex = /^[0-9]+$/;
      const decimalExpressionValidation = /^[+-]?\d+(\.\d+)?$/;
      if (index == 0) {
        this.validInput0 = expressionRegex.test(this.timeRange);
        if (!this.validInput0) {
          this.borderColor0 = "p-invalid";
        } else {
          this.borderColor0 = "";
        }
        console.log(this.borderColor0);
      } else if (index == 1) {
        this.validInput1 = expressionRegex.test(this.timeRange2);
        if (!this.validInput1) {
          this.borderColor1 = "p-invalid";
        } else {
          this.borderColor1 = "";
        }
        console.log(this.borderColor1);
      } else if (index == 2) {
        this.validInput2 = decimalExpressionValidation.test(this.valueMeasurement);
        if (!this.validInput2) {
          this.borderColor2 = "p-invalid";
        } else {
          this.borderColor2 = "";
        }
      }
    },
    async returnInfo() {
      if (this.thresholdMeasurement == "Threshold") {
        return {
          rowActiveCheckBox: this.rowActiveCheckBox,
          measurementList: this.measurementList,
          measurement1Function: this.measurement1Function,
          timeRange: this.timeRange,
          durationSyntax: this.durationSyntax,
          operationData: this.operationData,
          thresholdMeasurement: this.thresholdMeasurement,
          checkBoxBool: this.checkBoxBool,
          valueMeasurement: this.valueMeasurement,
          sendDemandTrue: this.sendDemandTrue,
          demandAssetTrue: this.demandAssetTrue === null ? null : this.demandAssetTrue.id,
          demandDefinitionTrue: !this.sendDemandTrue
            ? null
            : {
                action_type: this.demandDefinitionTrueActionType,
                action: this.demandDefinitionTrueAction,
                message: this.demandDefinitionTrueActionMessage,
              },
          sendDemandFalse: this.sendDemandFalse,
          demandAssetFalse: this.demandAssetFalse === null ? null : this.demandAssetFalse.id,
          demandDefinitionFalse: !this.sendDemandFalse
            ? null
            : {
                action_type: this.demandDefinitionFalseActionType,
                action: this.demandDefinitionFalseAction,
                message: this.demandDefinitionFalseActionMessage,
              },
        };
      } else {
        return {
          rowActiveCheckBox: this.rowActiveCheckBox,
          measurementList: this.measurementList,
          measurement1Function: this.measurement1Function,
          timeRange: this.timeRange,
          durationSyntax: this.durationSyntax,
          operationData: this.operationData,
          thresholdMeasurement: this.thresholdMeasurement,
          measurementList2: this.measurementList2,
          measurement2Function: this.measurement2Function,
          timeRange2: this.timeRange2,
          durationSyntax2: this.durationSyntax2,
          demandAssetTrue: this.demandAssetTrue === null ? null : this.demandAssetTrue.id,
          demandDefinitionTrue: !this.sendDemandTrue
            ? null
            : {
                action_type: this.demandDefinitionTrueActionType,
                action: this.demandDefinitionTrueAction,
                message: this.demandDefinitionTrueActionMessage,
              },
          sendDemandFalse: this.sendDemandFalse,
          demandAssetFalse: this.demandAssetFalse === null ? null : this.demandAssetFalse.id,
          demandDefinitionFalse: !this.sendDemandFalse
            ? null
            : {
                action_type: this.demandDefinitionFalseActionType,
                action: this.demandDefinitionFalseAction,
                message: this.demandDefinitionFalseActionMessage,
              },
        };
      }
    },
    async assetValid() {
      this.detailsError = false;
    },
    async assetInvalid() {
      this.detailsError = true;
    },
    measurementSelectionDialog(id) {
      this.measurementModified = id;
      this.$refs.measurementSelectionList.open();
    },
    handleMeasurementSelection(selectedId) {
      if (this.measurementModified == 0) {
        this.measurementList = selectedId;
        console.log(selectedId + " . " + this.measurementList);
        this.validateMeasurement1();
      } else {
        this.measurementList2 = selectedId;
        console.log(selectedId + " . " + this.measurementList2);
        this.validateMeasurement2();
      }
    },
    hiddenCheckbox() {
      this.showCheckbox = false;
    },
    hiddenButton() {
      this.showButton = false;
    },
    hiddenLabel() {
      this.showLabel = false;
    },
  },
};
</script>
<style scoped lang="scss">
.template_container {
  margin: 100px 200px;
  text-align: center;
}

.container {
  display: flex;
  //justify-content: center;
  align-items: center;
  /* Set the desired height for the container */
  height: 100%;
  margin-left: 5px;
}
.invalid-input {
  border-color: red; /* Set any style you want for invalid input */
}
</style>
