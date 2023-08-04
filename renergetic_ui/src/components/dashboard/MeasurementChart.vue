<template>
  <RenSpinner ref="spinner" :lock="true">
    <template #content>
      <Chart v-if="height && width" :style="mStyle" :type="chartType" :data="chartData" :options="options" :height="height" :width="width" />
    </template>
  </RenSpinner>
</template>
<script>
import Chart from "primevue/chart";
import chartjsMoment from "chartjs-adapter-moment";
export default {
  name: "MeasurementChart",
  components: { Chart },
  props: {
    pdata: { type: Object, default: () => ({}) },
    // chartType: { type: String, default: "line" },
    measurements: { type: Array, default: null },
    tile: { type: Object, default: null },
    width: { type: Number, default: 1600 },
    height: { type: Number, default: 900 },
    chartType: { type: String, default: "scatter" },
    legend: { type: Boolean, default: false },
    assetId: { type: String, default: null },
    filter: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  emits: ["timeseries-update"],
  data() {
    return {
      labels: this.pdata["timeseries_labels"] ? this.pdata["timeseries_labels"] : [],
      datasets: [],
      plugins: [chartjsMoment],
      mStyle: "max-width: 100rem;max-height:60rem; margin: auto;height:100%;width:100%",
      mMeasurements: this.tile ? this.tile.measurements : this.measurements,
    };
  },
  computed: {
    options: function () {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: this.legend,
            labels: {
              color: "#495057",
            },
          },
        },
        elements: { point: { radius: 1 }, line: { borderWidth: 1 } },
        tooltips: {
          // callbacks: {
          //   label: function (context, data) {
          //     let dataset = data.datasets[context.datasetIndex]; //#['data'][context.index]
          //     let value = dataset.data[context.index];
          //     return "";
          //   },
          // },
        },
        scales: {
          x: {
            // type: "timeseries", //keep Equidistant  between points (labels are squished)
            type: "time",
          },
          // y: {
          //   fill: true,
          // },
        },
      };
    },

    chartData: function () {
      return {
        labels: this.labels,
        datasets: this.datasets,
      };
    },
  },
  watch: {
    filter: {
      handler: async function () {
        await this.reload();
      },
      deep: true,
    },
  },
  async mounted() {
    await this.reload();
  },
  methods: {
    localData() {
      let hasAllData = false;
      if (this.pdata["timeseries"] && this.pdata["timeseries"]["current"]) {
        hasAllData = true;
        this.tile.measurements.forEach((m) => {
          hasAllData &= this.pdata["timeseries"]["current"][m.id];
        });
      }
      if (hasAllData) {
        return this.pdata["timeseries"]["current"];
      }
      return null;
    },

    async loadData() {
      //TODO: make it comgigurable in tile / args prediction & aggregation func
      // let data = this.tile.measurements.map((m) => this.pdata.current[m.aggregation_function][m.id]);
      // let measurementIds = this.tile.measurements.map((m) => m.id);
      let data = this.localData();
      if (data == null) {
        let timeseriesData;
        if (this.tile) timeseriesData = await this.$ren.dataApi.getTimeseries(null, this.tile.id, this.assetId, this.filter);
        if (this.measurements) {
          timeseriesData = await this.$ren.dataApi.getMeasurementTimeseries(this.measurements, this.filter);
        }
        this.labels = timeseriesData["timestamps"];
        data = timeseriesData["current"];
        if (timeseriesData) {
          this.$emit("timeseries-update", timeseriesData);
        }
      }
      return data;
    },
    setDataset(data) {
      let datasets = [];
      for (let idx in this.mMeasurements) {
        let m = this.mMeasurements[idx];
        let color = m.measurement_details.color ? m.measurement_details.color : "#90A4AE";
        datasets.push({
          data: data[m.id],
          label: `label_${m.id}`,
          backgroundColor: color + "30",
          borderColor: color + "FF",
          showLine: true,
          fill: true,
        });
      }
      // console.error(datasets);
      this.datasets = datasets;
    },
    async reload() {
      let run = this.$refs.spinner.run;
      await run(async () => {
        // await new Promise((r) => setTimeout(r, 250));
        var pData = await this.loadData();
        this.setDataset(pData);
        this.loaded = true;
        this.refreshDate = new Date();
      });
    },
  },
};
</script>

<style lang="scss"></style>
