<template>
  <InformationTileItem
    v-for="item in tile.props.items"
    :key="item.id"
    :tile-item="item"
    :value="pdata[item.key]"
  ></InformationTileItem>
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
  },
  // emits: ["edit", "notification"],
  // data() {
  //   return {};
  // },
  computed: {},

  mounted() {},
  methods: {},
};
</script>

<style lang="scss"></style>
