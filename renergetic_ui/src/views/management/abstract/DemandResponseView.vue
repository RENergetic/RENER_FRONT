<template>
  <Card style="width: 65%; margin: auto; margin-top: 10%">
    <template #title> Abstract meter administration </template>
    <template #content>
      <div class="w-full md:w-200rem">
        <div class="card flex-wrap gap-3 field grid container">
          <ren-input-wrapper>
            <template #content>
              <Dropdown
                v-model="measurementList"
                :placeholder="dropdownMeasurementList[0]"
                :options="dropdownMeasurementList"
                class="w-full md:w-11rem"
                @change="validateButton"
              />
            </template>
          </ren-input-wrapper>
          <ren-input-wrapper>
            <template #content>
              <Dropdown
                v-model="operationData"
                :placeholder="dropdownOperation[0]"
                :options="dropdownOperation"
                class="w-full md:w-6rem"
                @change="validateButton"
              />
            </template>
          </ren-input-wrapper>
          <ren-input-wrapper>
            <template #content>
              <Dropdown
                v-model="thresholdMeasurement"
                :placeholder="dropdownThresholdMeasurement[0]"
                :options="dropdownThresholdMeasurement"
                class="w-full md:w-11rem"
                @change="validateButton"
              />
            </template>
          </ren-input-wrapper>
          <div v-if="thresholdMeasurement == 'Threshold'" class="card flex-wrap gap-3 field grid container">
            <Checkbox v-model="checkBoxBool" :binary="true" />
            <p>from config</p>
            <InputText v-model="valueMeasurement" class="inputTextCondition" type="text" :placeholder="'0'" @input="validateCondition" />
          </div>
          <div v-else-if="thresholdMeasurement == 'Measurement'">
            <ren-input-wrapper>
              <template #content>
                <Dropdown
                  v-model="timeRange"
                  :placeholder="dropdownTimeRange[0]"
                  :options="dropdownTimeRange"
                  class="w-full md:w-14rem"
                  @change="validateButton"
                />
              </template>
            </ren-input-wrapper>
          </div>
          <div v-else>ERROR</div>
        </div>
      </div>
    </template>
  </Card>
</template>
<script>
import Checkbox from "primevue/checkbox";
export default {
  name: "AbstracMetersView",
  components: {
    Checkbox,
  },
  data() {
    return {
      measurementList: null,
      timeRange: null,
      thresholdMeasurement: null,
      operationData: null,
      dropdownMeasurementList: ["Measurement1", "Measurement2"],
      dropdownTimeRange: ["Measurement1", "Measurement2"],
      dropdownThresholdMeasurement: ["Threshold", "Measurement"],
      dropdownOperation: [">", ">=", "<", "<="],
      checkBoxBool: true,
      valueMeasurement: null,
    };
  },
  async created() {
    console.log("Created");
    this.thresholdMeasurement = this.dropdownThresholdMeasurement[0];
    console.log("End of created");
  },
  methods: {},
};
</script>
<style scoped lang="scss">
.template_container {
  margin: 100px 200px;
  text-align: center;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  /* Set the desired height for the container */
}
</style>
