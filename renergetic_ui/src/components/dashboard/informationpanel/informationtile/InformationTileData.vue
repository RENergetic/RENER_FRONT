<template>
  <div v-if="tile" :class="tileClass">
    <h3 v-if="titleVisible && title">{{ title }}</h3>
    <!-- {{ pdata }} -->
    <div v-if="tile.measurements.length == 0" class="flex flex-column justify-content-center" style="height: 100%">
      <h3 style="margin: 0; text-align: center">{{ tile.label }}</h3>
    </div>
    <KnobTile v-else-if="tile.type == 'knob'" :tile="tile" :pdata="pdata.data"></KnobTile>
    <DoughnutTile v-else-if="isDoughnut" :tile="tile" :pdata="pdata" :settings="mSettings"></DoughnutTile>
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
    ></MultiKnobTile>
    <PanelTile v-else-if="tile.type == 'panel'" :tile="tile" :pdata="pdata"></PanelTile>
    <InformationTileSingle
      v-else-if="tile.type == 'single'"
      :tile="tile"
      :pdata="pdata"
      :settings="mSettings"
    ></InformationTileSingle>
    <InformationListTile v-else :tile="tile" :pdata="pdata" :settings="mSettings"></InformationListTile>
  </div>
</template>
<script>
import InformationListTile from "./InformationListTile.vue";
import KnobTile from "./KnobTile.vue";
import DoughnutTile from "./DoughnutTile.vue";
import InformationTileSingle from "./InformationTileSingle.vue";
import MultiKnobTile from "./MultiKnobTile.vue";
import { TileTypes } from "@/plugins/model/Enums.js";
// import MultiDoughnutTile from "./MultiDoughnutTile.vue";
const icons = {
  heat: require(`../../../../assets/img/tileicons/heat.png`),
  electricity: require(`../../../../assets/img/tileicons/electricity.png`),
  battery: require(`../../../../assets/img/tileicons/battery.png`),
  renewability: require(`../../../../assets/img/tileicons/battery.png`),
};
function validateSettings(tile, settings) {
  try {
    settings.icon = icons[tile.props.icon];
  } catch (Exception) {
    settings.icon = null;
  }

  if (settings == null) {
    settings = {};
  }
  settings.legend = settings.legend != null ? settings.legend : true;
  settings.title = settings.title != null ? settings.title : true;
  settings.color = settings.color != null ? settings.color : "#d6ebff";
  let size = settings != null && settings.fontSize != null ? settings.fontSize : `${2.0}rem`;
  settings.fontSize = size;
  return settings;
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
      mSettings: validateSettings(this.tile, this.settings),
    };
  },
  computed: {
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
        this.mSettings = validateSettings(newValue, this.settings);
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
