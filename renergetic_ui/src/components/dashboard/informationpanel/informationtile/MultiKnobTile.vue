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
/**
 * component to show multiple    measurements in a form of a percentage knob,
 *  summarized inside componen or outside (provided min,max values for each measurement )
 */
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
          tooltip: {
            callbacks: {
              label: function (context) {
                const labelIndex = context.datasetIndex * 2 + context.dataIndex;
                return context.chart.data.labels[labelIndex] + ": " + context.formattedValue;
              },
            },
          },
          legend: {
            display: false, //this.legend,
            // labels: {
            //   color: this.settings.color,
            // },
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

      let data = null;
      if (!this.mSettings.panel.relativeValues) {
        // let data = this.tile.measurements.map((m) => this.pdata[m.id]);
        //TODO: make it comgigurable in tile / args prediction & aggregation func
        data = this.tile.measurements.map((m) => this.pdata.current.last[m.id]);
        let total = data.reduce((partialSum, a) => partialSum + a, 0);
        data = data.map((v) => v / total);
      } else {
        //todo include min offset
        // console.info(this.pdata.current);
        data = this.tile.measurements.map((m) => this.pdata.current.last[m.id] / this.pdata.current.max[m.id]);
      }
      console.info(data);
      let labels = []; // this.tile.measurements.map((m) => m.label);
      //todo remove labels ?
      for (let idx in this.tile.measurements) {
        labels.push(this.tile.measurements[idx].label);
        labels.push(""); //label for remaining doughnut part
      }
      let datasets = data.map((v, index) => this.getDataset(v, index));

      // if (datasets.length <= 2) {
      //   datasets.push({ data: [0.0, 0.0] });
      //   labels.push("");
      //   labels.push("");
      // }
      if (datasets.length <= 1) {
        //todo: do all donuts (multiknob) components should have same amount of rings?
        datasets.push({ data: [0.0, 0.0] });
        labels.push("");
        labels.push("");
      }

      // console.info(this.tile.measurements);

      return {
        labels: labels,
        datasets: datasets,
      };
    },
  },
  mounted() {
    console.info(this.mSettings.panel);
    this.mStyle = `max-width: 30rem; margin: auto;width:${this.mSettings.panel.cellWidth * this.tile.layout.w * 0.6}px`;
    this.loaded = true;
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
        return this.$ren.utils.knobColors(this.tile.measurements[index]);
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
