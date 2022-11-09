<template>
  <div v-if="tile" :class="tileClass" :style="background">
    <!-- {{ pdata }} -->
    <!-- {{ tile.props }} -->
    <div
      v-if="(titleVisible || tile.measurements.length == 0) && tile.label"
      class="flex flex-column justify-content-center"
      style="height: 100%"
    >
      <h3 style="margin: 0; text-align: center">{{ tile.label }}</h3>
    </div>
    <!-- {{ tile }} -->
    <KnobTile
      v-else-if="tile.type == 'knob'"
      :tile="tile"
      :pdata="pdata.data"
      :conversion-settings="conversionSettings"
    ></KnobTile>
    <DoughnutTile
      v-else-if="isDoughnut"
      :tile="tile"
      :pdata="pdata"
      :settings="mSettings"
      :conversion-settings="conversionSettings"
    ></DoughnutTile>
    <!-- <MultiDoughnutTile
        v-else-if="tile.type == 'multi_doughnut'"
        :tile="tile"
        :pdata="pdata":settings="mSettings"
      ></MultiDoughnutTile> -->
    <MultiKnobTile
      v-else-if="tile.type == 'multi_knob'"
      :tile="tile"
      :pdata="pdata"
      :settings="mSettings"
      :conversion-settings="conversionSettings"
    ></MultiKnobTile>
    <PanelTile
      v-else-if="tile.type == 'panel'"
      :tile="tile"
      :pdata="pdata"
      :conversion-settings="conversionSettings"
    ></PanelTile>
    <InformationTileSingle
      v-else-if="tile.type == 'single'"
      :tile="tile"
      :pdata="pdata"
      :settings="mSettings"
      :conversion-settings="conversionSettings"
    ></InformationTileSingle>
    <InformationListTile
      v-else
      :tile="tile"
      :pdata="pdata"
      :settings="mSettings"
      :conversion-settings="conversionSettings"
    ></InformationListTile>
  </div>
</template>
<script>
import InformationListTile from "./InformationListTile.vue";
import KnobTile from "./KnobTile.vue";
import DoughnutTile from "./DoughnutTile.vue";
import InformationTileSingle from "./InformationTileSingle.vue";
import MultiKnobTile from "./MultiKnobTile.vue";
import { TileTypes } from "@/plugins/model/Enums.js";
import icons from "./icons";
// import MultiDoughnutTile from "./MultiDoughnutTile.vue";
// const icons = {
//   heat: require(`../../../../assets/img/tileicons/heat.png`),
//   electricity: require(`../../../../assets/img/tileicons/electricity.png`),
//   battery: require(`../../../../assets/img/tileicons/battery.png`),
//   renewability: require(`../../../../assets/img/tileicons/battery.png`),
// };
//  Gas Station.

function validateTileSettings(tile, settings) {
  // console.info("icon for " + tile.props.icon + ": " + icons[tile.props.icon]);
  // console.info(icons[tile.props.icon]);
  // console.info(tile.props.icon);
  // console.info(icons);
  if (tile.props) {
    return {
      icon: icons[tile.props.icon],
      icon_visibility: tile.props.icon_visibility != null ? tile.props.icon_visibility : true,
      legend: tile.props.legend != null ? tile.props.legend : settings.legend,
      title_visibility:
        tile.props.title_visibility != null
          ? tile.props.title_visibility
          : settings.title_visibility != null
          ? settings.title_visibility
          : true,
      fontSize: settings.fontSize,
      background: tile.props.mask,
      template: tile.props.template,
    };
  }
  return settings;
  // tileSettings.legend = settings.legend != null ? settings.legend : true;
  // settings.title = settings.title != null ? settings.title : true;
  // settings.color = settings.color != null ? settings.color : "#d6ebff";
  // console.info(tile);
}

export default {
  name: "InformationTileData",
  components: {
    InformationListTile,
    KnobTile,
    DoughnutTile,
    InformationTileSingle,
    // MultiDoughnutTile,
    MultiKnobTile,
    PanelTile: () => import("./PanelTile.vue"),
  },
  props: {
    edit: { type: Boolean, default: false },
    tile: {
      type: Object,
      default: () => null,
    },
    pdata: {
      type: Object,
      default: () => null,
    },
    settings: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["edit", "notification"],
  data() {
    return {
      conversionSettings: this.$store.getters["settings/conversion"],
      mSettings: { tile: validateTileSettings(this.tile, this.settings), panel: this.settings },
    };
  },
  computed: {
    background: function () {
      return `background:${this.mSettings.tile.background}`;
    },
    tileClass: function () {
      return this.settings != null && !this.settings.center ? "flex tile_wrapper" : " flex tile_wrapper_center";
    },
    isDoughnut: function () {
      return this.tile != null && this.tile.type == TileTypes.doughnut;
    },

    titleVisible: function () {
      //default use/show title
      return this.settings == null || this.settings.title;
    },
    title: function () {
      return this.tile && this.tile.title != null ? this.tile.title : null;
    },
  },
  watch: {
    tile: {
      handler: function (newValue) {
        this.mSettings = validateTileSettings(newValue, this.settings);
      },
      deep: true,
    },
  },

  mounted() {},
  methods: {},
};
</script>
<style lang="scss">
.tile_wrapper {
  // display: flex;
  // align-content: center;
  // height: 100%;
  width: 100%;
  height: 100%;
  position: absolute;
}
.tile_wrapper_center {
  display: flex;
  align-content: center;
  // position: absolute;
  // height: 100%;
}
</style>
