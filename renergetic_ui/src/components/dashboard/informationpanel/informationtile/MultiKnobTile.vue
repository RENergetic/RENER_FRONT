<template>
  <div v-if="loaded" class="flex flex-column justify-content-center" style="height: 100%; width: 100%">
    <!-- <div style="display: flex; flex-direction: column; align-items: flex-end"> -->
    <div class="flex flex-none flex-column justify-content-center">
      <h2 style="text-align: center">{{ mSettings.tile.label }}</h2>
      <!-- v-if="legend"-->
    </div>
    <!-- {{ pdata }} -->
    <!-- {{ chartData }} -->
    <!-- <div style="position: relative; display: inline-block; width: 100%; flex-grow: 1"> -->
    <div class="flex flex-grow-0 flex-column align-items-center justify-content-center" style="height: 100%; width: 100%">
      <div class="flex flex-grow-0 flex-column align-items-center justify-content-center">
        <Chart :style="mStyle" type="doughnut" :data="chartData" :options="options" />
      </div>
      <span
        v-if="mSettings.tile.icon_visibility && mSettings.tile.icon"
        id="tileicon"
        :style="iconSize"
        class="flex flex-none flex-column align-items-center justify-content-center"
      >
        <font-awesome-icon :icon="mSettings.tile.icon" />
      </span>
    </div>
    <!-- {{ conversionSettings }} -->
    <div v-if="mSettings.tile.measurement_list" class="flex flex-column flex-grow-1 knob-component" style="position: relative; width: 100%">
      <information-list-tile
        :tile="tile"
        :pdata="pdata"
        :settings="mSettings"
        :conversion-settings="conversionSettings"
        @select="onMeasurementSelect"
      >
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
    conversionSettings: { type: Object, default: () => ({}) },
    pdata: { type: Object, default: () => ({}) },
    tile: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    var _this = this;
    return {
      mStyle: "width: 30rem; margin: auto;max-width: 100%;max-height:100%",
      iconSize: `height: 10%;  width: 10%;`,
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
                if (_this.tile.measurements[context.datasetIndex] === undefined) {
                  return "";
                }
                var id = _this.tile.measurements[context.datasetIndex].id;
                var aggregation_function = _this.tile.measurements[context.datasetIndex].aggregation_function;
                var value;
                try {
                  if (_this.mSettings.panel.relativeValues) {
                    value = context.formattedValue;
                  } else {
                    value = `${_this.pdata.current[aggregation_function][id]}`;
                    // console.error(_this.pdata.current[aggregation_function][id]);
                  }
                } catch {
                  value = context.formattedValue;
                }
                value = _this.$ren.utils.roundValue(value);
                // console.error(_this.pdata.current[aggregation_function][id]);
                if (context.chart.data.labels[labelIndex]) return context.chart.data.labels[labelIndex] + ": " + value;
                try {
                  return context.chart.data.labels[labelIndex - 1] + ": " + value;
                } catch {
                  return value;
                }
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
      // console.info(this.pdata);
      // if (!this.mSettings.panel.relativeValues) {
      //   // console.info("use relative values");
      //   // let data = this.tile.measurements.map((m) => this.pdata[m.id]);
      //   //TODO: make it comgigurable in tile / args prediction & aggregation func
      //   // data = this.tile.measurements.map((m) => this.pdata.current[m.aggregation_function][m.id]);
      //   // let total = data.reduce((partialSum, a) => partialSum + a, 0);
      //   // data = data.map((v) => v / total);
      //   console.info(this.pdata);
      //   data = this.tile.measurements.map((m) =>
      //     m.type.base_unit != "%"
      //       ? this.pdata.current[m.aggregation_function][m.id] / this.pdata.max[m.aggregation_function][m.id]
      //       : this.pdata.current[m.aggregation_function][m.id],
      //   );
      // } else {
      //   // console.info("use no relative values");
      //   //todo include min offset
      //   // console.info(this.pdata.current);
      //   data = this.tile.measurements.map((m) =>
      //     m.type.base_unit != "%"
      //       ? this.pdata.current[m.aggregation_function][m.id] / this.pdata.max[m.aggregation_function][m.id]
      //       : this.pdata.current[m.aggregation_function][m.id],
      //   );
      // }
      data = this.tile.measurements.map((m) => {
        let maxV =
          this.pdata.max && this.pdata.max[m.aggregation_function][m.id]
            ? this.pdata.max[m.aggregation_function][m.id]
            : this.pdata.current[m.aggregation_function][m.id];
        return m.type.base_unit != "%" ? this.pdata.current[m.aggregation_function][m.id] / maxV : this.pdata.current[m.aggregation_function][m.id];
      });
      console.info(this.pdata);
      console.info(data);
      let labels = []; // this.tile.measurements.map((m) => m.label);
      //todo remove labels ?
      for (let idx in this.tile.measurements) {
        labels.push(this.tile.measurements[idx].label);
        labels.push(""); //label for remaining doughnut part
      }
      // co jesli nie ma label
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
    // console.info(this.tile);
    // console.info(this.tile.layout.w);

    var size = this.mSettings.tile.measurement_list ? 0.5 : 0.75;
    this.mStyle = `max-width: 100%;max-height:100%;margin: auto;width:${this.mSettings.panel.cellWidth * this.tile.layout.w * size}px`;
    this.iconSize = this.mSettings.tile.measurement_list ? `height: 10%;  width: 10%;` : `height: 15%;  width: 15%;`;
    this.loaded = true;
  },
  methods: {
    onMeasurementSelect(ctx) {
      console.info(ctx);
    },
    getDataset(value, index) {
      let state = this.tile.measurements[index].visible == null ? true : this.tile.measurements[index].visible;

      // console.error(this.getColor(index));
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
        console.error(error);
        let c = ["rgba(255,0,0,1.0)", "rgba(255,0,0,0.25)", "rgba(0, 255,0,1.0)", "rgba(0, 255,0,0.25)", "rgba(0,0,255,1.0)", "rgba(0, 0,255,0.25)"];
        let idx = this.tmpIndex++ % 3;
        return [c[2 * idx], c[2 * idx + 1]];
      }
    },
  },
};
</script>

<style scoped lang="scss">
#tileicon {
  // background-size: contain;
  // background-repeat: no-repeat;
  // background-position: center;
  // left: 40%;
  // top: 40%;
  position: absolute;
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
.demand-box {
  .knob-component {
    margin-top: 0;
  }
}
</style>
