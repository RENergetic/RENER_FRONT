<template>
  <div class="flex flex-column justify-content-center" style="height: 100%">
    <!-- <div style="display: flex; flex-direction: column; align-items: flex-end"> -->
    <div class="flex flex-none flex-column justify-content-center">
      <h2 style="text-align: center">{{ settings.tile.label }}</h2>
      <!-- v-if="legend"-->
    </div>
    <!-- <div style="position: relative; display: inline-block; width: 100%; flex-grow: 1"> -->
    <div class="flex flex-grow-1 flex-column align-items-center justify-content-center" style="position: relative; height: 100%">
      <div class="flex flex-none flex-column align-items-center justify-content-center">
        <MeasurementChart
          ref="chart"
          :filter="filter"
          :height="height"
          :width="width"
          :style="mStyle"
          :chart-type="chartType"
          :tile="tile"
          :asset-id="settings && settings.panel ? settings.panel.asset_id : null"
          :legend="settings && settings.tile ? settings.tile.legend : false"
          @timeseries-update="(timeseriesData) => $emit('timeseries-update', timeseriesData)"
        />
      </div>
    </div>
  </div>
</template>
<script>
import MeasurementChart from "@/components/dashboard/measurement/MeasurementChart.vue";
export default {
  name: "ChartTile",
  components: { MeasurementChart },
  props: {
    settings: { type: Object, default: () => ({}) },
    pdata: { type: Object, default: () => ({}) },
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
    async reload() {
      this.$refs.chart.reload();
    },
  },
};
</script>

<style lang="scss"></style>
