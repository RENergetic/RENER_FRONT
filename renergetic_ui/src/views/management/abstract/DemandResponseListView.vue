<template>
  <Card style="width: 95%; margin: auto; margin-top: 1%">
    <template #title>{{ $t("menu.demand_response_rules") }} </template>
    <template #content>
      <div class="w-full md:w-200rem">
        <div v-for="(demandRes, i) in demandResponseList" :key="i">
          <Button
            v-show="demandRes.withRule"
            id="idAsset"
            class="invisible-button"
            :label="`${$t('view.asset')} : ${demandRes.asset.name}`"
            :disabled="true"
          />
          <div v-for="(rule, j) in demandRes.ruleList" :key="j">
            <DemandResponseParameters ref="demandResponseParameters" @delete="deleteDemand(i, j)" />
          </div>
        </div>
      </div>
      <div class="gap-3 field grid button_grid">
        <Button @click="addDemandResponse">{{ $t("view.add_asset_rule") }}</Button>
        <Dropdown
          v-if="showDropdown"
          :options="assetOptions"
          :model-value="assetName"
          placeholder="Select Asset"
          @update:model-value="assetName = $event"
        />
        <Button v-if="showDropdown" label="Select" @click="addAssetRule(assetName)" />
        <Button @click="saveDemands()">{{ $t("view.save_asset_rules") }}</Button>
      </div>
    </template>
  </Card>
</template>

<script>
import DemandResponseParameters from "./DemandResponseParameters.vue";
import Button from "primevue/button";
export default {
  name: "DemandResponseListView",
  components: {
    DemandResponseParameters,
    Button,
  },
  data() {
    return {
      demandResponseList: [],
      assetRuleList: [],
      returnedInfo: null,
      howManyRules: [],
      addedRule: [],
      drpIndex: 0,
      showDropdown: false,
      assetIdCurrent: null,
      assetName: null,
      jsonMeasurementData: [],
      jsonThresholdData: null,
      questionnaire: null,
    };
  },
  computed: {
    assetOptions() {
      return this.assetRuleList.map((assetList) => assetList.asset.name);
    },
  },
  async created() {
    this.assetRuleList = await this.$ren.managementApi.getAllAssetRules();
    console.log("assetRuleList", this.assetRuleList);
    this.drpIndex = 0;
    let ruleCounter = 0;
    for (let i = 0; i < this.assetRuleList.length; i++) {
      if (this.assetRuleList[i].assetRules.length > 0) {
        const assetRule = {
          asset: this.assetRuleList[i].asset,
          withRule: true,
          ruleList: this.assetRuleList[i].assetRules,
        };
        await this.demandResponseList.push(assetRule);
        for (let j = 0; j < this.assetRuleList[i].assetRules.length; j++) {
          await this.$refs.demandResponseParameters[this.drpIndex].addPrecreatedAssetRule(this.assetRuleList[i].assetRules[j]);
          this.drpIndex++;
          ruleCounter++;
        }
        if (ruleCounter > 0) this.howManyRules.push(ruleCounter);
        ruleCounter = 0;
      }
    }
    console.log("la lista", this.demandResponseList);
  },
  methods: {
    addDemandResponse() {
      this.showDropdown = true;
      this.assetName = null;
    },
    selectedAsset(assetName) {
      return this.assetRuleList.find((assetRuleList) => assetRuleList.asset.name == assetName);
    },
    searchAsset(id) {
      return this.demandResponseList.findIndex((demandResponse) => {
        return demandResponse.asset.id === id;
      });
    },
    drpExchange(index1, index2) {
      this.$refs.demandResponseParameters[index1].rowActiveCheckBox = this.$refs.demandResponseParameters[index2].rowActiveCheckBox;
      this.$refs.demandResponseParameters[index1].showCheckbox = this.$refs.demandResponseParameters[index2].showCheckbox;
      this.$refs.demandResponseParameters[index1].showButton = this.$refs.demandResponseParameters[index2].showButton;
      this.$refs.demandResponseParameters[index1].showLabel = this.$refs.demandResponseParameters[index2].showLabel;
      this.$refs.demandResponseParameters[index1].measurementList = this.$refs.demandResponseParameters[index2].measurementList;
      this.$refs.demandResponseParameters[index1].measurement1Function = this.$refs.demandResponseParameters[index2].measurement1Function;
      this.$refs.demandResponseParameters[index1].operationData = this.$refs.demandResponseParameters[index2].operationData;
      this.$refs.demandResponseParameters[index1].thresholdMeasurement = this.$refs.demandResponseParameters[index2].thresholdMeasurement;
      this.$refs.demandResponseParameters[index1].measurementList2 = this.$refs.demandResponseParameters[index2].measurementList2;
      this.$refs.demandResponseParameters[index1].measurement2Function = this.$refs.demandResponseParameters[index2].measurement2Function;
      this.$refs.demandResponseParameters[index1].durationSyntax = this.$refs.demandResponseParameters[index2].durationSyntax;
      this.$refs.demandResponseParameters[index1].durationSyntax2 = this.$refs.demandResponseParameters[index2].durationSyntax2;
      this.$refs.demandResponseParameters[index1].timeRange = this.$refs.demandResponseParameters[index2].timeRange;
      this.$refs.demandResponseParameters[index1].timeRange2 = this.$refs.demandResponseParameters[index2].timeRange2;
      this.$refs.demandResponseParameters[index1].checkBoxBool = this.$refs.demandResponseParameters[index2].checkBoxBool;
      this.$refs.demandResponseParameters[index1].valueMeasurement = this.$refs.demandResponseParameters[index2].valueMeasurement;
      this.$refs.demandResponseParameters[index1].sendDemandTrue = this.$refs.demandResponseParameters[index2].sendDemandTrue;
      this.$refs.demandResponseParameters[index1].demandDefinitionTrueAction = this.$refs.demandResponseParameters[index2].demandDefinitionTrueAction;
      this.$refs.demandResponseParameters[index1].demandDefinitionTrueActionType =
        this.$refs.demandResponseParameters[index2].demandDefinitionTrueActionType;
      this.$refs.demandResponseParameters[index1].demandDefinitionTrueActionMessage =
        this.$refs.demandResponseParameters[index2].demandDefinitionTrueActionMessage;
      this.$refs.demandResponseParameters[index1].demandAssetTrue = this.$refs.demandResponseParameters[index2].demandAssetTrue;
      this.$refs.demandResponseParameters[index1].sendDemandFalse = this.$refs.demandResponseParameters[index2].sendDemandFalse;
      this.$refs.demandResponseParameters[index1].demandDefinitionFalseAction =
        this.$refs.demandResponseParameters[index2].demandDefinitionFalseAction;
      this.$refs.demandResponseParameters[index1].demandDefinitionFalseActionType =
        this.$refs.demandResponseParameters[index2].demandDefinitionFalseActionType;
      this.$refs.demandResponseParameters[index1].demandAssetFalse = this.$refs.demandResponseParameters[index2].demandAssetFalse;
    },
    newAssetRule(asset) {
      return {
        asset: asset,
        withRule: true,
        ruleList: [0],
      };
    },
    async addAssetRule(assetName) {
      const asset = this.selectedAsset(assetName);
      console.log("vamos a añadir asset", asset);
      const pos = this.searchAsset(asset.asset.id);
      console.log("pos donde esta", pos);
      this.showDropdown = false;
      if (pos !== -1) {
        let insertPos = 0;
        await this.demandResponseList[pos].ruleList.push(undefined);
        for (let i = 0; i <= pos; i++) {
          insertPos += this.howManyRules[i];
        }
        const addRule = {
          asset: asset.asset,
          insertPos: insertPos,
          drpPos: this.drpIndex,
        };
        this.addedRule.push(addRule);
        this.drpIndex++;
      } else {
        this.demandResponseList.push(this.newAssetRule(asset.asset));
        this.drpIndex++;
      }
    },
    posDelete(i, j) {
      let result = { ini: 0, fin: 0 };
      for (let pos = 0; pos < i; pos++) {
        result.ini += this.howManyRules[pos];
      }
      result.fin = result.ini + this.howManyRules[i] - 1;
      result.ini += j;
      return result;
    },
    async deleteDemand(i, j) {
      let posDelete = this.posDelete(i, j);
      if (j != this.howManyRules[i] - 1) {
        for (let a = posDelete.ini; a < posDelete.fin; a++) {
          this.drpExchange(a, a + 1);
        }
      }
      this.demandResponseList[i].ruleList.splice(j, 1);
      this.howManyRules[i]--;
      if (this.howManyRules[i] == 0) {
        this.demandResponseList[i].withRule = false;
      }
      this.drpIndex--;
    },
    async saveDemands() {
      this.jsonMeasurementData = [];
      let drpIndexList = 0;
      let msgType = "information";
      if (this.demandResponseList.length != 0) {
        let errors = false;
        for (let i = 0; i < this.demandResponseList.length; i++) {
          if (this.demandResponseList[i].ruleList.lenght > 0) errors = errors || this.$refs.demandResponseParameters[i].validateAll();
        }
        if (errors) {
          return;
        }
        for (let i = 0; i < this.demandResponseList.length; i++) {
          this.assetIdCurrent = this.demandResponseList[i].asset.id;
          for (let j = 0; j < this.demandResponseList[i].ruleList.length; j++) {
            let addedPos = -1;
            if (this.addedRule.length != 0) addedPos = this.addedRule.findIndex((rule) => rule.insertPos === drpIndexList);
            if (addedPos !== -1) {
              this.questionnaire = this.$refs.demandResponseParameters[this.addedRule[addedPos].drpPos];
              this.addedRule.splice(addedPos, 1);
            } else {
              this.questionnaire = this.$refs.demandResponseParameters[drpIndexList];
              drpIndexList++;
            }
            this.returnedInfo = await this.questionnaire.returnInfo();
            await this.jsonCreation();
          }
          this.saveData();
          this.$emitter.emit(msgType, { message: this.$t("view.correctly_added") });
          this.jsonMeasurementData = [];
        }
      } else {
        msgType = "error";
        this.saveData();
        this.$emitter.emit(msgType, { message: this.$t("view.no_values_added") });
      }
    },
    async jsonCreation() {
      let assetDetails;
      if (this.returnedInfo.thresholdMeasurement == "Threshold") {
        this.jsonData = await {
          assetId: this.assetIdCurrent,
          measurement1Id: this.returnedInfo.measurementList,
          functionMeasurement1: this.returnedInfo.measurement1Function,
          timeRangeMeasurement1: this.returnedInfo.timeRange + this.returnedInfo.durationSyntax,
          compareToConfigThreshold: this.returnedInfo.checkBoxBool,
          manualThreshold: this.returnedInfo.valueMeasurement,
          comparator: this.returnedInfo.operationData,
          active: this.returnedInfo.rowActiveCheckBox,
          sendDemandTrue: this.returnedInfo.sendDemandTrue,
          demandAssetTrue: this.returnedInfo.demandAssetTrue,
          demandDefinitionTrue: this.returnedInfo.demandDefinitionTrue,
          sendDemandFalse: this.returnedInfo.sendDemandFalse,
          demandAssetFalse: this.returnedInfo.demandAssetFalse,
          demandDefinitionFalse: this.returnedInfo.demandDefinitionFalse,
        };
        assetDetails = await this.getAssetDetails(this.jsonData.assetId);
        if (assetDetails.length != 0 || !this.jsonData.compareToConfigThreshold) {
          this.questionnaire.assetValid();
          this.jsonMeasurementData.push(this.jsonData);
          this.jsonData = null;
        } else {
          this.questionnaire.assetInvalid();
          this.jsonData = null;
        }
      } else {
        this.jsonData = await {
          assetId: this.assetIdCurrent,
          measurement1Id: this.returnedInfo.measurementList,
          functionMeasurement1: this.returnedInfo.measurement1Function,
          timeRangeMeasurement1: this.returnedInfo.timeRange + this.returnedInfo.durationSyntax,
          measurement2Id: this.returnedInfo.measurementList2,
          functionMeasurement2: this.returnedInfo.measurement2Function,
          timeRangeMeasurement2: this.returnedInfo.timeRange2 + this.returnedInfo.durationSyntax2,
          comparator: this.returnedInfo.operationData,
          active: this.returnedInfo.rowActiveCheckBox,
          sendDemandTrue: this.returnedInfo.sendDemandTrue,
          demandAssetTrue: this.returnedInfo.demandAssetTrue,
          demandDefinitionTrue: this.returnedInfo.demandDefinitionTrue,
          sendDemandFalse: this.returnedInfo.sendDemandFalse,
          demandAssetFalse: this.returnedInfo.demandAssetFalse,
          demandDefinitionFalse: this.returnedInfo.demandDefinitionFalse,
        };
        assetDetails = await this.getAssetDetails(this.jsonData.assetId);
        this.jsonMeasurementData.push(this.jsonData);
        this.jsonData = null;
      }
    },
    async getAssetDetails(id) {
      return await this.$ren.managementApi.getAssetDetails(id);
    },
    async saveData() {
      await this.$ren.managementApi.updateCreateDelete(this.jsonMeasurementData, this.assetIdCurrent);
    },
  },
};
</script>
<style scoped lang="scss">
.button_grid {
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
</style>
