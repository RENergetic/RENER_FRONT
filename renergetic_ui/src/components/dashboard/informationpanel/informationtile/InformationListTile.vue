<template>
  <InformationTileItem
    v-for="(m, idx) in mTile.measurements"
    :key="m.id"
    :measurement="m"
    :idx="idx"
    :settings="mSettings"
    :conversion-settings="conversionSettings"
    :pdata="pdata"
    @click="onItemClick({ index: idx, item: m })"
  ></InformationTileItem>
</template>
<script>
import InformationTileItem from "./InformationTileItem.vue";
export default {
  name: "InformationListTile",
  components: { InformationTileItem },
  props: {
    tile: { type: Object, default: () => ({}) },
    pdata: { type: Object, default: () => ({}) },
    settings: { type: Object, default: () => ({}) },
    conversionSettings: { type: Object, default: () => ({}) },
    fontSize: { type: String, default: "2rem" },
  },
  emits: ["select"],
  data() {
    return {
      mSettings: this.settings,
      mTile: this.tile,
    };
  },
  methods: {
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
