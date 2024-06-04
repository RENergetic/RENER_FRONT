<template>
  <Dialog v-model:visible="visibleDemandResponse" :style="{ width: '95%' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <Card style="width: 95%; margin: auto; margin-top: 1%">
      <template #title>{{ $t("view.demand_response_rules_administration") }} </template>
      <template #content>
        <!-- Render existing questionnaires -->
        <div class="w-full md:w-200rem">
          <div>
            <div v-for="(demandRes, index) in demandResponseList" :key="index">
              <DemandResponseParameters ref="demandResponseParameters" @delete="deleteDemand(index)" />
            </div>
            <!-- Button to add new questionnaire -->
          </div>
        </div>
        <div class="gap-3 field grid button_grid">
          <Button @click="addDemandResponse">{{ $t("view.add_demand_response_rule") }}</Button>
          <Button @click="saveDemands()">{{ $t("view.save_demand_response_rule") }}</Button>
        </div>
      </template>
    </Card>
  </Dialog>
</template>

<script>
import DemandResponseParameters from "./DemandResponseParameters.vue";
export default {
  name: "DemandResponseView",
  components: {
    DemandResponseParameters,
  },
  data() {
    return {
      demandResponseList: [], // Array to hold multiple questionnaires
      returnedInfo: null,
      assetId: null,
      jsonMeasurementData: [],
      jsonThresholdData: null,
      questionnaire: null,
      visibleDemandResponse: false,
    };
  },
  methods: {
    async open(current) {
      this.visibleDemandResponse = true;
      this.assetId = current;
      this.demandResponseList = [];
      let oldValues = await this.$ren.managementApi.getAssetRules(this.assetId);
      for (let j = 0; j < oldValues.length; j++) {
        const newDemandResponse = this.$refs.childComponentRef;
        await this.demandResponseList.push(newDemandResponse);
        await this.$refs.demandResponseParameters[j].addPrecreatedAssetRule(oldValues[j]);
        //let aux = await this.$refs.demandResponseParameters[j].returnInfo();
        //console.log(aux);
      }
    },
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
      let msgType = "information";
      if (this.demandResponseList.length != 0) {
        msgType = "information";
        for (let i = 0; i < this.demandResponseList.length; i++) {
          this.questionnaire = this.$refs.demandResponseParameters[i];
          this.returnedInfo = await this.questionnaire.returnInfo();
          await this.jsonCreation();
        }
        this.saveData();
        this.$emitter.emit(msgType, { message: this.$t("view.correctly_added") });
      } else {
        msgType = "error";
        this.saveData();
        this.$emitter.emit(msgType, { message: this.$t("view.no_values_added") });
        console.log("No value to add");
      }
    },
    async jsonCreation() {
      let assetDetails;
      if (this.returnedInfo.thresholdMeasurement == "Threshold") {
        this.jsonData = await {
          assetId: this.assetId,
          measurement1Id: this.returnedInfo.measurementList,
          functionMeasurement1: this.returnedInfo.measurement1Function,
          timeRangeMeasurement1: this.returnedInfo.timeRange + this.returnedInfo.durationSyntax,
          compareToConfigThreshold: this.returnedInfo.checkBoxBool,
          manualThreshold: this.returnedInfo.valueMeasurement,
          comparator: this.returnedInfo.operationData,
          active: this.returnedInfo.rowActiveCheckBox,
        };
        assetDetails = await this.getAssetDetails(this.jsonData.assetId);
        console.log("Asset Details");
        console.log(assetDetails);
        if (assetDetails.length != 0 || !this.jsonData.compareToConfigThreshold) {
          this.questionnaire.assetValid();
          console.log("The asset details exist");
          this.jsonMeasurementData.push(this.jsonData);
          this.jsonData = null;
        } else {
          console.log("The asset details are empty");
          console.log(await this.questionnaire.returnInfo());
          this.questionnaire.assetInvalid();
          this.jsonData = null;
        }
      } else {
        this.jsonData = await {
          //id: this.abstractValudId,
          assetId: this.assetId,
          measurement1Id: this.returnedInfo.measurementList,
          functionMeasurement1: this.returnedInfo.measurement1Function,
          timeRangeMeasurement1: this.returnedInfo.timeRange + this.returnedInfo.durationSyntax,
          measurement2Id: this.returnedInfo.measurementList2,
          functionMeasurement2: this.returnedInfo.measurement2Function,
          timeRangeMeasurement2: this.returnedInfo.timeRange2 + this.returnedInfo.durationSyntax2,
          comparator: this.returnedInfo.operationData,
          active: this.returnedInfo.rowActiveCheckBox,
        };
        assetDetails = await this.getAssetDetails(this.jsonData.assetId);
        console.log("Asset details");
        console.log(assetDetails);
        console.log("Asset details correct");
        this.jsonMeasurementData.push(this.jsonData);
        this.jsonData = null;
      }
    },
    async getAssetDetails(id) {
      return await this.$ren.managementApi.getAssetDetails(id);
    },
    async saveData() {
      console.log("Save data for asset: " + this.assetId);
      console.log(this.jsonMeasurementData);
      await this.$ren.managementApi.updateCreateDelete(this.jsonMeasurementData, this.assetId);
      console.log("Data saved");
    },
  },
};
</script>
<style scoped lang="scss">
.button_grid {
  margin-left: 5px;
}
</style>
