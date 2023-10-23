<template>
  <div class="gap-3 field grid container">
    <!-- obtained from the backend -->
    <Checkbox v-model="rowActiveCheckBox" :binary="true" />
    <Dropdown v-model="measurementList" :options="formattedOptions" :placeholder="'Measurements'" optionLabel="label" optionValue="value" />
    <Dropdown
      v-model="measurement1Function"
      :placeholder="dropdownMeasurementFunction[0]"
      :options="dropdownMeasurementFunction"
      class="w-full md:w-8rem"
    />
    <InputText v-model="timeRange" class="md:w-4rem" :class="[borderColor0]" type="text" @input="validateInput(0)" />
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
        :class="[borderColor2]"
        type="text"
        :placeholder="'0'"
        @input="validateInput(2)"
      />
    </div>
    <div v-else-if="thresholdMeasurement == 'Measurement'" class="gap-3 container">
      <Dropdown v-model="measurementList2" :options="formattedOptions" :placeholder="'Measurements'" optionLabel="label" optionValue="value" />
      <Dropdown
        v-model="measurement2Function"
        :placeholder="dropdownMeasurementFunction[0]"
        :options="dropdownMeasurementFunction"
        class="w-full md:w-8rem"
      />
      <InputText v-model="timeRange2" class="inputTextCondition md:w-4rem" :class="[borderColor1]" type="text" @input="validateInput(1)" />
      <Dropdown v-model="durationSyntax2" :placeholder="dropdownDurationSyntax[0]" :options="dropdownDurationSyntax" class="w-full md:w-6rem" />
    </div>
    <div v-else>ERROR</div>
    <div v-if="detailsError">
      <label>{{ $t("view.asset_details_dont_exist") }}</label>
    </div>
    <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="deleteDemandResponseUI()" />
  </div>
</template>
<script>
import Checkbox from "primevue/checkbox";
export default {
  name: "DemandResponseParameters",
  components: {
    Checkbox,
  },
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
      checkBoxBool: true,
      valueMeasurement: null,
      rowActiveCheckBox: null,
      measurement1function: null,
      dropdownMeasurementFunction: ["COUNT", "DISTINCT", "MEAN", "MEDIAN", "SUM", "MAX", "MIN", "FIRST", "LAST"],
      dropdownDurationSyntax: ["ns", "us", "ms", "s", "m", "h", "d", "w", "mo", "y"],
      validInput0: true,
      validInput1: true,
      validInput2: true,
      borderColor0: "",
      borderColor1: "",
      borderColor2: "",
      detailsError: false,
    };
  },
  computed: {
    formattedOptions() {
      let formattedMeasurement = this.dropdownMeasurementList.map((drop) => ({
        value: drop.id,
        label: drop.name + " : " + (drop.label || "No label"), // Example: Convert label to uppercase
      }));
      return formattedMeasurement;
    },
  },
  created() {
    this.rowActiveCheckBox = false;
    this.measurementList = this.dropdownMeasurementList[0];
    this.measurement1Function = this.dropdownMeasurementFunction[0];
    this.operationData = this.dropdownOperation[0];
    this.thresholdMeasurement = this.dropdownThresholdMeasurement[0];
    this.measurementList2 = this.dropdownMeasurementFunction[0];
    this.measurement2Function = this.dropdownMeasurementFunction[0];
    this.durationSyntax = this.dropdownDurationSyntax[0];
    this.durationSyntax2 = this.dropdownDurationSyntax[0];
    this.measurementsGetter();
  },
  methods: {
    //Process to obtain the asset rules from the DDBB
    addPrecreatedAssetRule(assetRule) {
      [this.timeRange1, this.durationSyntax1] = assetRule.timeRangeMeasurement1.split(" ");
      //threshold
      if (assetRule.timeRangeMeasurement2 == null) {
        this.rowActiveCheckBox = assetRule.active;
        this.measurementList = assetRule.measurement1Id;
        this.measurement1Function = assetRule.functionMeasurement1;
        [this.timeRange, this.durationSyntax] = assetRule.timeRangeMeasurement1.split(" ");
        this.operationData = assetRule.comparator;
        this.thresholdMeasurement = this.dropdownThresholdMeasurement[0];
        this.checkBoxBool = assetRule.compareToConfigThreshold;
        this.valueMeasurement = assetRule.manualThreshold;
        this.measurementList2 = this.dropdownMeasurementFunction[0];
        this.measurement2Function = this.dropdownMeasurementFunction[0];
        this.timeRange2 = null;
        this.durationSyntax2 = this.dropdownDurationSyntax[0];
      } else if (assetRule.timeRangeMeasurement2 != null) {
        //measurement
        this.rowActiveCheckBox = assetRule.active;
        this.measurementList = assetRule.measurement1Id;
        this.measurement1Function = assetRule.functionMeasurement1;
        [this.timeRange, this.durationSyntax] = assetRule.timeRangeMeasurement1.split(" ");
        this.operationData = assetRule.comparator;
        this.thresholdMeasurement = this.dropdownThresholdMeasurement[1];
        this.checkBoxBool = null;
        this.valueMeasurement = null;
        this.measurementList2 = assetRule.measurement2Id;
        this.measurement2Function = assetRule.functionMeasurement2;
        [this.timeRange2, this.durationSyntax2] = assetRule.timeRangeMeasurement2.split(" ");
      } else {
        console.error("MESSAGE ERROR");
      }
    },
    async measurementsGetter() {
      this.dropdownMeasurementList = await this.$ren.managementApi.getAllMeasurementsPaginationWorkaround();
      this.dropdownMeasurementList2 = this.dropdownMeasurementList;
    },
    async deleteDemandResponseUI() {
      this.$emit("delete");
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
        };
      }
    },
    async assetValid() {
      this.detailsError = false;
    },
    async assetInvalid() {
      this.detailsError = true;
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
