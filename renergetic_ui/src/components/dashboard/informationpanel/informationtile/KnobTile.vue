<template>
  <div v-if="measurement" class="flex flex-column justify-content-center" :style="tileStyle">
    <div v-if="mSettings.tile.template" class="flex flex-none flex-column align-items-center justify-content-center">
      <h3 id="value" :style="`color:${tileTitleColor}`">
        {{ $t(`tile_templates.${tile.name}`, { value: `${$ren.utils.roundValue(value)} ${unit} ` }) }}
      </h3>
    </div>
    <div v-else class="flex flex-none flex-column align-items-center justify-content-center">
      <span
        ><h3 id="label" :style="`color:${tileTitleColor}`">{{ mSettings.tile.label ? mSettings.tile.label : mlabel }} {{ unitLabel }}</h3></span
      >
    </div>
    <Knob
      v-if="valuetemplate"
      id="knob_component"
      v-model="value"
      :range-color="rangeColor"
      :min="minV"
      :text-color="color"
      :value-color="color"
      :value-template="valuetemplate"
      :max="maxV"
      :stroke-width="strokeWidth"
      class="flex flex-grow-1 flex-column align-items-center justify-content-center"
      :style="{ textAlign: 'center', maxHeight: '80%', overflow: 'hidden' }"
      :size="1000"
    />
  </div>

  <div v-else>{{ $t("view.no_panel_measurements") }}</div>
</template>
<script>
import Knob from "primevue/knob";
/**
 * component to show percentage values in a form of a knob
 */
export default {
  name: "KnobTile",
  components: { Knob },
  props: {
    settings: { type: Object, default: () => ({ panel: {}, tile: {} }) },
    pdata: { type: Object, default: () => ({}) },
    conversionSettings: { type: Object, default: () => ({}) },
    tile: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    // let measurement = null;
    // if (this.tile.measurements) {
    //   measurement = this.tile.measurements[0];
    // }
    let measurement = this.getTileMeasurement();
    console.error(this.pdata);
    let maxV =
      !this.settings.panel.relativeValues &&
      this.pdata.max &&
      this.pdata.max[measurement.aggregation_function] &&
      this.pdata.max[measurement.aggregation_function][measurement.id]
        ? this.pdata.max[measurement.aggregation_function][measurement.id]
        : this.defaultMax(measurement);

    let minV =
      !this.settings.panel.relativeValues &&
      this.pdata.min &&
      this.pdata.min[measurement.aggregation_function] &&
      this.pdata.min[measurement.aggregation_function][measurement.id]
        ? this.pdata.min[measurement.aggregation_function][measurement.id]
        : 0.0;
    let unit = this.$ren.utils.getUnit(measurement, this.settings.panel, this.conversionSettings);
    return {
      unit: unit,
      mSettings: this.settings,
      measurement: measurement,
      rangeColor: this.settings.tile["knob_color"] ? this.settings.tile["knob_color"] : "#e9e8e8",

      maxV: maxV,
      minV: minV,
      valuetemplate: unit != null ? "{value}" + unit : "{value}",
    };
  },
  computed: {
    // unit: function () {
    //   return this.$ren.utils.getUnit(this.measurement, this.settings.panel, this.conversionSettings);
    // },
    color: function () {
      let color = this.$ren.utils.measurementColor(this.measurement, this.value);
      return color.color;
    },

    tileStyle: function () {
      return `height: 100%;background:${this.tileBackgroundColor} `;
    },

    mlabel: function () {
      return this.measurementLabel(this.measurement);
      // if (this.measurement.label != null) {
      //   let k = `model.measurement.labels.${this.measurement.label}`;
      //   return this.$te(k) ? this.$t(k) : this.measurement.label;
      // } else {
      //   //TODO: translate it
      //   return this.measurement.name;
      // }
    },

    strokeWidth: function () {
      return 12 + 2 * Math.min(this.tile.layout.w, this.tile.layout.h);
    },
    value: function () {
      //todo support  min max
      try {
        let v;
        if (this.mSettings.panel.relativeValues && this.measurement.type.base_unit != "%") {
          v = (this.pdata.current[this.measurement.aggregation_function][this.measurement.id] / this.maxV) * 100.0;
        } else {
          v = this.pdata.current[this.measurement.aggregation_function][this.measurement.id];
        }
        if (v > this.maxV) {
          console.warn(`knob: value overflow ${v}, max: ${this.maxV}`);
          v = this.maxV;
        } else if (v < this.minV) {
          console.warn(`knob: wrong value  ${v}, min: ${this.minV}`);
          v = this.maxV;
        }
        return this.$ren.utils.roundValue(v); // Math.round(v * 10) / 10.0;
      } catch (e) {
        return null;
      }
    },
  },

  mounted() {},
  methods: {
    defaultMax(measurement) {
      switch (measurement.type.base_unit) {
        case "%":
      }
      return measurement.type.base_unit == "%" || this.settings.panel.relativeValues ? 100.0 : 1.0;
    },
  },
};
</script>

<style lang="scss">
// .knob-component {
//   position: relative;
//   display: flex;
//   flex-direction: column;
//   height: 100%;
// }

#knob_component {
  background: transparent;

  width: 100%;
  // height: 4.5rem;
  height: 75%;
  .p-knob-text {
    // font-size: 1rem;
  }
  // svg {
  //   height: 100%;
  // }
}
// h2 {
//   margin: 0;
// }
</style>
