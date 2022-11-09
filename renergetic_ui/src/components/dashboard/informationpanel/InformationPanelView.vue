<template>
  <div v-if="mPanel && mPData" id="panel-grid-stack" style="" class="grid-stack">
    <InformationTile
      v-for="(tile, index) in tiles"
      :key="tile.id"
      class="card-container"
      :slot-props="{ tile: tile, index: index }"
      :edit="edit"
      :pdata="mPData"
      :conversion-settings="conversionSettings"
      :settings="mSettings"
      @edit="$emit('editTile', { tile: tile, index: index })"
      @notification="viewNotification"
    />
  </div>
  <!-- dddddd {{ conversionSettings }}aaaaaaaaaa {{ mPData }}kk -->
  <Dialog
    v-model:visible="notificationDialog"
    :style="{ width: '50vw' }"
    :maximizable="true"
    :modal="true"
    :dismissable-mask="true"
  >
    <notification-list v-if="selectedItem" :context="notificationContext" :object-id="selectedItem.tile.id" />
  </Dialog>
</template>
<script>
import InformationTile from "./informationtile/InformationTile.vue";
import NotificationList from "../../management/notification/NotificationList.vue";
import { GridStack } from "gridstack";
// import { TileTypes, NotificationContext } from "@/plugins/model/Enums.js";
import { NotificationContext } from "@/plugins/model/Enums.js";
// import "gridstack/dist/h5/gridstack-dd-native";
import "gridstack/dist/gridstack.min.css";

function validateSettings(settings) {
  if (settings == null) {
    settings = {};
  }
  settings.legend = settings.legend != null ? settings.legend : true;
  // settings.title = settings.title != null ? settings.title : true;
  // settings.color = settings.color != null ? settings.color : "#d6ebff";
  let size = settings != null && settings.fontSize != null ? settings.fontSize : `${2.0}rem`;
  settings.fontSize = size;
  return settings;
}

export default {
  name: "InformationPanelView",
  components: {
    InformationTile,
    NotificationList,
  },
  props: {
    pdata: {
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
    conversionSettings: {
      type: Object,
      default: () => {
        return {};
      },
    },
    edit: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["editTile", "update"],
  data() {
    // console.info(this.pdata);
    return {
      grid: null,

      mSettings: validateSettings(this.settings),
      // loaded: false,
      notificationDialog: false,
      selectedItem: null,
      mPanel: this.panel,
      mPData: null,
      // tileTypes: Object.entries(TileTypes).map((k) => {
      //   return { value: k[1], label: this.$t("enums.tile_type." + k[1]) };
      // }),
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
    panel: {
      handler: function (newValue) {
        this.mPanel = newValue;
        this.reloadGrid();
      },
      deep: true,
    },
    pdata: {
      handler: function (newValue) {
        if (this.mSettings.relativeValues && newValue) {
          this.mPData = this.$ren.utils.calcPanelRelativeValues(this.mPanel, newValue, this.mSettings);
        } else {
          // console.info(newValue);
          this.mPData = this.$ren.utils.convertPanelData(this.mPanel, newValue, this.conversionSettings);
          console.info(this.mPData);
          console.info("wsswww");
        }

        // this.reloadGrid();
      },
      deep: true,
    },
    mSettings: {
      handler(newVal) {
        console.info("updcccaaaaaaaaaaate");
        if (newVal.relativeValues && this.pdata) {
          // this.mPData = this.pdata;
          this.mPData = this.$ren.utils.calcPanelRelativeValues(this.mPanel, this.pdata, newVal);
        } else {
          this.mPData = this.$ren.utils.convertPanelData(this.mPanel, this.pdata, this.conversionSettings);

          console.info(this.mPData);
          console.info("wwww");
        }
      },
      deep: true,
    },
    conversionSettings: {
      handler(newVal) {
        console.info("updcccate");
        if (newVal.relativeValues && this.pdata) {
          // this.mPData = this.pdata;
          this.mPData = this.$ren.utils.calcPanelRelativeValues(this.mPanel, this.pdata, this.mSettings);
        } else {
          // console.info(newVal);
          // console.info(this.mPData);

          this.mPData = this.$ren.utils.convertPanelData(this.mPanel, this.pdata, newVal);

          console.info(this.mPData);
          console.info("wwww");
        }
      },
      deep: true,
    },
  },
  async updated() {
    console.info("update");
    // // this.mPData = this.pdata;
    // // console.info(this.mSettings);

    // if (this.mSettings.relativeValues && this.pdata) {
    //   this.mPData = this.$ren.utils.calcPanelRelativeValues(this.mPanel, this.pdata, this.mSettings);
    //   // console.info(  this.mPData.data );
    //   // this.mPData.data = relativeData;
    // } else {
    //   console.info(this.pdata);
    //   // this.mPData = this.pdata;
    //   this.mPData = this.$ren.utils.convertPanelData(this.mPanel, this.pdata, this.conversionSettings);
    // }
    this.reloadGrid();
  },
  async mounted() {
    if (this.settings.relativeValues && this.pdata) {
      // this.mPData = this.pdata;
      this.mPData = this.$ren.utils.calcPanelRelativeValues(this.mPanel, this.pdata, this.settings);
    } else {
      // console.info(newVal);
      // this.mPData = this.pdata;
      this.mPData = this.$ren.utils.convertPanelData(this.mPanel, this.pdata, this.conversionSettings);
      console.info(this.mPData);
    }
    this.reloadGrid();
  },
  methods: {
    reloadGrid() {
      if (this.grid != null) this.grid.destroy(false);
      let grid = GridStack.init({ float: true, column: 12, cellHeight: "8vh", margin: 5 }, "#panel-grid-stack");

      if (this.locked) {
        grid.disable();
      } else {
        grid.enable();
      }
      grid.disable();
      this.mSettings.cellWidth = grid.el.clientWidth / 12;

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
