<template>
  <!-- {{ mPanel }} -->
  <!-- {{ $store.getters["view/measurementTypes"] }}  -->
  <!--  offset -->
  <!-- {{ pdata }} -->
  <!-- <NotificationList v-if="settings.notificationVisibility" :notifications="mNotifications"></NotificationList> -->
  <InformationPanelView
    v-if="mPanel"
    :edit="editMode"
    :pdata="pdata"
    :panel="mPanel"
    :locked="locked"
    :settings="settings"
    :asset-id="assetId"
    @edit="onEdit"
  />
  <Dialog
    v-model:visible="editDialog"
    :style="{ width: '50vw' }"
    :maximizable="true"
    :modal="true"
    :dismissable-mask="true"
  >
    <div class="field grid">
      <label for="assetType" class="col-fixed" style="width: 5rem">
        {{ $t("model.information_tile.type") }}
      </label>
      <div class="col">
        <Dropdown
          id="assetType"
          v-model="selectedItem.tile.type"
          :options="tileTypes"
          option-label="label"
          option-value="value"
          :placeholder="$t('view.select_tile_type')"
        />
      </div>
    </div>
    <div class="field grid">
      <Button
        :label="$t('view.button.manage_measurement')"
        icon="pi pi-plus"
        @click="() => (manageSensorsDialog = !manageSensorsDialog)"
      />
    </div>
    <div class="field grid">
      <Button :label="$t('view.button.submit')" icon="pi pi-plus" @click="saveGrid" />
    </div>
    <Dialog
      v-model:visible="manageSensorsDialog"
      :style="{ width: '75vw' }"
      :maximizable="true"
      :modal="true"
      :dismissable-mask="true"
    >
      <!-- {{ selectedTile.tile.measurements }} -->
      <ManageSensors v-model="selectedItem.tile.measurements"></ManageSensors>
    </Dialog>
  </Dialog>
</template>
<script>
// import NotificationList from "@/components/management/notification/NotificationList.vue";
import InformationPanelView from "./InformationPanelView.vue";
import ManageSensors from "../measurements/ManageSensors.vue";
// import { GridStack } from "gridstack";
import { TileTypes, NotificationContext } from "@/plugins/model/Enums.js";
// THEN to get HTML5 drag&drop
// import "gridstack/dist/h5/gridstack-dd-native";
// import "gridstack/dist/gridstack.min.css";
export default {
  name: "InformationPanel",
  components: {
    InformationPanelView,
    ManageSensors,
    // NotificationList,
  },
  props: {
    assetId: {
      type: Number,
      default: null,
    },
    locked: {
      type: Boolean,
      default: true,
    },
    panel: {
      type: Object,
      default: () => null,
    },
    settings: {
      type: Object,
      default: () => {
        return {};
      },
    },
    conversionSettings: {
      type: Object,
      default: () => {
        return {};
      },
    },

    editMode: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update"],
  data() {
    return {
      mNotifications: [],
      grid: null,
      notificationDialog: false,
      editDialog: false,
      selectedItem: null,
      mPanel: null,
      manageSensorsDialog: false,
      pdata: null,
      tileTypes: Object.entries(TileTypes).map((k) => {
        return { value: k[1], label: this.$t("enums.tile_type." + k[1]) };
      }),
      notificationContext: NotificationContext.TILE,
    };
  },
  computed: {
    tiles: function () {
      // return this.panel != null ? this.panel.tiles : [];
      return this.mPanel != null ? this.mPanel.tiles : [];
    },
    gridItems: function () {
      return this.grid != null ? this.grid.getGridItems() : [];
    },
  },
  watch: {
    manageSensorsDialog: function (newValue) {
      if (!newValue) {
        this.mPanel.tiles[this.selectedItem.index] = this.selectedItem.tile;
      }
    },
    // panel: {
    //   handler: function (newValue) {
    //     this.mPanel = newValue;
    //     this.reloadGrid();
    //   },
    //   deep: true,
    // },
  },
  async beforeMount() {
    if (!this.panel.is_template) {
      this.mPanel = this.panel;
    }
  },
  async mounted() {
    await this.loadData();
    // this.reloadGrid();
  },
  // async updated() {
  // await this.loadData();
  // this.reloadGrid();
  // },
  methods: {
    // reloadGrid() {
    //   if (this.grid != null) this.grid.destroy(false);
    //   let grid = GridStack.init({ float: true }, "#panel-grid-stack");
    //   if (this.locked) {
    //     grid.disable();
    //   } else {
    //     grid.enable();
    //   }
    //   grid.disable();
    //   this.grid = grid;
    // },
    async loadData() {
      console.info("panel load data");

      let filterSettings = this.$store.getters["settings/parsedFilter"];
      console.error(filterSettings);
      if (this.panel.id != null) {
        if (this.panel.is_template) {
          let resp = await this.$ren.dataApi.getPanelData(this.panel.id, this.assetId);
          this.mPanel = resp.panel;
          this.pdata = resp.data;
        } else {
          let resp = await this.$ren.dataApi.getPanelData(this.panel.id);
          this.pdata = resp.data;
        }
      }
    },
    // gridWidth(tile) {
    //   return tile.col == null ? 2 : tile.col;
    // },
    onEdit(evt) {
      //todo
      this.selectedItem = evt;
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
      this.mPanel.tiles = tiles;
      this.$emit("update", this.mPanel);
    },

    // viewNotification(evt) {
    //   //TODO: load here notifications for tile
    //   this.selectedItem = evt;
    //   this.notificationDialog = true;
    // },
  },
};
</script>

<style lang="scss">
// #panel-grid-stack {
//   width: 100%;
//   position: absolute;
//   top: 0;
// }
</style>
