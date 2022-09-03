<template>
  <h1 v-if="legend">{{ tile.label }}</h1>
  <div style="position: relative">
    <Chart style="max-width: 20rem" type="doughnut" :data="chartData" :options="options" />
    <span v-if="settings.icon" id="tileicon" :style="'background-image: url(' + settings.icon + ')'"></span>
  </div>
</template>
<script>
import Chart from "primevue/chart";
export default {
  name: "MultiKnobTile",
  components: { Chart },
  props: {
    // legend: { type: Boolean, default: true },
    settings: { type: Object, default: () => ({}) },
    pdata: { type: Object, default: () => ({}) },
    tile: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      relativeValues: false,
      tmpIndex: 0,
      options: {
        display: false,
        responsive: true,
        plugins: {
          legend: {
            display: false, //this.legend,
            labels: {
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
      let data = this.tile.measurements.map((m) => this.pdata.current.last[m.id]);
      if (!this.relativeValues) {
        let total = data.reduce((partialSum, a) => partialSum + a, 0);
        data = data.map((v) => v / total);
      }
      let labels = []; // this.tile.measurements.map((m) => m.label);
      //todo remove labels ?
      for (let idx in this.tile.measurements) {
        labels.push(this.tile.measurements[idx].label);
        labels.push(this.tile.measurements[idx].label);
      }
      let datasets = data.map((v) => this.getDataset(v));

      // let data = this.tile.measurements.map((m) => this.pdata[m.id]);
      //TODO: make it comgigurable in tile / args prediction & aggregation func

      // console.info(this.tile.measurements);
      // let backgroundColor = this.tile.measurements.map((m) =>
      //   m.measurement_details.color ? m.measurement_details.color : "#90A4AE",
      // );

      return {
        labels: labels,
        datasets: datasets,
      };
    },
  },

  mounted() {},
  methods: {
    getDataset(value) {
      return {
        data: [value, 1.0 - value],
        backgroundColor: this.getColor(),
      };
    },

    getColor() {
      let c = [
        "rgba(255,0,0,1.0)",
        "rgba(255,0,0,0.25)",
        "rgba(0, 255,0,1.0)",
        "rgba(0, 255,0,0.25)",
        "rgba(0,0,255,1.0)",
        "rgba(0, 0,255,0.25)",
      ];
      let idx = this.tmpIndex++ % 3;
      return [c[2 * idx], c[2 * idx + 1]];
    },
  },
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
  height: 30%;
  width: 30%;
  left: 35%;
  top: 35%;
}
</style>
