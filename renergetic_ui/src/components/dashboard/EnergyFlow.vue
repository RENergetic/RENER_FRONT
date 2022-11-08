<template>
  <!-- {{ settings }} -->
  <InformationPanel
    :edit="false"
    :pdata="pData"
    :panel="panel"
    :locked="locked"
    :settings="settings"
    :asset-id="assetId"
  />
</template>

<script>
import InformationPanel from "@/components/dashboard/informationpanel/InformationPanel.vue";
// import InformationPanelView from "./informationpanel/InformationPanelView";
// let testNot = [
//   {
//     id: 2,
//     type: "warning",
//     icon: "electricity",
//     asset: {
//       id: 3,
//     },
//     message: "THe energy island currently consumes  30%  more energy than it it produces locally!",
//     date_from: 1646082303,
//     date_to: 1646182303,
//   },
//   {
//     id: 4,
//     type: "warning",
//     icon: "electricity",
//     asset: {
//       id: 5,
//     },
//     message: "The energy island currently consumes  30%  more energy than it it produces locally!!!",
//     date_from: 1646082303,
//     date_to: 1646182303,
//   },
// ];
// if (Math.random() > 0.45) {
//   testNot = [testNot[0]];
// }
export default {
  name: "EnergyFlow",
  components: {
    InformationPanel,
  },
  props: {
    assetId: {
      type: Number,
      default: null,
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
  },
  emits: ["update"],
  data() {
    return {
      grid: null,
      notificationDialog: false,
      // mNotifications: testNot,
      locked: false,
      editMode: false,
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
  // async mounted() {
  //   await this.loadData();
  //   // this.reloadGrid();
  // },
  // async updated() {
  // await this.loadData();
  // this.reloadGrid();
  // },
  methods: {
    // async loadData() {
    //   if (this.panel.id != null) {
    //     let pData = await this.$ren.dataApi.getPanelData(this.panel.id, this.assetId).then((resp) => {
    //       if (resp) return resp["data"];
    //       return {};
    //     });
    //     this.pData = pData;
    //   }
    // },
  },
};
</script>

<style lang="scss">
// #energy-flow {
//   display: block;
//   width: 100%;
//   height: 100%;
//   background: rgba(255, 0, 247, 0.463);
//   font-size: 30 rem;
//   padding: 10%;
// }
</style>
