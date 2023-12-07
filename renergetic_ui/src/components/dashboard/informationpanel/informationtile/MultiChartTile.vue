<template>
  <!-- TODO: -->
  <!-- there might be no difference with ChartTile - so we can remove this one -->
  <Chart style="max-width: 20rem" type="doughnut" :data="chartData" :options="options" />
</template>
<script>
import Chart from "primevue/chart";
export default {
  name: "DoughnutTile",
  components: { Chart },
  props: {
    legend: { type: Boolean, default: true },
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
            display: this.legend,
            labels: {
              color: "#495057",
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
      let labels = this.tile.measurements.map((m) => (m.label ? m.label : m.name));

      // let data = this.tile.measurements.map((m) => this.pdata[m.id]);
      //TODO: make it comgigurable in tile / args prediction & aggregation func
      let data = this.tile.measurements.map((m) => this.pdata.current[m.aggregation_function][m.id]);

      // console.info(this.tile.measurements);
      let backgroundColor = this.tile.measurements.map((m) => (m.measurement_details.color ? m.measurement_details.color : "#90A4AE"));

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

<style lang="scss"></style>
