<template>
  <div style="width: 100%; height: 100%">
    <InformationTileItem
      v-for="(m, idx) in mTile.measurements"
      :key="m.id"
      :measurement="m"
      :idx="idx"
      :settings="mSettings"
      :conversion-settings="conversionSettings"
      :pdata="pdata"
      :height="itemHeight"
      @click="onItemClick({ index: idx, item: m })"
    ></InformationTileItem>
  </div>
</template>
<script>
import InformationTileItem from "./InformationTileItem.vue";
export default {
  name: "InformationTileMeasurementList",
  components: { InformationTileItem },
  props: {
    tile: { type: Object, default: () => ({}) },
    pdata: { type: Object, default: () => ({}) },
    settings: { type: Object, default: () => ({}) },
    conversionSettings: { type: Object, default: () => ({}) },
  },
  emits: ["select"],
  data() {
    let measurementLength = this.tile.measurements && this.tile.measurements.length ? this.tile.measurements.length : 1;
    let heightScale = (50.0 / (this.tileDim ? this.tileDim.height : 300)) * 92.0;
    return {
      itemHeight: Math.max(heightScale, 92.0 / measurementLength),
      mSettings: this.settings,
      mTile: this.tile,
    };
  },
  methods: {
    iconVisibility: function () {
      return (this.mSettings && this.mSettings.tile ? this.mSettings.tile.icon_visibility : true) && this.mSettings.tile.icon;
    },
    onItemClick(ctx) {
      if (this.mTile.measurements[ctx.index].visible == null) {
        this.mTile.measurements[ctx.index].visible = false;
      } else this.mTile.measurements[ctx.index].visible = !this.mTile.measurements[ctx.index].visible;
      this.$emit("select", ctx);
    },
  },
};
</script>
<style lang="scss"></style>
