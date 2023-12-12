<template>
  <RenSpinner ref="spinner" :lock="true">
    <template #content>
      <!-- {{ measurements }} -->
      <!-- {{ mMeasurements.length }} -->
      <!-- {{ annotations }} -->
      <Chart
        v-if="!titleVisible && height && width"
        :style="mStyle"
        :type="chartType"
        :data="chartData"
        :options="options"
        :height="height"
        :width="width"
      />
      <div v-if="titleVisible" class="flex flex-none flex-column justify-content-center" style="max-width: 75%">
        <h3>{{ title }}</h3>
        <!-- v-if="legend"-->
      </div>
      <!-- <div style="position: relative; display: inline-block; width: 100%; flex-grow: 1"> -->
      <div
        v-if="titleVisible"
        class="flex flex-grow-1 flex-column align-items-center justify-content-center"
        style="position: relative; height: 100%; width: 100%"
      >
        <div class="flex flex-none flex-column align-items-center justify-content-center" style="height: 85%; width: 100%">
          <Chart v-if="height && width" :style="mStyle" :type="chartType" :data="chartData" :options="options" :height="height" :width="width" />
        </div>
      </div>
    </template>
  </RenSpinner>
</template>
<script>
import Chart from "primevue/chart";
import chartjsMoment from "chartjs-adapter-moment";
import chartjsPluginAnnotation from "chartjs-plugin-annotation";
export default {
  name: "MeasurementChart",
  components: { Chart },
  props: {
    pData: { type: Object, default: () => ({}) },
    measurements: { type: Array, default: null },
    tile: { type: Object, default: null },
    width: { type: Number, default: 1600 },
    height: { type: Number, default: 900 },
    chartType: { type: String, default: "scatter" },
    legend: { type: Boolean, default: false },
    assetId: { type: String, default: null },
    immediate: { type: Boolean, default: true },
    titleVisible: { type: Boolean, default: false },
    // loadData: { type: Boolean, default: true },
    annotations: {
      type: [Object, Array],
      default: () => {
        return {};
      },
    },
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
      console.error("TODO: convert timeseries unit");
      let unit = mMeasurements[0].type.unit != "any" ? ` [${mMeasurements[0].type.unit}]` : "";
      yAxisTitle = `${this.$t("enums.physical_type." + mMeasurements[0].type.physical_name)}${unit}`;
    }
    return {
      labels: this.pData["timeseries_labels"] ? this.pData["timeseries_labels"] : [],
      datasets: [],
      plugins: [chartjsMoment, chartjsPluginAnnotation],
      mStyle: "max-width: 100rem;max-height:60rem; margin: auto;height:100%;width:100%",
      mMeasurements: mMeasurements,
      yAxisTitle: yAxisTitle,
    };
  },
  computed: {
    title: function () {
      if (this.titleVisible) {
        // let label = " ";
        var _l = this.mMeasurements.map((m) => {
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
      let annotations = this.annotations;
      console.info(annotations);

      let position = this.mMeasurements.length > 4 ? "top" : "chartArea";
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          annotation: {
            annotations: annotations,
          },
          legend: {
            maxHeight: 100,
            // position: "chartArea",
            position: position,
            align: "start",
            display: this.legend,
            fullSize: false,
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
    pData: {
      handler: async function (newV) {
        if (newV != null && !this.immediate) {
          this.setLocalData();
        }
      },

      deep: true,
    },
  },
  async mounted() {
    if (this.immediate) await this.reload();
    else {
      this.setLocalData();
    }
  },
  methods: {
    localData() {
      let hasAllData = false;
      if (this.pData["timeseries"] && this.pData["timeseries"]["current"]) {
        hasAllData = true;
        this.mMeasurements.forEach((m) => {
          hasAllData &=
            this.pData["timeseries"]["current"][m.id] &&
            this.pData["timeseries"]["current"][m.id].length == this.pData["timeseries"]["timestamps"].length;
        });
      }
      console.info(hasAllData);
      if (hasAllData) {
        this.labels = this.pData["timeseries"]["timestamps"];
        return this.pData["timeseries"]["current"];
      }
      return null;
    },

    async loadTimeseriesData() {
      //TODO: make it comgigurable in tile / args prediction & aggregation func
      // let data = this.tile.measurements.map((m) => this.pData.current[m.aggregation_function][m.id]);
      // let measurementIds = this.tile.measurements.map((m) => m.id);
      let data = this.localData();
      if (data == null) {
        let timeseriesData;
        if (this.tile) timeseriesData = await this.$ren.dataApi.getTimeseries(null, this.tile.id, this.assetId, this.filter);
        if (this.mMeasurements) {
          timeseriesData = await this.$ren.dataApi.getMeasurementTimeseries(this.mMeasurements, this.filter);
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
        let color = this.$ren.utils.measurementColor(m).color;
        console.error("TODO: convert timeseries unit");
        let aggFunc = this.$t("enums.measurement_aggregation." + m.aggregation_function);

        let unitLabel = m.type.unit != "any" ? `: ${this.$t("enums.physical_type." + m.type.physical_name)} [${m.type.unit}]` : "";
        let label = m.label ? m.label : m.name;
        datasets.push({
          data: data[m.id],
          label: `${label}(${aggFunc})${unitLabel}`,
          // label: `${label}(${m.id}) ${unitLabel}`,
          backgroundColor: color + "30",
          borderColor: color + "FF",
          showLine: true,
          fill: m.measurement_details && m.measurement_details["fill_chart"] != null ? m.measurement_details["fill_chart"] : true,
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
        var pData = await this.loadTimeseriesData();
        this.setDataset(pData);
        this.loaded = true;
        this.refreshDate = new Date();
      });
    },
    setLocalData() {
      var pData = this.localData();
      if (pData !== null) {
        this.setDataset(pData);
        this.loaded = true;
        this.refreshDate = null;
      }
    },
  },
};
</script>

<style lang="scss"></style>
