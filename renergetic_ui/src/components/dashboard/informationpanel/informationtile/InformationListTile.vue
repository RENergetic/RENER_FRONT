<template>
  <InformationTileItem v-for="m in tile.measurements" :key="m.id" :tile-item="m" :pdata="pdata"></InformationTileItem>
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

  computed: {},

  mounted() {},
};
</script>

<style lang="scss"></style>
