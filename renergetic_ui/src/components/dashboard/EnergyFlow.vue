<template>
  <!-- {{ settings }} -->
  <InformationPanel
    :edit="false"
    :panel="panel"
    :locked="locked"
    :settings="settings"
    :conversion-settings="conversionSettings"
    :asset-id="assetId"
  />
</template>

<script>
import InformationPanel from "@/components/dashboard/informationpanel/InformationPanel.vue";

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
    conversionSettings: {
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
  methods: {},
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
