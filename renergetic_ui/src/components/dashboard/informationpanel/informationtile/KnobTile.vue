<template>
  <div class="flex flex-column justify-content-center" :style="tileStyle">
    <!-- <div
      v-if="mSettings.tile.icon_visibility && mSettings.tile.icon"
      id="tileicon"
      class="flex flex-none flex-column align-items-center justify-content-center"
    > 
    <Knob v-model="value" class="flex-grow-1 flex" :style="{ textAlign: 'center', maxHeight: '80%' }" :min="minV" :max="maxV" />  
    </div> -->
    <div v-if="mSettings.tile.template" class="flex flex-none flex-column align-items-center justify-content-center">
      <span id="value" :style="color">
        {{ $t(`tile_templates.${tile.name}`, { value: `${$ren.utils.roundValue(value)} ${unit} ` }) }}
      </span>
    </div>
    <div v-else class="flex flex-none flex-column align-items-center justify-content-center">
      <span id="label" :style="color"> {{ mSettings.tile.label ? mSettings.tile.label : measurementlabel }} </span>
    </div>
    <Knob
      id="knob_component"
      v-model="value"
      :value-color="color"
      range-color="#e9e8e8"
      :text-color="color"
      class="flex flex-none flex-column align-items-center justify-content-center"
      :style="{ textAlign: 'center', maxHeight: '80%', color: 'red' }"
      :min="minV"
      :max="maxV"
      :stroke-width="strokeWidth"
    />
  </div>

  <!-- <div class="knob-component">
    <Knob v-model="value" class="flex-grow-1 flex" :style="{ textAlign: 'center', maxHeight: '80%' }" :min="minV" :max="maxV" />
    <div class="flex-none flex" style="text-align: center">
      <div v-if="measurement" id="label">{{ mSettings.tile.label }}</div>
    </div>
  </div> -->
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
    let maxV;
    let minV;
    try {
      maxV = this.pdata.max[this.measurement.aggregation_function][measurement.id];
    } catch {
      maxV = 100.0;
    }
    try {
      minV = this.pdata.max[this.measurement.aggregation_function][measurement.id];
    } catch {
      minV = 0.0;
    }
    return {
      mSettings: this.settings,
      measurement: measurement,
      maxV: maxV,
      minV: minV,
    };
  },
  computed: {
    unit: function () {
      return this.$ren.utils.getUnit(this.measurement, this.settings.panel, this.conversionSettings);
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
  methods: {},
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
  // svg {
  //   height: 100%;
  // }
}
// h2 {
//   margin: 0;
// }
</style>
