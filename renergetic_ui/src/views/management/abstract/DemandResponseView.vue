<template>
  <Card style="width: 85%; margin: auto; margin-top: 10%">
    <template #title> Abstract meter administration </template>
    <template #content>
      <!-- Render existing questionnaires -->
      <div class="w-full md:w-200rem">
        <div>
          <InputText v-model="assetId"></InputText>
          <div v-for="(demandRes, index) in demandResponseList" :key="index">
            <DemandResponseParameters ref="demandResponseParameters" @delete="deleteDemand(index)" />
          </div>
          <!-- Button to add new questionnaire -->
        </div>
      </div>
      <div class="gap-3 field grid button_grid">
        <Button @click="addDemandResponse">Add demand Response</Button>
        <Button @click="saveDemands()">Save</Button>
      </div>
    </template>
  </Card>
</template>

<script>
import DemandResponseParameters from "./DemandResponseParameters.vue";
export default {
  components: {
    DemandResponseParameters,
  },
  data() {
    return {
      demandResponseList: [], // Array to hold multiple questionnaires
      returnedInfo: null,
      assetId: 1,
      jsonMeasurementData: [],
      jsonThresholdData: null,
      questionnaire: null,
    };
  },
  async created() {
    console.log("Demand response view created");
    let oldValues = await this.$ren.managementApi.getAssetRules(this.assetId);
    console.log(oldValues);
    for (let j = 0; j < oldValues.length; j++) {
      console.log(oldValues[j]);
      const newDemandResponse = this.$refs.childComponentRef;
      await this.demandResponseList.push(newDemandResponse);
      //pasar el valor correcto por valor y comprobar que se guarden bien
      await this.$refs.demandResponseParameters[j].addPrecreatedAssetRule(oldValues[j]);
      console.log("Value written");
      let aux = await this.$refs.demandResponseParameters[j].returnInfo();
      console.log(aux);
    }
  },
  methods: {
    addDemandResponse() {
      // Create a new questionnaire object with default values or leave it empty
      const newDemandResponse = this.$refs.childComponentRef;

      // Push the new questionnaire to the questionnaires array
      this.demandResponseList.push(newDemandResponse);
    },
    deleteDemand(index) {
      this.demandResponseList.splice(index, 1);
    },
    async saveDemands() {
      this.jsonMeasurementData = [];
      if (this.demandResponseList.length != 0) {
        for (let i = 0; i < this.demandResponseList.length; i++) {
          this.questionnaire = this.$refs.demandResponseParameters[i];
          this.returnedInfo = await this.questionnaire.returnInfo();
          console.log("Questionnaire Info: ", this.returnedInfo);
          await this.jsonCreation();
          console.log("end of jsoncreation");
        }
        console.log("End of for");
        this.saveData();
      } else {
        console.log("No value to add");
      }
    },
    async jsonCreation() {
      let assetDetails;
      if (this.returnedInfo.thresholdMeasurement == "Threshold") {
        this.jsonData = await {
          //id: this.abstractValudId,
          assetId: this.assetId,
          measurement1Id: this.returnedInfo.measurementList,
          functionMeasurement1: this.returnedInfo.measurement1Function,
          timeRangeMeasurement1: this.returnedInfo.timeRange + " " + this.returnedInfo.durationSyntax,
          compareToConfigThreshold: this.returnedInfo.checkBoxBool,
          manualThreshold: this.returnedInfo.valueMeasurement,
          comparator: this.returnedInfo.operationData,
          active: this.returnedInfo.rowActiveCheckBox,
        };
        assetDetails = await this.getAssetDetails(this.jsonData.assetId);
        console.log("assetDetails");
        console.log(assetDetails.length);
        if (assetDetails.length != 0 || !this.jsonData.compareToConfigThreshold) {
          this.questionnaire.assetValid();
          console.log("The asset details exist");
          console.log(assetDetails);
          this.jsonMeasurementData.push(this.jsonData);
          this.jsonData = null;
          console.log("test");
        } else {
          console.log("The asset details are empty");
          console.log(await this.questionnaire.returnInfo());
          console.log("The asset details are empty 2");
          this.questionnaire.assetInvalid();
        }
      } else {
        this.jsonData = await {
          //id: this.abstractValudId,
          assetId: this.assetId,
          measurement1Id: this.returnedInfo.measurementList,
          functionMeasurement1: this.returnedInfo.measurement1Function,
          timeRangeMeasurement1: this.returnedInfo.timeRange + " " + this.returnedInfo.durationSyntax,
          measurement2Id: this.returnedInfo.measurementList2,
          functionMeasurement2: this.returnedInfo.measurement2Function,
          timeRangeMeasurement2: this.returnedInfo.timeRange2 + " " + this.returnedInfo.durationSyntax2,
          comparator: this.returnedInfo.operationData,
          active: this.returnedInfo.rowActiveCheckBox,
        };
        assetDetails = await this.getAssetDetails(this.jsonData.assetId);
        console.log("assetDetails");
        console.log(assetDetails);
        console.log("The asset details exist");
        console.log(assetDetails);
        this.jsonMeasurementData.push(this.jsonData);
        console.log(this.jsonData);
        this.jsonData = null;
      }
    },
    async getAssetDetails(id) {
      return await this.$ren.managementApi.getAssetDetails(id);
    },
    saveData() {
      console.log("Save data for asset: " + this.assetId);
      console.log(this.jsonMeasurementData);
      this.$ren.managementApi.updateCreateDelete(this.jsonMeasurementData, this.jsonMeasurementData[0].assetId);
    },
  },
};
</script>
<style scoped lang="scss">
.button_grid {
  margin-left: 5px;
}
</style>
