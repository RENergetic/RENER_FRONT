<template>
  <div class="flex flex-column justify-content-center" style="height: 100%">
    <!-- <div class="flex flex-none flex-column justify-content-center">
      <h3 :style="`text-align: center;color:${tileTitleColor}`">{{ settings.tile.label }}</h3>
    </div> -->
    <!-- <div style="position: relative; display: inline-block; width: 100%; flex-grow: 1"> -->
    <div class="flex flex-grow-1 flex-column align-items-center justify-content-center" :style="mStyle">
      <QRCode v-if="loaded" :size="dimension" />
    </div>
  </div>
</template>
<script>
import QRCode from "@/components/miscellaneous/QRCode.vue";
/**
 * component to show percentage values in a form of a knob
 */
export default {
  name: "QRCodeTile",
  components: { QRCode },
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
    return {
      typeName: "qrcode",
      loaded: false,
      dimension: 100,
      mSettings: this.settings,
      mStyle: "max-width: 100rem;max-height:60rem; margin: auto;height:100%;width:100%",
    };
  },
  computed: {
    // unit: function () {
    //   return this.$ren.utils.getUnit(this.measurement, this.settings.panel, this.conversionSettings);
    // },
    color: function () {
      let color = this.measurementColor; // this.$ren.utils.measurementColor(this.measurement, this.value);
      return color.color;
    },

    tileStyle: function () {
      return `height: 100%;background:${this.tileMeasurementBackgroundColor} `;
    },
  },

  mounted() {
    console.debug("mounted " + this.tile.id);
    let dimension = this.tileContentSize1D();
    dimension = dimension - 40;
    // var size = this.mSettings.tile.measurement_list ? 0.5 : 0.7;
    // let minD = Math.min(this.settings.panel.cellWidth * this.tile.layout.w, this.settings.panel.cellHeight * this.tile.layout.h);
    this.mStyle = `max-width: 100rem;max-height:60rem; margin: auto;height:${dimension}px;width:${dimension}px`;
    this.dimension = dimension;
    this.loaded = true;
  },
  methods: {},
};
</script>

<style lang="scss"></style>
