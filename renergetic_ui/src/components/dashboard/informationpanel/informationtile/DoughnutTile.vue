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

  mounted() {},
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
  height: 35%;
  width: 30%;
  left: 35%;
  top: 40%;
}
</style>
