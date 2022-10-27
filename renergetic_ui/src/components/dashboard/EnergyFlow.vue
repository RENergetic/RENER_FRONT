<template>
  <div id="energy-flow">
    ENERGY FLOW COMPONENT

    <!-- {{ panel }}
  {{ pdata }} -->
    <InformationPanelView
      :edit="editMode"
      :pdata="pData"
      :panel="panel"
      :locked="locked"
      :settings="settings"
      :asset-id="assetId"
      @edit="onEdit"
    />
    todo toggle relative
  </div>
</template>
<script>
import InformationPanelView from "./informationpanel/InformationPanelView";
export default {
  name: "EnergyFlow",
  components: {
    InformationPanelView,

    // dokonczyc,
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
    editMode: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update"],
  data() {
    return {
      grid: null,
      notificationDialog: false,
      editDialog: false,
      selectedItem: null,
      mPanel: this.panel,
      manageSensorsDialog: false,
      pData: {},
      // tileTypes: Object.entries(TileTypes).map((k) => {
      //   return { value: k[1], label: this.$t("enums.tile_type." + k[1]) };
      // }),
      // notificationContext: NotificationContext.TILE,
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
  async mounted() {
    await this.loadData();
    // this.reloadGrid();
  },
  // async updated() {
  // await this.loadData();
  // this.reloadGrid();
  // },
  methods: {
    async loadData() {
      if (this.panel.id != null) {
        let pData = await this.$ren.dataApi.getPanelData(this.panel.id, this.assetId, true).then((resp) => {
          if (resp) return resp["data"];
          return {};
        });
        //TODO: zrobić agregacje po heat_domain_direction_measurement_type
        // console.info(this.pdata);
        // for (let k in pData) {
        //   for (let valueId in pData[k]) {
        //     let min = 0.0;
        //     let max = 0;
        //     if (pData[valueId]["min"]) {
        //       min = pData[valueId]["min"];
        //     } else {
        //       pData[valueId]["min"] = 0.0;
        //     }
        //     max = pData[valueId]["max"];
        //     let diff = max - min;
        //     pData[valueId]["last"] = (pData[valueId]["last"] - min) / diff;
        //   }
        // }
        this.pData = pData;
      }
    },
  },
};
</script>

<style lang="scss">
#energy-flow {
  display: block;
  width: 100%;
  height: 100%;
  background: rgba(255, 0, 247, 0.463);
  font-size: 30 rem;
  padding: 10%;
}
</style>
