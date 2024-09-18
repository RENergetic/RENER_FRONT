<template>
  <div class="flex flex-column justify-content-center" style="height: 100%">
    <div class="flex flex-none flex-column justify-content-center">
      <h3 :style="`text-align: center;color:${tileTitleColor}`">{{ settings.tile.label }}</h3>
    </div>
    <!-- <div style="position: relative; display: inline-block; width: 100%; flex-grow: 1"> -->
    <div class="flex flex-grow-1 flex-column align-items-center justify-content-center" style="position: relative; height: 100%">
      <div class="flex flex-none flex-column align-items-center justify-content-center" style="height: 85%">
        <MeasurementChart
          ref="chart"
          :pdata="pdata"
          :filter="filter"
          :height="height"
          :width="width"
          :style="mStyle"
          :chart-type="chartType"
          :tile="tile"
          :compare-previous="mSettings.tile.compare_with_previous"
          :asset-id="settings && settings.panel ? settings.panel.asset_id : null"
          :legend="legend"
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
      default: () => ({}),
    },
  },
  emits: ["timeseries-update"],
  data() {
    return {
      mSettings: this.settings,
      datasets: [],
      mStyle: "max-width: 100rem;max-height:60rem; margin: auto;height:100%;width:100%",
      width: this.settings.panel.cellWidth * this.tile.layout.w * 0.95,
      height: this.settings.panel.cellHeight * this.tile.layout.h * 0.75,
    };
  },
  computed: {
    legend: function () {
      return this.settings && this.settings.tile && this.settings.tile.legend != null ? this.settings.tile.legend : this.tile.measurements.length > 1;
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
  },
  methods: {
    async reload() {
      this.$refs.chart.reload();
    },
  },
};
</script>
