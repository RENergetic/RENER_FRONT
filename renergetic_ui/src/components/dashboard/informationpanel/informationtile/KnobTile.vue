<template>
  <div style="position: relative">
    <Knob v-model="value" :style="{ textAlign: 'center' }" :min="0" :max="100.0" />
    <div style="text-align: center">
      <div v-if="measurement">{{ mSettings.tile.label }}</div>
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
    return {
      mSettings: this.settings,
      measurement: measurement,
    };
  },
  computed: {
    value: function () {
      if (this.measurement) {
        let id = this.measurement.id;
        if (!(this.pdata && this.pdata.current)) {
          return null;
        }
        return this.pdata.current[id];
      }
      return null;
    },
  },

  mounted() {},
  methods: {},
};
</script>

<style lang="scss"></style>
