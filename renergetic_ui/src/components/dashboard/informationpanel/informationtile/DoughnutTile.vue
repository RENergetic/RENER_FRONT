<template>
  <div class="flex flex-column justify-content-center" style="height: 100%">
    <!-- <div style="display: flex; flex-direction: column; align-items: flex-end"> -->
    <div class="flex flex-none flex-column justify-content-center">
      <h2 style="text-align: center">{{ tile.label }}</h2>
      <!-- v-if="legend"-->
    </div>
    <!-- <div style="position: relative; display: inline-block; width: 100%; flex-grow: 1"> -->
    <div class="flex flex-grow-1 flex-column align-items-center justify-content-center" style="position: relative">
      <div class="flex flex-none flex-column align-items-center justify-content-center">
        <Chart :style="mStyle" type="doughnut" :data="chartData" :options="options" />
      </div>
      <span v-if="settings.icon" id="tileicon" :style="'background-image: url(' + settings.icon + ')'"></span>
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
      mStyle: "max-width: 30rem; margin: auto",
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: this.settings.legend,
            labels: {
              // color: "#495057",
              color: this.settings.color,
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
      let data = this.tile.measurements.map((m) => this.pdata.current.last[m.id]);

      // console.info(this.tile.measurements);
      let backgroundColor = this.tile.measurements.map((m) =>
        m.measurement_details.color ? m.measurement_details.color : "#90A4AE",
      );

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
    // this.settings.cellWidth
    // console.info(this.tile.layout.w + " " + this.settings.cellWidth);
    this.mStyle = `max-width: 30rem; margin: auto;width:${this.settings.cellWidth * this.tile.layout.w * 0.7}px`;
  },
  methods: {},
};
</script>

<style scoped lang="scss">
#tileicon {
  // width: 3rem;
  // height: 3rem;
  // display: inherit;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: absolute;
  height: 25%;
  width: 25%;
  left: 37.5%;
  top: 37.5%;
}
</style>
