<template>
  <Dialog v-model:visible="dialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <div class="flex flex-column gap-4">
      <h3>Measurements Aggregation</h3>
      <Accordion>
        <AccordionTab v-for="(aggr, iMA) in configuration.measurementAggregation" :key="aggr.id">
          <template #header>
            <span class="flex align-items-center gap-2 w-full gap-3">
              <h4 class="m-0">Configuration {{ iMA + 1 }}</h4>
              <Button v-tooltip="'Delete'" icon="pi pi-trash" class="p-button-rounded p-button-danger flex-shrink-0" @click="deleteMAC(iMA)" />
            </span>
          </template>
          <div class="flex flex-column gap-3">
            <h4>Measurements</h4>
            <div class="flex flex-row gap-3" v-for="(measurement, i) in aggr.measurements" :key="measurement">
              <Dropdown
                v-model="aggr.measurements[i]"
                :options="measurementsData[iMA]"
                optionValue="id"
                optionLabel="label"
                placeholder="Select a Measurement"
                class="w-full md:w-14rem flex-1"
                @change="selectedMeasurement(aggr.measurements[i], aggr.measurements, iMA)"
              />
              <Button
                v-tooltip="'Delete Measurement'"
                icon="pi pi-trash"
                class="p-button-rounded p-button-danger"
                @click="deleteMeasurement(iMA, i)"
              />
            </div>
            <Button class="col-12 md:col-4 mx-auto" :label="'Add Measurement'" @click="addMeasurement(aggr.measurements, iMA)" />
            <h4>Outputs</h4>
            <div class="flex flex-row gap-1" v-for="(output, i) in aggr.outputs" :key="output.id">
              <Dropdown
                v-model="aggr.outputs[i].aggregationType"
                :options="outputFunctionsParams"
                placeholder="Select a Output"
                optionValue="value"
                optionLabel="label"
                class="w-full md:w-14rem"
              />
              <ren-input v-model="aggr.outputs[i].timeMin" :text-label="'Time min'" class="m-0" />
              <ren-input v-model="aggr.outputs[i].timeMax" :text-label="'Time max'" class="m-0" />
              <ren-input v-model="aggr.outputs[i].timeRange" :text-label="'Time range'" class="m-0" />
              <Button
                v-tooltip="'Delete output'"
                icon="pi pi-trash"
                class="p-button-rounded p-button-danger flex-shrink-0"
                @click="deleteOutput(iMA, i)"
              />
            </div>
            <Button class="col-12 md:col-4 mx-auto" :label="'Add Output'" @click="addOutput(aggr.outputs)" />
          </div>
        </AccordionTab>
      </Accordion>
      <Button class="col-12 md:col-4 mx-auto" :label="'Add Configuration'" @click="addMAC" />
      <h3>Component Type</h3>
      <div class="flex flex-row gap-3">
        <Dropdown
          v-model="configuration.mvoComponentType.type"
          showClear
          :options="optimizerTypes"
          optionValue="name"
          optionLabel="name"
          placeholder="Select a type"
          class="w-full md:w-14rem"
          @change="fetchOptimizerParametersAndUpdateDropdowns"
        />
        <Dropdown
          v-if="configuration.mvoComponentType.domainsQuantity !== null && configuration.mvoComponentType.domainsQuantity > 0"
          v-model="configuration.mvoComponentType.domainA"
          showClear
          :options="optimizerDomainAssets"
          optionValue="id"
          optionLabel="label"
          :placeholder="'Select ' + configuration.mvoComponentType.domainAReadableConnection"
          class="w-full md:w-14rem"
        />
        <Dropdown
          v-if="configuration.mvoComponentType.domainsQuantity !== null && configuration.mvoComponentType.domainsQuantity > 1"
          v-model="configuration.mvoComponentType.domainB"
          showClear
          :options="optimizerDomainAssets"
          optionValue="id"
          optionLabel="label"
          :placeholder="'Select ' + configuration.mvoComponentType.domainBReadableConnection"
          class="w-full md:w-14rem"
        />
      </div>
      <h3>Asset Details Aggregation Configuration</h3>
      <div v-if="configuration.parametersAggregationConfiguration !== null && configuration.parametersAggregationConfiguration.length > 0">
        <DataTable
          :value="configuration.parametersAggregationConfiguration"
          :rowClass="(desc) => (desc.required !== null ? 'bg-highlight' : null)"
          editMode="cell"
          @cell-edit-complete="onCellEditComplete"
        >
          <Column header="Aggregation">
            <template #body="slotProps">
              <Dropdown
                v-model="slotProps.data.aggregation"
                showClear
                :options="aggregationFunctionsParams"
                optionValue="value"
                optionLabel="label"
                placeholder="Aggregation"
                class="w-full md:w-14rem"
              />
            </template>
          </Column>
          <Column header="Parameter">
            <template #body="slotProps">
              <div v-bind:class="{ 'font-bold': slotProps.data.required }">
                {{ slotProps.data.parameter }}
              </div>
            </template>
          </Column>
          <Column header="Component Requirement">
            <template #body="slotProps">
              <div v-bind:class="{ 'font-bold': slotProps.data.required }">
                {{ slotProps.data.required === null ? "" : slotProps.data.required ? "Required" : "Optional" }}
              </div>
            </template>
          </Column>
          <Column v-for="column of configuration.columns" :key="column.key" :field="column.key" :header="'Asset ' + column.label" class="">
            <template #body="{ data, field }">
              <div class="text-red-500" v-if="data[field] === null">
                <span v-if="data.required">Required</span>
              </div>
              <div v-else>
                {{ data[field] }}
              </div>
            </template>
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" autofocus />
            </template>
          </Column>
        </DataTable>
      </div>
      <!-- <Button @click="submit">Submit</Button> -->
    </div>
    <ren-submit @submit="submit" />
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
      viewKeysGeneration: 1,
      aggregationFunctionsParams: [
        { label: "Sum", value: "sum" },
        { label: "Min", value: "min" },
        { label: "Max", value: "max" },
        { label: "Mean", value: "mean" },
      ],
      outputFunctionsParams: [
        { label: "Sum", value: "sum" },
        { label: "Min", value: "min" },
        { label: "Max", value: "max" },
        { label: "Mean", value: "mean" },
        { label: "Last", value: "last" },
      ],
      measurementsData: [],
      optimizerDomainAssets: [],
      optimizerTypes: [],
      configuration: {
        measurementAggregation: [],
        mvoComponentType: {
          type: "",
          domainsQuantity: null,
          domainA: null,
          domainB: null,
        },
        parametersAggregationConfiguration: [],
        columns: [],
      },
      domains: MeasurementDomains.keys(),
      directions: MeasurementDirection.keys(),
      assetId: null,
    };
  },
  methods: {
    async open(row) {
      this.assetId = row.id;

      await this.$ren.dataApi.getMeasurementAggregation(row.id).then(async (config) => {
        console.info(config);
        if (config.measurementAggregation !== null) {
          for (const [i, ma] of config.measurementAggregation.entries()) {
            ma.id = this.viewKeysGeneration;
            this.viewKeysGeneration += 1;
            if (ma.outputs !== null) {
              for (let o of ma.outputs) {
                o.id = this.viewKeysGeneration;
                this.viewKeysGeneration += 1;
              }
            }

            if (ma.measurements != null) {
              if (ma.measurements.length === 0) {
                await this.$ren.dataApi.getMeasurementsFromConnectedAssets(this.assetId).then((measurements) => {
                  this.measurementsData[i] = measurements;
                });
              } else {
                await this.$ren.dataApi
                  .getMeasurementsFromConnectedAssetsAndCompatibleWithSelectedMeasurement(this.assetId, ma.measurements[0])
                  .then((measurements) => {
                    this.measurementsData[i] = measurements;
                  });
              }
            }
          }
        }
        await this.$ren.managementApi.listAsset({ type: "optimizer_domain" }, 0, 50).then((optimizerDomainAssets) => {
          this.optimizerDomainAssets = optimizerDomainAssets;
        });
        this.configuration = config;
      });

      await this.$ren.dataApi.getOptimizerTypes().then((optimizerTypes) => {
        console.info(optimizerTypes);
        this.optimizerTypes = optimizerTypes;
      });

      await this.fetchOptimizerParametersAndUpdateDropdowns();
      this.dialog = true;
    },
    async fetchOptimizerParametersAndUpdateDropdowns() {
      if (this.configuration.mvoComponentType.type === null || this.configuration.mvoComponentType.type === undefined) {
        this.configuration.mvoComponentType.domainsQuantity = 0;
        this.configuration.mvoComponentType.domainA = null;
        this.configuration.mvoComponentType.domainB = null;
        this.configuration.mvoComponentType.domainAReadableConnection = "";
        this.configuration.mvoComponentType.domainBReadableConnection = "";
      } else {
        var optimizer = this.optimizerTypes.filter((x) => x.name === this.configuration.mvoComponentType.type);
        if (optimizer.length > 0) {
          this.configuration.mvoComponentType.domainsQuantity = optimizer[0].domainsQuantity;
          this.configuration.mvoComponentType.domainAReadableConnection = optimizer[0].domainAReadableConnection;
          this.configuration.mvoComponentType.domainBReadableConnection = optimizer[0].domainBReadableConnection;
          if (optimizer[0].domainsQuantity == null || optimizer[0].domainsQuantity === 0) {
            this.configuration.mvoComponentType.domainA = null;
            this.configuration.mvoComponentType.domainAReadableConnection = "";
          } else if (optimizer[0].domainsQuantity === 1) {
            this.configuration.mvoComponentType.domainB = null;
            this.configuration.mvoComponentType.domainBReadableConnection = "";
          }
        }
      }

      await this.$ren.dataApi.getOptimizerParameters(this.assetId, this.configuration.mvoComponentType.type).then((optimizerParameters) => {
        this.configuration.parametersAggregationConfiguration = optimizerParameters;
      });
    },
    addMAC() {
      this.configuration.measurementAggregation.push({
        id: this.viewKeysGeneration,
        measurements: [],
        outputs: [],
      });
      this.viewKeysGeneration += 1;
    },
    deleteMAC(index) {
      this.configuration.measurementAggregation.splice(index, 1);
    },
    onCellEditComplete(event) {
      let { data, newValue, field } = event;
      if (newValue !== null && newValue.trim().length > 0) {
        data[field] = newValue;
      } else {
        data[field] = null;
      }
    },
    async addMeasurement(item, i) {
      if (item.length === 0) {
        await this.$ren.dataApi.getMeasurementsFromConnectedAssets(this.assetId).then((measurements) => {
          this.measurementsData[i] = measurements;
        });
      }
      item.push(null);
    },
    async selectedMeasurement(measurementId, measurements, i) {
      if (measurements.length > 0 && this.measurementsOnlyContainsOneNonNull(measurements)) {
        await this.$ren.dataApi
          .getMeasurementsFromConnectedAssetsAndCompatibleWithSelectedMeasurement(this.assetId, measurementId)
          .then((measurements) => {
            this.measurementsData[i] = measurements;
          });
      }
    },
    measurementsOnlyContainsOneNonNull(measurements) {
      let notNullOne = false;
      for (const val of measurements) {
        if (val !== null) {
          if (notNullOne) {
            return false;
          }
          notNullOne = true;
        }
      }
      return notNullOne;
    },
    deleteMeasurement(indexMA, index) {
      this.configuration.measurementAggregation[indexMA].measurements.splice(index, 1);
    },
    addOutput(item) {
      item.push({ aggregationType: null, timeMin: "", timeMax: "", timeRange: "", id: this.viewKeysGeneration });
      this.viewKeysGeneration += 1;
    },
    deleteOutput(indexMA, index) {
      this.configuration.measurementAggregation[indexMA].outputs.splice(index, 1);
    },
    async submit() {
      await this.$ren.dataApi.saveMeasurementAggregation(this.assetId, this.configuration).then((config) => {
        this.$emitter.emit("success", { title: "Configuration saved" });
        this.configuration = config;
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
<style>
.bg-highlight {
  background-color: rgba(0, 191, 83, 0.15) !important;
}
</style>
