<template>
  <InformationPanel :edit="false" :panel="panel" :locked="locked" :settings="settings" :asset-id="assetId" />
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
    // conversionSettings: {
    //   type: Object,
    //   default: () => {
    //     return {};
    //   },
    // },
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
    // tiles: function () {
    //   // return this.panel != null ? this.panel.tiles : [];
    //   return this.mPanel != null ? this.mPanel.tiles : [];
    // },
    // gridItems: function () {
    //   return this.grid != null ? this.grid.getGridItems() : [];
    // },
  },
  watch: {
    // manageSensorsDialog: function (newValue) {
    //   if (!newValue) {
    //     this.mPanel.tiles[this.selectedItem.index] = this.selectedItem.tile;
    //   }
    // },
    // panel: {
    //   handler: function (newValue) {
    //     this.mPanel = newValue;
    //     this.reloadGrid();
    //   },
    //   deep: true,
    // },
  },
  mounted() {
    // console.info(JSON.stringify(this.panel));
  },

  methods: {},
};
</script>

<style lang="scss"></style>
