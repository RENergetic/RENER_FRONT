<template>
  <div>
    <div v-if="panel">
      <DotMenu :model="menuModel" />
      <div class="grid-stack">
        <InformationTile v-for="tile in tiles" :key="tile.id" :tile="tile" />
      </div>
      <!-- <div class="grid-stack">
        <test-component
          v-for="widget in tiles"
          :key="widget.id"
          :widget="widget"
        />
      </div> -->
    </div>

    <!-- <div class="grid-stack">
      <div
        v-for="tile in tiles"
        :key="tile.id"
        :class="'grid-stack-item'"
        :gs-w="gridWidth(tile)"
      >
        <div class="grid-stack-item-content">Item 2 wider</div>
      </div>
    </div> -->
    <!-- {{ tiles }} -->
  </div>
</template>
<script>
import InformationTile from "../../components/dashboard/InformationTile.vue";
import DotMenu from "../../components/miscellaneous/DotMenu.vue";
import { GridStack } from "gridstack";
// THEN to get HTML5 drag&drop
import "gridstack/dist/h5/gridstack-dd-native";
import "gridstack/dist/gridstack.min.css";
export default {
  name: "Dashboard",
  components: { InformationTile, DotMenu },
  data() {
    return {
      panel: null,
      grid: null,
    };
  },
  computed: {
    tiles: function () {
      return this.panel != null ? this.panel.tiles : [];
    },
    gridItems: function () {
      return this.grid != null ? this.grid.getGridItems() : [];
    },
    menuModel() {
      return [
        {
          label: this.$t("menu.save_grid"),
          icon: "pi pi-fw pi-plus-circle",
          command: () => this.saveGrid(),
        },
      ];
    },
  },
  watch: {},
  async created() {
    this.$ren.dashboardApi
      .getInformationPanel(this.$route.params.id)
      .then((panel) => {
        this.panel = panel;
      });
    //todo: catch
  },
  updated() {
    console.info(this.tiles);
    if (this.grid != null) this.grid.destroy(false);
    this.grid = GridStack.init({ float: true });
    window.grid = this.grid;
  },
  methods: {
    gridWidth(tile) {
      return tile.col == null ? 2 : tile.col;
    },
    saveGrid() {
      //TODO: save
      let nodes = this.gridItems;
      let tiles = this.tiles;
      nodes.forEach((node) => {
        let gridstackNode = node.gridstackNode;
        const tile = tiles.find((t) => t.id === gridstackNode.id);
        if (tile) {
          tile.layout = {
            x: gridstackNode.x,
            y: gridstackNode.y,
            w: gridstackNode.w,
            h: gridstackNode.h,
          };
        }
      });
      this.tiles = tiles;
    },
  },
};
</script>

<style lang="scss">
#dashboard-wrapper {
  top: 5vh;
  left: 0;
  position: absolute;
  width: 100%;
  height: 90vh;
}
.ren-dock {
  a {
    text-decoration: none;
    color: grey;
    font-weight: bolder;
    cursor: pointer;
    width: inherit !important;
  }
  .p-dock,
  .p-dock-action {
    height: inherit !important;
  }
  .p-dock-item-current * {
    color: yellow !important;
  }
}
</style>
