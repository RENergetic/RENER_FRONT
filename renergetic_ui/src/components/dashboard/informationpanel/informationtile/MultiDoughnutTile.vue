<template>
  <!-- TODO: 
   #########################
   #########################
   #########################
   #########################
   #########################
   Currently not supported
   #########################
   #########################
   #########################
   #########################
   #########################  
  -->
  <Chart style="max-width: 20rem" type="doughnut" :data="chartData" :options="options" />
</template>
<script>
import Chart from "primevue/chart";
export default {
  name: "MultiDoughnutTile",
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
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: this.settings.tile.legend ? this.settings.tile.legend : false,
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
      let data;
      let labels;
      // let data = this.tile.measurements.map((m) => this.pdata[m.id]);
      //TODO: make it comgigurable in tile / args prediction & aggregation func
      if (this.mSettings.tile.group_by_asset || this.mSettings.tile.group_by_domain) {
        let groupedValues = this.$ren.utils.groupValues(this.tile.measurements, this.pdata, this.mSettings);
        data = Object.values(groupedValues).map((g) => g.value);
        labels = Object.values(groupedValues).map((g) => g.label);
      } else {
        data = this.tile.measurements.map((m) => this.pdata.current[m.aggregation_function][m.id]);
        labels = this.tile.measurements.map((m) => (m.label ? m.label : m.name));
      }

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
