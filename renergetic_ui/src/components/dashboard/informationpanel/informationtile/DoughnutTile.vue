<template>
  <div class="flex flex-column justify-content-center" style="height: 100%">
    <div class="flex flex-none flex-column align-items-center justify-content-center">
      <h3 :style="`text-align: center;color:${tileTitleColor}`" :v-tooltip="mSettings.tile.description">{{ mSettings.tile.label }}</h3>
      <!-- v-if="legend"-->
    </div>
    <!-- <div style="position: relative; display: inline-block; width: 100%; flex-grow: 1"> -->

    <div class="flex flex-grow-1 flex-column align-items-center justify-content-center" style="position: relative">
      <span
        v-if="mSettings.tile.icon_visibility && mSettings.tile.icon"
        id="tileicon"
        class="flex flex-none flex-column align-items-center justify-content-center"
      >
        <font-awesome-icon :icon="mSettings.tile.icon" />
      </span>
      <div v-if="loaded" class="flex flex-none flex-column align-items-center justify-content-center">
        <Chart :style="mStyle" type="doughnut" :data="chartData" :options="options" />
      </div>
    </div>
    <div class="flex flex-column flex-grow-1 knob-component" style="position: relative; width: 100%; padding: 0rem 0.5rem">
      <InformationTileMeasurementList
        v-if="mSettings.tile.measurement_list"
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
import Chart from "primevue/chart";
import InformationTileMeasurementList from "./components/InformationTileMeasurementList.vue";
export default {
  name: "DoughnutTile",
  components: { Chart, InformationTileMeasurementList },
  props: {
    conversionSettings: { type: Object, default: () => ({}) },
    settings: { type: Object, default: () => ({}) },
    pdata: { type: Object, default: () => ({}) },
    tile: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      measurementFilter: [],
      loaded: false,
      mSettings: this.settings,
      mStyle: "max-width: 25rem; margin: auto",
      options: {
        responsive: true,
        plugins: {
          legend: {
            // position: "chartArea",
            display: false, //this.settings.tile.legend ? this.settings.tile.legend : false,
            labels: {
              // color: "#495057",
              color: this.settings.tile.color,
            },
          },
        },
      },
    };
  },
  computed: {
    chartData: function () {
      let pdata = this.mSettings.tile.compare_with_previous && this.pdata ? this.pdata.previous : this.pdata;
      if (!(pdata && pdata.current)) {
        return {};
      }

      let data;
      let labels;
      let backgroundColors;
      var measurements = this.tile.measurements.filter((it) => !this.measurementFilter.includes(it.id));
      if (this.mSettings.tile.group_by_asset || this.mSettings.tile.group_by_domain || this.mSettings.tile.group_by_direction) {
        let groupedValues = this.$ren.utils.groupValues(measurements, pdata, this.mSettings);
        console.debug(groupedValues);
        data = Object.values(groupedValues).map((g) => g.value);
        labels = Object.values(groupedValues).map((g) => g.label);
        backgroundColors = Object.values(groupedValues).map((g) => g.color);
        console.warn("TODO: set   labels and colors for grouped measurements");
        console.warn(labels);
        // console.warn(backgroundColors);
      } else {
        data = measurements.map((m) => pdata.current[m.aggregation_function][m.id]);
        labels = measurements.map((m) => this.measurementLabel(m) + " " + this.$ren.utils.unitLabel(m, this.settings.panel, this.conversionSettings));
        backgroundColors = measurements.map((m) => this.$ren.utils.measurementColor(m).color);
      }
      // console.error(data);
      // if (!this.mSettings.panel.relativeValues) {
      //   data = this.tile.measurements.map((m) => this.pdata.current[m.aggregation_function][m.id]);
      // } else {
      //   //console.info("use relative values");
      //   //todo include min offset
      //   data = this.tile.measurements.map((m) =>
      //     m.type.base_unit != "%"
      //       ? this.pdata.current[m.aggregation_function][m.id] / this.pdata.max[m.aggregation_function][m.id]
      //       : this.pdata.current[m.aggregation_function][m.id],
      //   );
      //   let sum = data.reduce((partialSum, a) => partialSum + a, 0);
      //   if (sum < 0.99999) {
      //     data.push(1.0 - sum);
      //     backgroundColor.push("#90A4AE");
      //     labels.push("");
      //   }
      // }

      //fill the pie to 100%
      if (this.mSettings.panel.relativeValues) {
        let sum = data.reduce((partialSum, a) => partialSum + a, 0);
        if (sum < 0.99999) {
          data.push(1.0 - sum);
          backgroundColors.push("#90A4AE");
          labels.push("");
        }
      }
      return {
        labels: labels,
        //TODO: set colors
        datasets: [
          {
            data: data,
            backgroundColor: backgroundColors,
          },
        ],
      };
    },
  },
  mounted() {
    let minD = this.tileContentSize1D();
    // console.debug(this.tile.id + ": minD=" + minD);
    this.mStyle = `max-width: 25rem; margin: auto;width:${minD * 0.65}px`;
    this.loaded = true;
  },
  methods: {
    onMeasurementSelect(m) {
      let idx = this.measurementFilter.indexOf(m.item.id);
      if (idx >= 0 && m.item.visible === true) {
        this.measurementFilter.splice(idx, 1);
      } else if (m.item.visible === false) {
        this.measurementFilter.push(m.item.id);
      }
    },
  },
};
</script>

<style scoped lang="scss">
#tileicon {
  position: absolute;
  height: 20%;
  width: 20%;

  svg {
    height: 100%;
  }
}
</style>
