<template>
  <!-- <div style="display: flex; flex-direction: column; align-items: flex-end"> -->
  <div v-if="loaded" class="flex flex-column justify-content-start" style="height: 100%">
    <div
      v-if="mSettings.tile.title_visibility"
      class="flex flex-none align-items-center justify-content-center knob-component"
    >
      <h2 style="text-align: center">{{ tile.label }}</h2>
    </div>

    <!-- <div style="position: relative; display: inline-block; width: 100%; flex-grow: 1">
    
      <Chart :style="mStyle" type="doughnut" :data="chartData" :options="options" />
      <span v-if="settings.icon" id="tileicon" :style="'background-image: url(' + settings.icon + ')'"></span>
    </div> -->
    <div
      class="flex flex-none flex-column align-items-center justify-content-center knob-component"
      style="position: relative"
    >
      <div class="flex flex-none flex-column align-items-center justify-content-center">
        <Chart :style="mStyle" type="doughnut" :data="chartData" :options="options" />
      </div>
      <span
        v-if="iconVisibility"
        id="tileicon"
        class="flex flex-none flex-column align-items-center justify-content-center"
      >
        <font-awesome-icon :icon="mSettings.tile.icon" />
      </span>
    </div>
    <div class="flex flex-column flex-none knob-component" style="position: relative; width: 100%">
      <information-list-tile :tile="tile" :pdata="pdata" :settings="mSettings" @select="onMeasurementSelect">
      </information-list-tile>
    </div>
  </div>
</template>
<script>
import Chart from "primevue/chart";
import InformationListTile from "./InformationListTile.vue";
export default {
  name: "MultiKnobTile",
  components: { Chart, InformationListTile },
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
      mStyle: "max-width: 30rem; margin: auto",
      relativeValues: false,
      mSettings: this.settings,
      tmpIndex: 0,
      loaded: false,
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
    iconVisibility: function () {
      return (this.mSettings.tile ? this.mSettings.tile.icon_visibility : true) && this.mSettings.tile.icon;
    },
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
      let datasets = data.map((v, index) => this.getDataset(v, index));

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
  mounted() {
    this.loaded = true;
    this.mStyle = `max-width: 30rem; margin: auto;width:${this.mSettings.panel.cellWidth * this.tile.layout.w * 0.6}px`;
  },
  methods: {
    onMeasurementSelect(ctx) {
      console.info(ctx);
    },
    getDataset(value, index) {
      let state = this.tile.measurements[index].visible == null ? true : this.tile.measurements[index].visible;

      return {
        data: [value, 1.0 - value],
        backgroundColor: this.getColor(index),
        hidden: !state,
      };
    },

    getColor(index) {
      try {
        return this.$ren.utils.measurementChartColors(this.tile.measurements[index]);
        // if (this.tile.measurements[index].type.color) {
        //   let color = this.tile.measurements[index].type.color;
        //   if (color.length == 7) {
        //     return [`#FF${color.slice(1)}`, `#40${color.slice(1)}`];
        //   }
        //   return [`#FF${color.slice(3)}`, `#40${color.slice(3)}`];
        // }
        // throw new Error();
      } catch (error) {
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
      }
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
  height: 20%;
  width: 20%;
  left: 40%;
  top: 40%;
  svg {
    height: 100%;
  }
}

h2 {
  margin-bottom: 0;
}
.knob-component {
  margin-top: 0.75rem;
}
</style>
