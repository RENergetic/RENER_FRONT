<template>
  <!-- {{ tile }} -->
  <div class="flex flex-column justify-content-center" style="height: 100%">
    <!-- <div style="display: flex; flex-direction: column; align-items: flex-end"> -->
    <div class="flex flex-none flex-column justify-content-center">
      <h2 style="text-align: center">{{ mSettings.tile.label }}</h2>
      <!-- v-if="legend"-->
    </div>
    <!-- <div style="position: relative; display: inline-block; width: 100%; flex-grow: 1"> -->
    <div class="flex flex-grow-1 flex-column align-items-center justify-content-center" style="position: relative">
      <div class="flex flex-none flex-column align-items-center justify-content-center">
        <Chart :style="mStyle" type="doughnut" :data="chartData" :options="options" />
      </div>
      <span
        v-if="mSettings.tile.icon_visibility && mSettings.tile.icon"
        id="tileicon"
        class="flex flex-none flex-column align-items-center justify-content-center"
      >
        <font-awesome-icon :icon="mSettings.tile.icon" />
      </span>
    </div>
  </div>
</template>
<script>
import Chart from "primevue/chart";
export default {
  name: "DoughnutTile",
  components: { Chart },
  props: {
    settings: { type: Object, default: () => ({}) },
    pdata: { type: Object, default: () => ({}) },
    tile: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      mSettings: this.settings,
      mStyle: "max-width: 30rem; margin: auto",
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: this.settings.tile.legend,
            labels: {
              // color: "#495057",
              color: this.settings.tile.color,
            },
          },
        },
      },
    };
  },
  computed: {
    chartData: function () {
      if (!(this.pdata && this.pdata.current)) {
        return {};
      }
      let labels = this.tile.measurements.map((m) => m.label);

      // let data = this.tile.measurements.map((m) => this.pdata[m.id]);
      //TODO: make it comfigurable in tile / args prediction & aggregation func
      let data = null;
      let backgroundColor = this.tile.measurements.map((m) => (m.measurement_details.color ? m.measurement_details.color : "#90A4AE"));
      if (!this.mSettings.panel.relativeValues) {
        data = this.tile.measurements.map((m) => this.pdata.current[m.aggregation_function][m.id]);
      } else {
        //console.info("use relative values");
        //todo include min offset
        // console.info(this.pdata.current);
        data = this.tile.measurements.map((m) =>
          m.type.base_unit != "%"
            ? this.pdata.current[m.aggregation_function][m.id] / this.pdata.max[m.aggregation_function][m.id]
            : this.pdata.current[m.aggregation_function][m.id],
        );
        let sum = data.reduce((partialSum, a) => partialSum + a, 0);
        // console.info(1.0 - sum);
        // console.info(sum);
        data.push(1.0 - sum);
        backgroundColor.push(backgroundColor);
        labels.push("");
      }
      return {
        labels: labels,
        //TODO: set colors
        datasets: [
          {
            data: data,
            backgroundColor: backgroundColor,
          },
        ],
      };
    },
  },

  mounted() {
    this.mStyle = `max-width: 30rem; margin: auto;width:${this.settings.panel.cellWidth * this.tile.layout.w * 0.7}px`;
  },
  methods: {},
};
</script>

<style scoped lang="scss">
#tileicon {
  position: absolute;
  height: 20%;
  width: 20%;
  svg {
    height: 100%;
  }
}
</style>
