<template>
  <div class="grid-stack-item" v-bind="gridStackAttributes">
    <Card :class="'grid-stack-item-content'">
      <template #title> {tile} </template>
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
    layout: function () {
      console.info(this.tile.layout);
      return this.tile != null && this.tile.layout != null
        ? this.tile.layout
        : (() => ({}))();
    },
    gridStackAttributes() {
      //TODO: other attributes?
      //https://github.com/gridstack/gridstack.js/tree/master/doc#grid-attributes
      // example with an old version https://codesandbox.io/s/grid-stack-js-integration-with-vuejs-72mrn?file=/src/App.vue
      return {
        id: this.tile.id,
        "gs-id": this.tile.id,
        "gs-x": this.layout.x,
        "gs-y": this.layout.y,
        "gs-w": this.layout.w,
        "gs-h": this.layout.h,
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
