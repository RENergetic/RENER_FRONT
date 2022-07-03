<template>
  <div
    v-if="pdata"
    :id="gridId"
    style="width: 100%; position: relative; display: block; height: fit-content"
    class="grid-stack"
  >
    <InformationTile
      v-for="(t, index) in tiles"
      :key="t.id"
      :slot-props="{ tile: t, index: index }"
      :edit="editMode"
      :pdata="tileData"
      :settings="settings"
      @edit="onEdit"
      @notification="viewNotification"
    />
  </div>
</template>
<script>
import { GridStack } from "gridstack";
import InformationTile from "./InformationTile.vue";
import "gridstack/dist/h5/gridstack-dd-native";
import "gridstack/dist/gridstack.min.css";
export default {
  name: "PanelTile",
  components: { InformationTile },
  props: {
    pdata: { type: Object, default: () => null },
    tile: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      grid: null,
    };
  },
  computed: {
    tiles: function () {
      if (this.tile && this.tile.panel) {
        return this.tile.panel.tiles;
      }
      return [];
    },
    gridId: function () {
      return `grid:${this.tile.id}`;
    },
    tileData: function () {
      //wrap back data
      return { data: this.pdata };
    },
  },
  updated() {
    this.initGrid();
  },
  mounted() {
    this.initGrid();
  },
  methods: {
    initGrid() {
      if (this.grid != null) this.grid.destroy(false);
      let grid = GridStack.init({ float: true }, `#${this.gridId}`);
      // if (this.locked) {
      grid.disable();
      // } else {
      // grid.enable();
      // }
      this.grid = grid;
      // //TODO: remove this reference?
      window[this.tile.id] = this.grid;
    },
  },
};
</script>

<style lang="scss"></style>
