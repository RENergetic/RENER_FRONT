<template>
  <div class="knob-component">
    <Knob
      v-model="value"
      class="flex-grow-1 flex"
      :style="{ textAlign: 'center', maxHeight: '80%' }"
      :min="minV"
      :max="maxV"
    />
    <div class="flex-none flex" style="text-align: center">
      <div v-if="measurement" id="label">{{ mSettings.tile.label }}</div>
    </div>
  </div>
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
    value: function () {
      //todo support  min max
      try {
        let v;
        if (this.mSettings.panel.relativeValues && this.measurement.type.base_unit != "%") {
          v = (this.pdata.current[this.measurement.aggregation_function][this.measurement.id] / this.maxV) * 100.0;
        } else {
          v = this.pdata.current[this.measurement.aggregation_function][this.measurement.id];
        }
        return Math.round(v * 10) / 10.0;
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
.demand-box {
  #tileicon {
    height: 35%;
  }
  #label {
    font-size: 0.75rem;
  }
}
.knob-component {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
