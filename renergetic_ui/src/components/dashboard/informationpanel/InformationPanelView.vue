<template>
  <div v-if="mPanel && mPData" id="panel-grid-stack" style="" class="grid-stack">
    <!-- {{ mSettings }} -->
    <InformationTile
      v-for="(tile, index) in tiles"
      :key="tile.id"
      class="card-container"
      :slot-props="{ tile: tile, index: index }"
      :edit="edit"
      :pdata="mPData"
      :settings="mSettings"
      @edit="$emit('editTile', { tile: tile, index: index })"
      @notification="viewNotification"
    />
  </div>

  <Dialog v-model:visible="notificationDialog" :style="{ width: '50vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <notification-list v-if="selectedItem" :context="notificationContext" :object-id="selectedItem.tile.id" />
  </Dialog>
</template>
<script>
import InformationTile from "./informationtile/InformationTile.vue";
import NotificationList from "../../management/notification/NotificationList.vue";
import { GridStack } from "gridstack";
// import { TileTypes, NotificationContext } from "@/plugins/model/Enums.js";
import { NotificationContext, RenRoles } from "@/plugins/model/Enums.js";
// import "gridstack/dist/h5/gridstack-dd-native";
import "gridstack/dist/gridstack.min.css";
let role = RenRoles.REN_ADMIN | RenRoles.REN_MANAGER | RenRoles.REN_TECHNICAL_MANAGER;

function validateSettings(settings, panel, ctx) {
  let mSettings = {};
  if (settings == null) {
    mSettings = {};
  } else {
    mSettings = settings;
  }
  if (panel.props) {
    let props = panel.props;
    let overrideMode = props.overrideMode;
    if (role & ctx.$store.getters["auth/renRole"] && mSettings.ignoreOverrideMode) {
      // alert("");
      mSettings = { ...panel.props, ...mSettings };
    } else
      switch (overrideMode) {
        case "fixed":
          mSettings = panel.props;
          break;
        case "override":
          mSettings = { ...mSettings, ...panel.props };
          break;
        case "default":
        default:
          mSettings = { ...panel.props, ...mSettings };
          break;
      }
  }
  // mSettings.legend = mSettings.legend != null ? mSettings.legend : true;
  mSettings.legend = mSettings.legend != null ? mSettings.legend : false;
  // settings.title = settings.title != null ? settings.title : true;
  // settings.color = settings.color != null ? settings.color : "#d6ebff";
  let size = mSettings != null && mSettings.fontSize != null ? mSettings.fontSize : `${2.0}rem`;
  mSettings.fontSize = size;
  return mSettings;
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
  emits: ["editTile", "update"],
  data() {
    return {
      grid: null,

      mSettings: validateSettings(this.settings, this.panel, this),
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
          this.mPData = this.$ren.utils.convertPanelData(this.mPanel, newValue, this.$store.getters["settings/conversion"]);
          this.mPData = this.$ren.utils.calcPanelRelativeValues(this.mPanel, this.mPData, this.mSettings);
        } else {
          console.info("watch pdata");
          this.mPData = this.$ren.utils.convertPanelData(this.mPanel, newValue, this.$store.getters["settings/conversion"]);
        }
        // this.reloadGrid();
      },
      deep: true,
    },
    mSettings: {
      handler(newVal) {
        console.info("watch mSettings");
        if (newVal.relativeValues && this.pdata) {
          // this.mPData = this.pdata;
          this.mPData = this.$ren.utils.convertPanelData(this.mPanel, this.pdata, this.$store.getters["settings/conversion"]);
          this.mPData = this.$ren.utils.calcPanelRelativeValues(this.mPanel, this.mPData, newVal);
        } else {
          this.mPData = this.$ren.utils.convertPanelData(this.mPanel, this.pdata, this.$store.getters["settings/conversion"]);
        }
      },
      deep: true,
    },
  },
  async updated() {
    console.info("update panel grid");
    this.reloadGrid();
  },
  convertData() {},
  async mounted() {
    if (this.pdata != null) {
      if (this.settings.relativeValues && this.pdata) {
        this.mPData = this.$ren.utils.convertPanelData(this.mPanel, this.pdata, this.$store.getters["settings/conversion"]);
        this.mPData = this.$ren.utils.calcPanelRelativeValues(this.mPanel, this.mPData, this.settings);
      } else {
        this.mPData = this.$ren.utils.convertPanelData(this.mPanel, this.pdata, this.$store.getters["settings/conversion"]);
      }
      this.reloadGrid();
    }
  },
  methods: {
    reloadGrid() {
      if (this.grid != null) this.grid.destroy(false);
      let grid = GridStack.init({ float: true, column: 12, cellHeight: "8vh", margin: 5 }, "#panel-grid-stack");
      if (grid == null) {
        console.warn("Cannot find #panel-grid-stack, is panel:" + (this.mPanel != null) + ", is data:" + (this.pdata != null));
        return;
      }
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
