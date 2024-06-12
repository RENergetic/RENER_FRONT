<template>
  <div v-if="mPanel && mPanelData && loaded" id="panel-grid-stack" :key="reload" class="grid-stack">
    <InformationTileGridWrapper
      v-for="(tile, index) in tiles"
      :key="tile.id"
      class="card-container"
      :slot-props="{ tile: tile, index: index }"
      :edit="edit"
      :pdata="mPanelData"
      :settings="mSettings"
      :filter="filter"
      @edit="$emit('editTile', { tile: tile, index: index })"
      @preview-tile="onPreview"
      @timeseries-update="onTimeseriesUpdate"
      @notification="viewNotification"
    />
  </div>
  <TileMeasurementPreview ref="dataPreview" />
  <!--  @on-load="onChartsLoad()" -->
  <Dialog v-model:visible="notificationDialog" :style="{ width: '50vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <notification-list v-if="selectedItem" :context="notificationContext" :object-id="selectedItem.tile.id" />
  </Dialog>
</template>
<script>
import InformationTileGridWrapper from "./informationtile/InformationTileGridWrapper.vue";
import NotificationList from "../../management/notification/NotificationList.vue";

import TileMeasurementPreview from "./informationtile/TileMeasurementPreview.vue";
import { GridStack } from "gridstack";
// import { TileTypes, NotificationContext } from "@/plugins/model/Enums.js";
import { NotificationContext } from "@/plugins/model/Enums.js";
// import "gridstack/dist/h5/gridstack-dd-native";
import "gridstack/dist/gridstack.min.css";

export default {
  name: "InformationPanel",
  components: {
    InformationTileGridWrapper,
    NotificationList,
    TileMeasurementPreview,
  },
  props: {
    panelData: {
      type: Object,
      default: () => null,
    },
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
    filter: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // conversionSettings: {
    //   type: Object,
    //   default: () => {
    //     return {};
    //   },
    // },
    edit: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["editTile", "update", "timeseries-update"],
  data() {
    return {
      loaded: false,
      grid: null,
      mSettings: this.computePanelSettings(this.settings, this.panel),
      reload: false,
      notificationDialog: false,
      selectedItem: null,
      mPanel: this.panel,
      mPanelData: null,
      notificationContext: NotificationContext.TILE,
      selectedTile: null,
    };
  },
  computed: {
    tiles: function () {
      // return this.panel != null ? this.panel.tiles : [];
      return this.mPanel != null ? this.mPanel.tiles : [];
    },
    // gridItems: function () {return this.grid != null ? this.grid.getGridItems() : []; },
  },
  watch: {
    panel: {
      handler: function (newValue) {
        this.mPanel = newValue;
        //translate standard labels
        this.setMeasurementLabels(this.mPanel);
        // this.reloadGrid();
        this.reload = !this.reload;
      },
      deep: false, //->newValue is modified in the handler
    },
    panelData: {
      handler: function (newValue) {
        console.debug("Panel data updated: " + (newValue != null));
        this.recalculateData(newValue);
        this.reload = !this.reload;
      },
      deep: true,
      immediate: true,
    },
    mSettings: {
      // handler(newVal) {
      handler(newVal, oldVal) {
        console.debug("Panel settings have changed - reload");
        console.debug(newVal);
        console.debug(oldVal);
        if (newVal != null && oldVal != null) {
          if (!oldVal.cellHeight && newVal.cellHeight) {
            console.debug("reload with cellheight");
            this.reload = !this.reload;
          }
        }
      },
      deep: true,
      immediate: false,
    },
  },
  async updated() {
    console.debug("update panel grid");
    this.reloadGrid();
  },
  convertData() {},
  async mounted() {
    console.debug("mounted panel grid");
    // console.debug(this.panelData != null);
    if (this.panelData != null) {
      this.recalculateData(this.panelData);
      this.reload = !this.reload;
    }
  },
  methods: {
    setMeasurementLabels(panel) {
      if (panel) {
        for (let t in panel.tiles) {
          for (let m in t.measurements) {
            this.$ren.utils.setMeasurementLabel(m);
          }
        }
      }
    },
    recalculateData(panelData) {
      if (panelData) {
        console.error("TODO: convert timeseries");
        console.debug(panelData);
        let mPanelData = JSON.parse(JSON.stringify(panelData));
        mPanelData = this.$ren.utils.calcPanelRelativeValues(this.mPanel, mPanelData, this.settings);
        mPanelData = this.$ren.utils.convertPanelData(this.mPanel, mPanelData, this.$store.getters["settings/conversion"]);
        // console.error(mPanelData);
        this.mPanelData = mPanelData;
        this.loaded = true;
        // this.reload = !this.reload;
      }
    },
    onTimeseriesUpdate(evt) {
      this.$emit("timeseries-update", evt);
    },
    reloadGrid() {
      if (this.grid != null) this.grid.destroy(false);
      let grid;
      if (this.mPanel && this.mPanelData) {
        grid = GridStack.init({ float: true, column: 12, cellHeight: "8vh", margin: 5 }, "#panel-grid-stack");
        // this.loaded = true;
        if (grid == null) {
          if (this.loaded) console.warn("Cannot find #panel-grid-stack, is panel:" + (this.mPanel != null) + ", is data:" + (this.paneldata != null));
          return;
        }
      } else {
        //data not loaded
        return;
      }
      console.debug("reloadGrid");
      // this.reload = !this.reload;
      if (this.locked) {
        grid.disable();
      } else {
        grid.enable();
      }
      grid.disable();
      this.mSettings.cellWidth = grid.el.clientWidth / grid.getColumn();
      this.mSettings.cellHeight = grid.el.clientHeight / grid.getRow();
      this.grid = grid;
    },

    gridWidth(tile) {
      return tile.col == null ? 2 : tile.col;
    },

    viewNotification(evt) {
      //TODO: load here notifications for tile
      this.selectedItem = evt;
      this.notificationDialog = true;
    },
    onPreview(tile) {
      this.$refs.dataPreview.open(tile);
    },
  },
};
</script>

<style lang="scss">
#panel-grid-stack {
  width: 100%;
  // margin: 1%;
  // position: absolute;
  // top: 0;
}
</style>
