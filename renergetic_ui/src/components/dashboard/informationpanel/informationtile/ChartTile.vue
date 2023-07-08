<template>
  <!-- {{ tile }} -->
  <!-- {{ settings.panel }} -->
  <!-- {{ filter }} -->
  <div class="flex flex-column justify-content-center" style="height: 100%">
    <!-- <div style="display: flex; flex-direction: column; align-items: flex-end"> -->
    <div class="flex flex-none flex-column justify-content-center">
      <h2 style="text-align: center">{{ settings.tile.label }}</h2>
      <!-- v-if="legend"-->
    </div>
    <!-- <div style="position: relative; display: inline-block; width: 100%; flex-grow: 1"> -->
    <div class="flex flex-grow-1 flex-column align-items-center justify-content-center" style="position: relative; height: 100%">
      <div class="flex flex-none flex-column align-items-center justify-content-center">
        <RenSpinner ref="spinner" :lock="true">
          <template #content>
            <Chart v-if="height && width" :style="mStyle" :type="chartType" :data="chartData" :options="options" :height="height" :width="width" />
          </template>
        </RenSpinner>
      </div>
    </div>
  </div>
</template>
<script>
import Chart from "primevue/chart";
import chartjsMoment from "chartjs-adapter-moment";
export default {
  name: "ChartTile",
  components: { Chart },
  props: {
    settings: { type: Object, default: () => ({}) },
    pdata: { type: Object, default: () => ({}) },
    // chartType: { type: String, default: "line" },
    tile: {
      type: Object,
      default: () => ({}),
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
    return {
      labels: this.pdata["timeseries_labels"] ? this.pdata["timeseries_labels"] : [],
      datasets: [],
      plugins: [chartjsMoment],
      mStyle: "max-width: 100rem;max-height:60rem; margin: auto;height:100%;width:100%",
      width: this.settings.panel.cellWidth * this.tile.layout.w * 0.95,
      height: this.settings.panel.cellHeight * this.tile.layout.h * 0.75,
    };
  },
  computed: {
    options: function () {
      // var _this = this;
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: this.settings.tile.legend,
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
    chartType: function () {
      return this.settings.tile.chartType ? this.settings.tile.chartType : "scatter";
    },
    chartData: function () {
      return {
        labels: this.labels,
        datasets: this.datasets,
      };
    },
  },
  watch: {
    settings: {
      handler: function (newValue) {
        this.width = newValue.panel.cellWidth * this.tile.layout.w * 0.95;
        this.height = newValue.panel.cellHeight * this.tile.layout.h * 0.75;
      },
      deep: true,
    },
    filter: {
      handler: async function () {
        await this.reload();
      },
      deep: true,
    },
  },
  async mounted() {
    await this.reload();
    // this.mStyle = `max-width: 100rem; margin: auto;width:${this.width}px;` + `max-height: 60rem; margin: auto;height:${this.height}px`;
  },
  methods: {
    async loadData() {
      //TODO: make it comgigurable in tile / args prediction & aggregation func
      // let data = this.tile.measurements.map((m) => this.pdata.current[m.aggregation_function][m.id]);
      // let measurementIds = this.tile.measurements.map((m) => m.id);
      let datasets = [];
      let hasAllData = false;
      if (this.pdata["timeseries"]) {
        hasAllData = true;
        this.tile.measurements.forEach((m) => {
          hasAllData &= this.pdata["timeseries"][m.id];
        });
        // check if all measurements are in pdata , if not load all for the tile and emit to the parent
        console.info(hasAllData);
      }
      let data;
      if (!hasAllData) {
        let timeseriesData = await this.$ren.dataApi.getTimeseries(null, this.tile.id, this.settings.panel.asset_id, this.filter);

        this.labels = timeseriesData["timestamps"];
        data = timeseriesData["current"];
        if (timeseriesData) {
          this.$emit("timeseries-update", timeseriesData);
        }
      } else {
        data = this.pdata["timeseries"]["current"];
      }
      for (let idx in this.tile.measurements) {
        let m = this.tile.measurements[idx];
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
        await this.loadData();
        this.loaded = true;
        this.refreshDate = new Date();
      });
    },
  },
};
</script>

<style lang="scss"></style>
