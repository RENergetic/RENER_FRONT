<template>
  <RenSpinner ref="spinner" :lock="true">
    <template #content>
      <!-- {{ annotations }} -->
      <!-- <div style="max-width: 20rem; overflow: hidden; max-height: 15rem">{{ chartData }}</div> -->
      <!-- {{ pdata["timeseries_labels"] }} -->
      <!-- {{ width }} -->
      <!-- {{ options }}  
      {{ chartData }} -->
      <Chart
        v-if="!titleVisible && height && width && loaded"
        :style="mStyle"
        :type="chartType"
        :data="chartData"
        :options="options"
        :height="height"
        :width="width"
      />
      <!-- :key="chartData" -->
      <div v-if="titleVisible" class="flex flex-none flex-column justify-content-center" style="max-width: 75%">
        <h3>{{ mTitle }}</h3>
      </div>
      <div
        v-if="titleVisible"
        class="flex flex-grow-1 flex-column align-items-center justify-content-center"
        style="position: relative; height: 100%; width: 100%"
      >
        <div
          v-if="height && width && loaded"
          class="flex flex-none flex-column align-items-center justify-content-center"
          style="height: 85%; width: 100%"
        >
          <Chart :style="mStyle" :type="chartType" :data="chartData" :options="options" :height="height" :width="width" />
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
    pdata: { type: Object, default: () => ({}) },
    measurements: { type: Array, default: null },
    tile: { type: Object, default: null },
    width: { type: Number, default: 1600 },
    height: { type: Number, default: 900 },
    chartType: { type: String, default: "scatter" },
    legendLabelColor: { type: String, default: "#495057" },
    legend: { type: Boolean, default: false },
    assetId: { type: String, default: null },
    immediate: { type: Boolean, default: true }, //immediately reload data if not present locally
    titleVisible: { type: Boolean, default: false },
    title: { type: String, default: null },
    comparePrevious: { type: Boolean, default: null },
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
      let unit = mMeasurements[0].type.unit != "any" ? ` [${mMeasurements[0].type.unit}]` : "";
      yAxisTitle = `${this.$t("enums.physical_type." + mMeasurements[0].type.physical_name)}${unit}`;
    }
    var mPrevious = this.tile ? this.tile.props.compare_with_previous : this.comparePrevious;
    return {
      labels: this.pdata["timeseries"] && this.pdata["timeseries"]["timestamps"] ? this.pdata["timeseries"]["timestamps"] : [],
      previousLabels: [],
      datasets: [],
      loaded: false,
      plugins: [chartjsMoment, chartjsPluginAnnotation],
      mStyle: "max-width: 100rem;max-height:60rem; margin: auto;height:100%;width:100%",
      mMeasurements: mMeasurements,
      mPrevious: mPrevious != null ? mPrevious : false,
      yAxisTitle: yAxisTitle,
    };
  },
  computed: {
    mTitle: function () {
      if (this.titleVisible) {
        // let label = " ";
        if (this.title) {
          return this.title;
        }
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
      // console.info(annotations);
      let position = this.mMeasurements.length > 4 || this.mPrevious ? "bottom" /*top*/ : "chartArea";
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
              color: this.legendLabelColor,
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
          // type: "timeseries", //keep Equidistant  between points (labels are squished)
          x: { type: "time" },
          x_prev: { display: this.mPrevious, position: "top", type: "time", labels: this.previousLabels },
          y: {
            title: { display: this.yAxisTitle != null, text: this.yAxisTitle },
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
    pdata: {
      handler: async function (newV) {
        if (newV != null && !this.immediate) {
          await this.setLocalData();
        }
      },

      deep: true,
    },
  },
  async mounted() {
    if (this.immediate) await this.reload();
    else {
      await this.setLocalData();
    }
  },
  methods: {
    localData() {
      let hasAllData = false;
      if (this.pdata["timeseries"] && this.pdata["timeseries"]["current"]) {
        hasAllData = true;
        this.mMeasurements.forEach((m) => {
          //all data should have the same amount of points
          hasAllData &=
            this.pdata["timeseries"]["current"][m.id] &&
            this.pdata["timeseries"]["current"][m.id].length == this.pdata["timeseries"]["timestamps"].length;
        });
      }
      console.debug(`has all data ${hasAllData}`);
      if (hasAllData) {
        this.labels = this.pdata["timeseries"]["timestamps"];

        let mData = this.pdata["timeseries"]["current"];
        console.error("TODO: load previous data - check if everything is available ");
        if (this.mPrevious) {
          mData.previous = this.pdata.previous["timeseries"]["current"];
          mData.previousLabels = this.pdata.previous["timeseries"]["timestamps"];
          this.previousLabels = mData.previousLabels;
        }
        return mData;
      }
      return null;
    },

    async loadTimeseriesData() {
      //TODO: make it comgigurable in tile / args prediction & aggregation func
      // let data = this.tile.measurements.map((m) => this.pdata.current[m.aggregation_function][m.id]);
      // let measurementIds = this.tile.measurements.map((m) => m.id);
      let data = this.localData();
      var getPrevious = false;
      if (data == null) {
        //if previous ==null
        console.error("TODO: load previous data - check if everything is available ");

        let timeseriesData;

        if (this.tile) {
          if (this.tile.props.compare_with_previous && this.tile.props.compare_with_previous_filter_obj) {
            getPrevious = true;
          }
          timeseriesData = await this.$ren.dataApi.getTimeseries(null, this.tile.id, this.assetId, this.filter);
          if (getPrevious) {
            timeseriesData.previous = await this.$ren.dataApi.getTimeseries(
              null,
              this.tile.id,
              this.assetId,
              this.tile.props.compare_with_previous_filter_obj,
            );
          }
        } else if (this.mMeasurements) {
          timeseriesData = await this.$ren.dataApi.getMeasurementTimeseries(this.mMeasurements, this.filter);
          if (getPrevious) {
            timeseriesData.previous = await this.$ren.dataApi.getMeasurementTimeseries(
              this.mMeasurements,
              this.tile.props.compare_with_previous_filter_obj,
            );
          }
        }

        this.labels = timeseriesData["timestamps"];
        data = timeseriesData["current"];
        if (getPrevious && timeseriesData.previous) data.previous = timeseriesData.previous["current"];
        if (timeseriesData) {
          this.$emit("timeseries-update", timeseriesData);
        }
      }
      console.info(this.mPrevious);
      console.info(getPrevious);
      console.info(data);
      return data;
    },
    setDataset(data) {
      let datasets = [];
      for (let idx in this.mMeasurements) {
        let m = this.mMeasurements[idx];
        let color = this.$ren.utils.measurementColor(m).color;
        let aggFunc = this.$t("enums.measurement_aggregation." + m.aggregation_function);

        let unitLabel = m.type.unit != "any" ? `: ${this.$t("enums.physical_type." + m.type.physical_name)} [${m.type.unit}]` : "";
        let label = this.measurementLabel(m);
        let mfill = m.measurement_details && m.measurement_details["fill_chart"] != null ? m.measurement_details["fill_chart"] : "true";
        let fill = mfill?.toLowerCase?.() === "true";
        datasets.push({
          xAxisID: "x",
          data: data[m.id],
          label: `${label}(${aggFunc})${unitLabel}`,
          // label: `${label}(${m.id}) ${unitLabel}`,
          backgroundColor: color + "30",
          borderColor: color + "FF",
          showLine: true,
          fill: fill,
        });
        console.debug(this.mPrevious);
        console.debug(data);
        console.debug(this.pdata);
        if (this.mPrevious)
          datasets.push({
            xAxisID: "x_prev",
            data: data.previous[m.id],
            label: `${label}(${aggFunc})${unitLabel} -  ${this.dateFilterToString(this.tile.props.compare_with_previous_filter_obj)}`,
            labels: data.previousLabels,
            // label: `${label}(${m.id}) ${unitLabel}`,
            backgroundColor: color + "00",
            borderColor: color + "AA",
            showLine: true,
            fill: fill,
          });
      }
      // console.error(datasets);
      this.datasets = datasets;
    },
    async reload() {
      console.debug("chart reload: " + this.mMeasurements[0].id);
      let run = this.$refs.spinner.run;
      await run(async () => {
        // await new Promise((r) => setTimeout(r, 250));
        var pdata = await this.loadTimeseriesData();
        console.debug(pdata);
        this.setDataset(pdata);
        this.loaded = true;
        this.refreshDate = new Date();
      });
    },
    async setLocalData() {
      var pdata = await this.localData();
      //TODO:

      if (pdata !== null) {
        //temporary

        this.setDataset(pdata);
        this.loaded = true;
        this.refreshDate = null;
      }
    },
  },
};
</script>

<style lang="scss"></style>
