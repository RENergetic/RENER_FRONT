<template>
  <div>
    <div v-if="panel">
      <DotMenu :model="menuModel" />
      <div class="grid-stack">
        <InformationTile
          v-for="tile in tiles"
          :key="tile.id"
          :tile="tile"
          :edit="!locked"
          @edit="startEdit"
          @notification="viewNotification"
        />
      </div>
    </div>
    <Dialog
      v-model:visible="editDialog"
      :style="{ width: '50vw' }"
      :maximizable="true"
      :modal="true"
      :dismissable-mask="true"
    >
      {{ editTile }}
      <p>todo edit options, list of metrics</p>
    </Dialog>

    <Dialog
      v-model:visible="editDialog"
      :style="{ width: '50vw' }"
      :maximizable="true"
      :modal="true"
      :dismissable-mask="true"
    >
      {{ editTile }}
      <p>todo edit options, list of metrics</p>
    </Dialog>

    <Dialog
      v-model:visible="notifiationDialog"
      :style="{ width: '50vw' }"
      :maximizable="true"
      :modal="true"
      :dismissable-mask="true"
    >
      <notification-view :notifications="[]" />
      <p>todo:</p>
    </Dialog>

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
import NotificationView from "../../components/area/NotificationView.vue";
import Dialog from "primevue/dialog";
import { GridStack } from "gridstack";
// THEN to get HTML5 drag&drop
import "gridstack/dist/h5/gridstack-dd-native";
import "gridstack/dist/gridstack.min.css";
export default {
  name: "Dashboard",
  components: { InformationTile, DotMenu, Dialog, NotificationView },
  data() {
    return {
      panel: null,
      grid: null,
      locked: false,
      editTile: null,
      editDialog: false,
      notifiationDialog: false,
    };
  },
  computed: {
    tiles: function () {
      return this.panel != null ? this.panel.tiles : [];
    },
    gridItems: function () {
      return this.grid != null ? this.grid.getGridItems() : [];
    },
    toggleButton: function () {
      //TODO: if permission
      let label = this.locked
        ? this.$t("menu.grid_unlock")
        : this.$t("menu.grid_lock");
      return {
        label: label,
        icon: "pi pi-fw pi-lock",
        command: () => this.toggleLock(),
      };
    },
    addButton: function () {
      //TODO: if permission
      return {
        label: this.$t("menu.grid_add_tile"),
        icon: "pi pi-fw pi-plus",
        command: () => this.addTile(),
      };
    },
    menuModel() {
      return [
        {
          label: this.$t("menu.save_grid"),
          icon: "pi pi-fw pi-plus-circle",
          command: () => this.saveGrid(),
        },
        this.toggleButton,
        this.addButton,

        // {
        //   label: this.$t("menu.grid_lock"),
        //   icon: "pi pi-fw pi-lock",
        //   command: () => this.saveGrid(),
        // },
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
    if (this.grid != null) this.grid.destroy(false);
    let grid = GridStack.init({ float: true });
    if (this.locked) {
      grid.disable();
    } else {
      grid.enable();
    }
    this.grid = grid;
    window.grid = this.grid;
  },
  methods: {
    gridWidth(tile) {
      return tile.col == null ? 2 : tile.col;
    },
    async toggleLock() {
      this.locked = !this.locked;
    },
    addTile() {
      //TODO: get unique id?
      this.panel.tiles.push({
        // layout: { x: 0, y: 0, h: 3, w: 3 },
        id: this.$ren.utils.uuid(),
        title: null,
        items: [],
      });
    },
    startEdit(tile) {
      //todo
      this.editTile = tile;
      this.editDialog = true;
      // console.info(tile);
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
    viewNotification() {
      //TODO: load here notifications for tile
      this.notifiationDialog = true;
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
