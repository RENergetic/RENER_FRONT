<template>
  <InformationTileItem
    v-for="(m, idx) in mTile.measurements"
    :key="m.id"
    :tile-item="m"
    :idx="idx"
    :settings="settings"
    :pdata="pdata"
    @click="onItemClick({ index: idx, item: m })"
  ></InformationTileItem>

  <!-- :style="{ fontSize: fontSize }" -->
</template>
<script>
import InformationTileItem from "./InformationTileItem.vue";
export default {
  name: "InformationTile",
  components: { InformationTileItem },
  props: {
    // edit: { type: Boolean, default: false },
    tile: {
      type: Object,
      default: () => ({}),
    },
    pdata: {
      type: Object,
      default: () => ({}),
    },
    fontSize: {
      type: String,
      default: "2rem",
    },
  },
  emits: ["select"],

  data() {
    return {
      mTile: this.tile,
    };
  },
  computed: {},

  mounted() {},
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
