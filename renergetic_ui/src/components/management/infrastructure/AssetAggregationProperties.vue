<template>
  <Dialog v-model:visible="dialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <h3>Measurements Aggregation</h3>
    <div class="measurement-aggregation-list">
      <div class="" v-for="(aggr, iMA) in configuration.measurementAggregation" :key="aggr">
        <button @click="deleteMAC(iMA)">Delete</button>
        <h4>Measurements</h4>
        <div class="" v-for="(measurement, i) in aggr.measurements" :key="measurement">
          <Dropdown
            v-model="aggr.measurements[i]"
            :options="measurementsData"
            optionValue="id"
            optionLabel="label"
            placeholder="Select a Measurement"
            class="w-full md:w-14rem"
            @change="selectedMeasurement(aggr.measurements[i], aggr.measurements)"
          />
          <button @click="deleteMeasurement(iMA, i)">Delete</button>
        </div>
        <button @click="addMeasurement(aggr.measurements)">Add Measurement</button>
        <h4>Outputs</h4>
        <div class="" v-for="(output, i) in aggr.outputs" :key="output">
          <Dropdown
            v-model="aggr.outputs[i].aggregationType"
            :options="outputFunctionsParams"
            placeholder="Select a Output"
            class="w-full md:w-14rem"
          />
          <ren-input v-model="aggr.outputs[i].timeMin" :text-label="'Time min'" />
          <ren-input v-model="aggr.outputs[i].timeMax" :text-label="'Time max'" />
          <ren-input v-model="aggr.outputs[i].timeRange" :text-label="'Time range'" />
          <button @click="deleteOutput(iMA, i)">Delete</button>
        </div>
        <button @click="addOutput(aggr.outputs)">Add Output</button>
      </div>
      <button @click="addMAC">Add Configuration</button>
    </div>
    <h3>Multi-Vector Component Type</h3>
    <div class="mvct-holder">
      <Dropdown
        v-model="configuration.mvoComponentType.type"
        :options="optimizerTypes"
        optionValue="name"
        optionLabel="name"
        placeholder="Select a type"
        class="w-full md:w-14rem"
        @change="fetchOptimizerParameters"
      />
      <Dropdown v-model="configuration.mvoComponentType.domainA" :options="domains" placeholder="Select domain A" class="w-full md:w-14rem" />
      <Dropdown v-model="configuration.mvoComponentType.domainB" :options="domains" placeholder="Select domain B" class="w-full md:w-14rem" />
    </div>
    <h3>Parameters Aggregation Configuration</h3>
    <div v-if="configuration.parametersAggregationConfiguration !== null && Object.keys(configuration.parametersAggregationConfiguration).length > 0">
      <DataTable :value="configuration.parametersAggregationConfiguration" tableStyle="min-width: 50rem">
        <Column header="Aggregation">
          <template #body="slotProps">
            <Dropdown
              v-model="slotProps.data.aggregation"
              :options="aggregationFunctionsParams"
              placeholder="Aggregation"
              class="w-full md:w-14rem"
            />
          </template>
        </Column>
        <Column header="Parameter">
          <template #body="slotProps">
            {{ slotProps.index }}
          </template>
        </Column>
        <Column v-for="column of columns" :key="column" :field="(data) => getTableData(data, column)" :header="'Asset ' + column"></Column>
      </DataTable>
    </div>
    <ren-submit @submit="submit" />
    <!-- <Button @click="submit">Submit</Button> -->
  </Dialog>
</template>
<script>
import { MeasurementDomains, MeasurementDirection } from "@/plugins/model/Enums.js";
export default {
  name: "AssetAggregationProperties",
  emits: ["submit"],
  props: {
    modelValue: { type: Object, default: null },
  },
  data() {
    return {
      mValue: this.modelValue,
      dialog: false,
      aggregationFunctionsParams: ["sum", "min", "max", "mean"],
      outputFunctionsParams: ["sum", "min", "max", "mean", "last"],
      measurementsData: [],
      optimizerTypes: [],
      configuration: {
        measurementAggregation: [],
        mvoComponentType: {
          type: "",
          domainA: "",
          domainB: "",
        },
        parametersAggregationConfiguration: {},
      },
      domains: MeasurementDomains.keys(),
      directions: MeasurementDirection.keys(),
      assetId: null,
      assetValues: [],
      columns: [],
    };
  },
  methods: {
    async open(row) {
      this.assetId = row.id;

      await this.$ren.managementApi.getMeasurementsFromConnectedAssets(this.assetId).then((measurements) => {
        this.measurementsData = measurements;
      });

      await this.$ren.managementApi.getMeasurementAggregation(row.id).then((config) => {
        console.info(config);
        this.configuration = config;
        this.transformAssetValues();
      });

      await this.$ren.managementApi.getOptimizerTypes().then((optimizerTypes) => {
        console.info(optimizerTypes);
        this.optimizerTypes = optimizerTypes;
      });

      await this.fetchOptimizerParameters();
      //this.configuration = this.configuration; //TODO: Fetch data from backend
      this.dialog = true;
    },
    async fetchOptimizerParameters() {
      //TODO: Temporary store the mvoComponentType retrieved from api and restore it upon selection here in the list.
      if (this.configuration.mvoComponentType.type === null || this.configuration.mvoComponentType.type === undefined) {
        return;
      }
      await this.$ren.managementApi.getOptimizerParameters(this.assetId, this.configuration.mvoComponentType.type).then((optimizerParameters) => {
        this.configuration.parametersAggregationConfiguration = optimizerParameters;
        this.transformAssetValues();
      });
    },
    getTableData(in1, in2) {
      console.log(in1);
      console.log(in1 + " " + in2);
      return in1.assetValues[in2];
    },
    transformAssetValues() {
      this.columns = [];
      let keys = Object.keys(this.configuration.parametersAggregationConfiguration);
      if (keys.length > 0) {
        for (const [index] of Object.entries(this.configuration.parametersAggregationConfiguration[keys[0]].assetValues)) {
          this.columns.push(index);
        }
      }
    },
    addMAC() {
      this.configuration.measurementAggregation.push({
        measurements: [],
        outputs: [],
      });
      console.log(this.configuration);
    },
    deleteMAC(index) {
      console.log(this.configuration);
      this.configuration.measurementAggregation.splice(this.configuration.measurementAggregation[index], 1);
    },
    async addMeasurement(item) {
      if (item.length === 0) {
        await this.$ren.managementApi.getMeasurementsFromConnectedAssets(this.assetId).then((measurements) => {
          this.measurementsData = measurements;
        });
      }
      item.push(null);
    },
    async selectedMeasurement(measurementId, measurements) {
      if (measurements.length === 1) {
        await this.$ren.managementApi
          .getMeasurementsFromConnectedAssetsAndCompatibleWithSelectedMeasurement(this.assetId, measurementId)
          .then((measurements) => {
            this.measurementsData = measurements;
          });
      }
    },
    deleteMeasurement(indexMA, index) {
      this.configuration.measurementAggregation[indexMA].measurements.splice(
        this.configuration.measurementAggregation[indexMA].measurements[index],
        1,
      );
    },
    addOutput(item) {
      item.push({ aggregationType: null, timeMin: "", timeMax: "", timeRange: "" });
    },
    deleteOutput(indexMA, index) {
      this.configuration.measurementAggregation[indexMA].outputs.splice(this.configuration.measurementAggregation[indexMA].outputs[index], 1);
    },
    async submit() {
      console.log(this.configuration);
      await this.$ren.managementApi.saveMeasurementAggregation(this.assetId, this.configuration).then((config) => {
        this.configuration = config;
        this.transformAssetValues();
      });
    },
  },
};
</script>

<style scoped>
h3,
h4 {
  color: black;
}

.properties-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 20rem;
  margin-bottom: 2rem;
}

.properties-form div {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
