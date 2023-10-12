<template>
  <RenSpinner ref="spinner" :lock="true">
    <template #content>
      <!-- {{ measurements }} -->
      <h2>{{ title }}</h2>
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
    measurements: { type: Array, default: null },
    tile: { type: Object, default: null },
    width: { type: Number, default: 1600 },
    height: { type: Number, default: 900 },
    chartType: { type: String, default: "scatter" },
    legend: { type: Boolean, default: false },
    assetId: { type: String, default: null },
    immediate: { type: Boolean, default: true },
    titleVisible: { type: Boolean, default: false },
    filter: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  emits: ["timeseries-update"],
  data() {
    let mMeasurements = this.tile ? this.tile.measurements : this.measurements;
    let yAxisTitle = null;
    if (mMeasurements && mMeasurements.length == 1) {
      yAxisTitle = `${this.$t("enums.physical_type." + mMeasurements[0].type.physical_name)} [${mMeasurements[0].type.unit}]`;
    }
    return {
      labels: this.pdata["timeseries_labels"] ? this.pdata["timeseries_labels"] : [],
      datasets: [],
      plugins: [chartjsMoment],
      mStyle: "max-width: 100rem;max-height:60rem; margin: auto;height:100%;width:100%",
      mMeasurements: mMeasurements,
      yAxisTitle: yAxisTitle,
    };
  },
  computed: {
    title: function () {
      if (this.titleVisible) {
        // let label = " ";
        var _l = this.measurements.map((m) => {
          let measurementName = m.label ? m.label : m.name;
          if (m.asset) {
            let assetName = m.asset.label ? m.asset.label : m.asset.name;
            console.info(`${measurementName}(${assetName})`);
            return `${measurementName}(${assetName})`;
          }
          return `${measurementName}`;
        });
        // for (let m of this.measurements) {
        //   let assetName = m.asset.label ? m.asset.label : m.asset.name;

        //   let measurementName = m.label ? m.label : m.name;
        //   label += ` ${assetName}:${measurementName}`;
        // }
        return this.$t("view.measurement_chart_title", { label: _l.join(",") });
      }
      return "";
    },
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
          y: {
            title: {
              display: this.yAxisTitle != null,
              text: this.yAxisTitle,
            },
          },
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
      handler: async function (newV, oldV) {
        if ((newV != oldV && oldV == null) || this.immediate) {
          await this.reload();
        }
      },
      deep: true,
    },
  },
  async mounted() {
    if (this.immediate) await this.reload();
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
        let unitLabel = `${this.$t("enums.physical_type." + m.type.physical_name)} [${m.type.unit}]`;
        let label = m.label ? m.label : m.name;
        datasets.push({
          data: data[m.id],
          label: `${label}: ${unitLabel}`,
          // label: `${label}(${m.id}) ${unitLabel}`,
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
      console.info("chart reload: " + this.mMeasurements[0].id);
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
