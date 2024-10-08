<template>
  <div v-if="loaded" class="flex flex-column justify-content-center" style="height: 100%; width: 100%">
    <div class="flex flex-none flex-column justify-content-center">
      <h3 :style="`text-align: center;color:${tileTitleColor}`">{{ mSettings.tile.label }}</h3>
      <!-- v-if="legend"-->
    </div>
    <!-- {{ chartData }} -->
    <!-- style="height: 100%; width: 100%" -->
    <div class="flex flex-grow-0 flex-column align-items-center justify-content-center">
      <!-- <div class="flex flex-grow-0 flex-column align-items-center justify-content-center"> -->
      <Chart :key="refreshChart" :style="mStyle" type="doughnut" :data="chartData" :options="options" />
      <!-- </div> -->
      <!-- class="flex flex-none flex-column align-items-center justify-content-center" -->
      <span v-if="mSettings.tile.icon_visibility && mSettings.tile.icon" id="tileicon" :style="iconSize">
        <font-awesome-icon :icon="mSettings.tile.icon" />
      </span>
    </div>
    <div
      v-if="mSettings.tile.measurement_list"
      class="flex flex-column flex-grow-1 knob-component"
      style="position: relative; width: 100%; padding: 0rem 0.5rem"
    >
      <InformationTileMeasurementList
        :tile="tile"
        :pdata="pdata"
        :settings="mSettings"
        :conversion-settings="conversionSettings"
        @select="onMeasurementSelect"
      />
    </div>
  </div>
</template>
<script>
/**
 * component to show multiple    measurements in a form of a percentage knob,
 *  summarized inside componen or outside (provided min,max values for each measurement )
 */
import Chart from "primevue/chart";
import InformationTileMeasurementList from "./components/InformationTileMeasurementList.vue";
export default {
  name: "MultiKnobTile",
  components: { Chart, InformationTileMeasurementList },
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
      mStyle: "width: 25rem; margin: auto;max-width: 100%;max-height:100%",
      iconSize: `height: 10%;  width: 10%;`,
      relativeValues: false,
      mSettings: this.settings,
      tmpIndex: 0,
      refreshChart: false,
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
      let pdata = this.mSettings.tile.compare_with_previous && this.pdata ? this.pdata.previous : this.pdata;
      if (!(pdata && pdata.current)) {
        return {};
      }
      let data = null;
      data = this.tile.measurements.map((m) => {
        let maxV =
          pdata.max && pdata.max[m.aggregation_function][m.id]
            ? pdata.max[m.aggregation_function][m.id]
            : pdata.current[m.aggregation_function][m.id];
        return m.type.base_unit != "%" ? pdata.current[m.aggregation_function][m.id] / maxV : pdata.current[m.aggregation_function][m.id];
      });
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

      return {
        labels: labels,
        datasets: datasets,
      };
    },
  },
  watch: {
    chartData: {
      deep: true,
      handler: function () {
        if (this.loaded) {
          this.setChartBox();
          this.refreshChart = !this.refreshChart;
        }
      },
    },
  },
  mounted() {
    this.setChartBox();
    this.loaded = true;
  },
  methods: {
    setChartBox() {
      let minD = this.tileContentSize1D();
      var size = this.mSettings.tile.measurement_list ? 0.5 : 0.7;
      this.mStyle = `max-width: 100%;max-height:100%;margin: auto;width:${minD * size}px`;
      this.iconSize = this.mSettings.tile.measurement_list ? `height: 10%;  width: 10%;` : `height: 15%;  width: 15%;`;
    },
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
      // try {
      return this.$ren.utils.knobColors(this.tile.measurements[index]);
      // } catch (error) {
      //   console.error(error);
      //   let c = ["rgba(255,0,0,1.0)", "rgba(255,0,0,0.25)", "rgba(0, 255,0,1.0)", "rgba(0, 255,0,0.25)", "rgba(0,0,255,1.0)", "rgba(0, 0,255,0.25)"];
      //   let idx = this.tmpIndex++ % 3;
      //   return [c[2 * idx], c[2 * idx + 1]];
      // }
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
  text-align: center;
  svg {
    height: 100%;
    width: 100%;
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
