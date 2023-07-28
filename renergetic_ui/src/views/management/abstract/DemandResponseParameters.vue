<template>
  <div class="gap-3 field grid container">
    <!-- obtained from the backend -->
    <Checkbox v-model="rowActiveCheckBox" :binary="true" />
    <Dropdown v-model="measurementList" :options="formattedOptions" :placeholder="'Measurements'" optionLabel="label" optionValue="value" />
    <ren-input-wrapper>
      <template #content>
        <Dropdown
          v-model="measurement1Function"
          :placeholder="dropdownMeasurementFunction[0]"
          :options="dropdownMeasurementFunction"
          class="w-full md:w-8rem"
        />
      </template>
    </ren-input-wrapper>
    <InputText v-model="timeRange" class="inputTextCondition md:w-4rem" type="text" @input="validateInput" />
    <ren-input-wrapper>
      <template #content>
        <Dropdown v-model="durationSyntax" :placeholder="dropdownDurationSyntax[0]" :options="dropdownDurationSyntax" class="w-full md:w-6rem" />
      </template>
    </ren-input-wrapper>
    <ren-input-wrapper>
      <template #content>
        <Dropdown v-model="operationData" :placeholder="dropdownOperation[0]" :options="dropdownOperation" class="w-full md:w-5rem" />
      </template>
    </ren-input-wrapper>
    <ren-input-wrapper>
      <template #content>
        <Dropdown
          v-model="thresholdMeasurement"
          :placeholder="dropdownThresholdMeasurement[0]"
          :options="dropdownThresholdMeasurement"
          class="w-full md:w-11rem"
        />
      </template>
    </ren-input-wrapper>
    <div v-if="thresholdMeasurement == 'Threshold'" class="card flex-wrap gap-3 field grid container">
      <Checkbox v-model="checkBoxBool" :binary="true" />
      <p>from config</p>
      <InputText v-model="valueMeasurement" class="inputTextCondition" type="text" :placeholder="'0'" @input="validateCondition" />
    </div>
    <div v-else-if="thresholdMeasurement == 'Measurement'" class="card flex-wrap gap-3 field grid">
      <Dropdown v-model="measurementList2" :options="formattedOptions" :placeholder="'Measurements'" optionLabel="label" optionValue="value" />
      <ren-input-wrapper>
        <template #content>
          <Dropdown
            v-model="measurement2Function"
            :placeholder="dropdownMeasurementFunction[0]"
            :options="dropdownMeasurementFunction"
            class="w-full md:w-8rem"
          />
        </template>
      </ren-input-wrapper>
      <InputText v-model="timeRange2" class="inputTextCondition md:w-4rem" type="text" @input="validateInput" />
      <ren-input-wrapper>
        <template #content>
          <Dropdown v-model="durationSyntax" :placeholder="dropdownDurationSyntax[0]" :options="dropdownDurationSyntax" class="w-full md:w-6rem" />
        </template>
      </ren-input-wrapper>
    </div>
    <div v-else>ERROR</div>
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
    console.log("Created");
    //initialization of variables
    this.rowActiveCheckBox = false;
    this.measurementList = this.dropdownMeasurementList[0];
    this.measurement1Function = this.dropdownMeasurementFunction[0];
    this.operationData = this.dropdownOperation[0];
    this.thresholdMeasurement = this.dropdownThresholdMeasurement[0];
    this.measurementList2 = this.dropdownMeasurementFunction[0];
    this.measurement2Function = this.dropdownMeasurementFunction[0];
    this.durationSyntax = this.dropdownDurationSyntax[0];
    this.durationSyntax2 = this.dropdownDurationSyntax[0];
    //end of initialization
    this.measurementsGetter();
    console.log("End of created");
  },
  methods: {
    async measurementsGetter() {
      console.log("MeasurementGetter");
      this.dropdownMeasurementList = await this.$ren.managementApi.getAllMeasurements();
      this.dropdownMeasurementList2 = this.dropdownMeasurementList;
      console.log(this.dropdownMeasurementList);
      console.log(this.dropdownMeasurementList2);
    },
    async saveDemandResponse() {
      console.log("Save values");
      if (this.thresholdMeasurement == "Threshold") {
        console.log("test");
      } else if (this.thresholdMeasurement == "Measurement") {
        console.log("test2");
      }
      console.log("Values saved");
    },
    async deleteDemandResponseUI() {
      this.$emit("delete");
    },
    validateInput() {
      const expressionRegex = /^[0-9]+$/;
      let isValidInput1 = expressionRegex.test(this.timeRange);
      let isValidInput2 = expressionRegex.test(this.timeRange2);
      console.log(isValidInput1);
      if (this.thresholdMeasurement == "Measurement") {
        console.log(isValidInput2);
      }
    },
    async returnInfo() {
      console.log("Returning info: " + this.rowActiveCheckBox);
      console.log("Returning info: " + this.measurement1Function);
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
        measurementList2: this.measurementList2,
        measurement2Function: this.measurement2Function,
        timeRange2: this.timeRange2,
        durationSyntax2: this.durationSyntax2,
      };
      /*
      return [
        this.rowActiveCheckBox,
        this.measurementList,
        this.measurement1Function,
        this.timeRange,
        this.durationSyntax,
        this.operationData,
        this.thresholdMeasurement,
        this.checkBoxBool,
        this.valueMeasurement,
        this.measurementList2,
        this.measurement2Function,
        this.timeRange2,
        this.durationSyntax2,
      ];
      */
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
</style>
