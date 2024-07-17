<template>
  <div class="flex flex-column justify-content-center" style="height: 100%">
    <div class="flex flex-none flex-column justify-content-center">
      <h3 :style="`text-align: center;color:${tileTitleColor}`">{{ settings.tile.label }}</h3>
    </div>
    <!-- <div style="position: relative; display: inline-block; width: 100%; flex-grow: 1"> -->
    <div class="flex flex-grow-1 flex-column align-items-center justify-content-center" :style="mStyle">
      <Image v-if="loaded" :src="imgUrl" alt="Image" :width="dimensions.w" :height="dimensions.h" preview />
    </div>
  </div>

  <!--
  https://put.poznan.pl/sites/default/files/2021-03/pp_logo.svg
    /> -->
</template>
<script>
import Image from "primevue/image";
export default {
  name: "ImageTile",
  components: { Image },
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
      loaded: false,
      dimensions: { w: 100, h: 100 },
      mSettings: this.settings,
      mStyle: "max-width: 100rem;max-height:60rem; margin: auto;height:100%;width:100%",
    };
  },
  computed: {
    imgUrl: function () {
      try {
        return this.mSettings.tile.img_url;
      } catch {
        return null;
      }
    },
  },
  mounted() {
    console.debug("mounted " + this.tile.id);
    let dimensions = this.tileContentSize2D();
    dimensions.h = dimensions.h - 80;
    // var size = this.mSettings.tile.measurement_list ? 0.5 : 0.7;
    // let minD = Math.min(this.settings.panel.cellWidth * this.tile.layout.w, this.settings.panel.cellHeight * this.tile.layout.h);
    this.mStyle = `max-width: 100rem;max-height:60rem; margin: auto;height:${dimensions.h}px;width:${dimensions.w}px`;
    this.loaded = true;
    this.dimensions = dimensions;
  },
  methods: {},
};
</script>

<style lang="scss"></style>
