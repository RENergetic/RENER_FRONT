<template>
  <div class="grid-stack-item" v-bind="gridStackAttributes">
    <Card :class="'grid-stack-item-content'">
      <template v-if="tile != null" #content>
        <InformationTileItem
          v-for="item in tile.items"
          :key="item.id"
          :tile-item="item"
        ></InformationTileItem>
      </template>
    </Card>
  </div>
</template>
<script>
import Card from "primevue/card";
import InformationTileItem from "./InformationTileItem.vue";
export default {
  name: "InformationTile",
  components: { Card, InformationTileItem },
  props: {
    tile: {
      type: Object,
      default: () => ({}),
    },
  },
  // data() {
  //   return {};
  // },
  computed: {
    col: function () {
      return this.tile == null || this.tile.col == null ? 2 : this.tile.col;
    },
    gridStackAttributes() {
      return {
        id: this.tile.id,
        "data-gs-id": this.tile.id,
        "data-gs-x": this.tile.x,
        "data-gs-y": this.tile.y,
        "data-gs-width": 2,
        "data-gs-height": 1,
      };
    },
  },

  mounted() {},
  methods: {},
};
</script>

<style lang="scss">
.grid-stack-item {
  margin: 10px;
}
.grid-stack-item-content {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #3182ce;
  background-color: #bee3f8;
  font-weight: 600;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
</style>
