<template>
  <div>
    <Chart type="doughnut" :data="chartData" :options="options" />
  </div>
</template>
<script>
import Chart from "primevue/chart";
export default {
  name: "DoughnutTile",
  components: { Chart },
  props: {
    pdata: { type: Object, default: () => ({}) },
    tile: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      options: {
        plugins: {
          legend: {
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
      let labels = this.tile.measurements.map((m) => m.label);

      let data = this.tile.measurements.map((m) => this.pdata[m.id]);
      return {
        labels: labels,
        //TODO: set colors
        datasets: [
          {
            data: data,
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
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
