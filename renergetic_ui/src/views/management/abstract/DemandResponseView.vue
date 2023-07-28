<template>
  <Card style="width: 85%; margin: auto; margin-top: 10%">
    <template #title> Abstract meter administration </template>
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
        <Button @click="addDemandResponse">Add demand Response</Button>
        <Button @click="saveDemands(0)">Save</Button>
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
    };
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
    async saveDemands(questionnaireIndex) {
      /*
      id (mandatory)
      asset (mandatory)
      measurement 1 (mandatory)
      measurement 1 function (mandatory)
      measurement 1 time range (mandatory)
      measurement 2 (optional)
      measurement 2 function (optional but mandatory if measurement 2 is set)
      measurement 2 time range (optional but mandatory if measurement 2 is set)
      compare to config threshold (optional boolean to check the asset detail for a rule_threshold key)
      manual threshold (optional, overrides the asset detail)
      comparator (mandatory)
      active (mandatory boolean)
      */
      if (this.demandResponseList.length != 0) {
        const questionnaire = this.$refs.demandResponseParameters[questionnaireIndex];
        this.returnedInfo = await questionnaire.returnInfo();
        console.log("Questionnaire Info: ", this.returnedInfo);
        /*this.demandResponseList.forEach((demRes) => {
          console.log(demRes.returnInfo());
        });*/
        const assetIdCreated = 1;
        const jsonAbstractMeter = await {
          //id: this.abstractValudId,
          assetId: assetIdCreated,
          measurement1id: this.returnedInfo.measurementList,
          functionMeasurement1: this.returnedInfo.measurement1Function,
          timeRangeMeasurement1: this.returnedInfo.timeRange + " " + this.returnedInfo.durationSyntax,
          measurement2id: this.returnedInfo.measurementList2,
          functionMeasurement2: this.returnedInfo.measurement2Function,
          timeRangeMeasurement2: this.returnedInfo.timeRange2 + " " + this.returnedInfo.durationSyntax2,
          compareToConfigThreshold: this.returnedInfo.operationData,
          manualThreshold: this.returnedInfo.thresholdMeasurement,
          comparator: this.returnedInfo.operationData,
          active: this.returnedInfo.rowActiveCheckBox,
        };
        console.log(jsonAbstractMeter);
        //await this.$ren.managementApi.insertRule(jsonAbstractMeter);
      } else {
        console.log("No value to add");
      }
    },
    saveData(data) {
      console.log(data);
    },
  },
};
</script>
<style scoped lang="scss">
.button_grid {
  margin-left: 5px;
}
</style>
