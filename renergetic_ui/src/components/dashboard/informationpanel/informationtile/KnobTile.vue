<template>
  <div v-if="measurement" class="flex flex-column justify-content-center" :style="tileStyle">
    <!-- <div
      v-if="mSettings.tile.icon_visibility && mSettings.tile.icon"
      id="tileicon"
      class="flex flex-none flex-column align-items-center justify-content-center"
    > 
    <Knob v-model="value" class="flex-grow-1 flex" :style="{ textAlign: 'center', maxHeight: '80%' }" :min="minV" :max="maxV" />  
    </div> -->

    <div v-if="mSettings.tile.template" class="flex flex-none flex-column align-items-center justify-content-center">
      <h3 id="value" :style="color">
        {{ $t(`tile_templates.${tile.name}`, { value: `${$ren.utils.roundValue(value)} ${unit} ` }) }}
      </h3>
    </div>
    <div v-else class="flex flex-none flex-column align-items-center justify-content-center">
      <span
        ><h3 id="label" :style="color">{{ mSettings.tile.label ? mSettings.tile.label : measurementlabel }} {{ unitTitle }}</h3></span
      >
    </div>
    <!-- {{ valuetemplate }}{{ value }} -->
    <!-- :value-template="valuetemplate" -->
    <Knob
      v-if="valuetemplate"
      id="knob_component"
      v-model="value"
      :value-color="color"
      range-color="#e9e8e8"
      :text-color="color"
      class="flex flex-none flex-column align-items-center justify-content-center"
      :style="{ textAlign: 'center', maxHeight: '80%', color: 'red' }"
      :min="minV"
      :max="maxV"
      size="1000"
      :stroke-width="strokeWidth"
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
    settings: { type: Object, default: () => ({}) },
    pdata: { type: Object, default: () => ({}) },
    conversionSettings: { type: Object, default: () => ({}) },
    tile: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    let measurement = null;
    if (this.tile.measurements) {
      measurement = this.tile.measurements[0];
    }
    let maxV =
      this.settings.panel.relativeValues &&
      this.pdata.max &&
      this.pdata.max[measurement.aggregation_function] &&
      this.pdata.max[measurement.aggregation_function][measurement.id]
        ? this.pdata.max[measurement.aggregation_function][measurement.id]
        : this.defaultMax(measurement);

    let minV =
      this.settings.panel.relativeValues &&
      this.pdata.min &&
      this.pdata.min[measurement.aggregation_function] &&
      this.pdata.min[measurement.aggregation_function][measurement.id]
        ? this.pdata.min[measurement.aggregation_function][measurement.id]
        : 0.0;
    let unit = this.$ren.utils.getUnit(measurement, this.settings.panel, this.conversionSettings);
    return {
      mSettings: this.settings,
      measurement: measurement,
      maxV: maxV,
      minV: minV,
      valuetemplate: unit && unit != "any" ? "{value}[" + unit + "]" : "{value}",
    };
  },
  computed: {
    unit: function () {
      return this.$ren.utils.getUnit(this.measurement, this.settings.panel, this.conversionSettings);
    },
    unitTitle: function () {
      let u = this.$ren.utils.getUnit(this.measurement, this.settings.panel, this.conversionSettings);
      return u ? `[${u}]` : "";
    },
    color: function () {
      let color = this.$ren.utils.measurementColor(this.measurement, this.value);
      return color.color;
    },
    tileStyle: function () {
      let color = this.$ren.utils.measurementBackgroundColor(this.measurement, this.settings.tile, this.value);
      return `height: 100%;background:${color} `;
    },
    measurementlabel: function () {
      if (this.measurement.label != null) {
        let k = `model.measurement.labels.${this.measurement.label}`;
        return this.$te(k) ? this.$t(k) : this.measurement.label;
      } else {
        //TODO: translate it
        return this.measurement.name;
      }
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
          return this.maxV;
        }
        if (v < this.minV) {
          console.warn(`knob: wrong value  ${v}, min: ${this.minV}`);
          return this.maxV;
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
