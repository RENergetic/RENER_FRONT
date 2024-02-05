<template>
  <div v-if="mSettings" :class="tileClass" :style="background">
    <i v-if="tileDataPreview" v-tooltip="$t('view.measurements')" class="pi pi-chart-line data-preview" @click="viewMeasurements()" />

    <!-- {{ tile.measurements.map((it) => it.measurement_details) }}
    {{ tile.measurements.map((it) => it.type.color) }} -->
    <!-- {{ filter }} -->
    <div
      v-if="(titleVisible || tile.measurements.length == 0) && tile.label"
      class="flex flex-column justify-content-center"
      style="height: 100%; width: 100%"
    >
      <h3 :style="`margin: 0; text-align: center;color:${titleColor}`">{{ tile.label }}</h3>
    </div>

    <KnobTile
      v-else-if="tile.type == 'knob'"
      :style="'width:100%'"
      :tile="tile"
      :pdata="pdata"
      :settings="mSettings"
      :conversion-settings="conversionSettings"
    ></KnobTile>

    <ChartTile
      v-else-if="tile.type == 'chart'"
      :style="'width:100%'"
      :tile="tile"
      :pdata="pdata"
      :settings="mSettings"
      :filter="filter"
      :conversion-settings="conversionSettings"
      @timeseries-update="onTimeseriesUpdate"
    />

    <DoughnutTile
      v-else-if="isDoughnut"
      :style="'width:100%'"
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
      :style="'width:100%'"
      :tile="tile"
      :pdata="pdata"
      :settings="mSettings"
      :conversion-settings="conversionSettings"
    />
    <PanelTile
      v-else-if="tile.type == 'panel'"
      :style="'width:100%'"
      :tile="tile"
      :pdata="pdata"
      :settings="mSettings"
      :conversion-settings="conversionSettings"
      @timeseries-update="onTimeseriesUpdate"
    ></PanelTile>
    <InformationTileSingle
      v-else-if="tile.type == 'single'"
      :style="'width:100%'"
      :tile="tile"
      :pdata="pdata"
      :settings="mSettings"
      :conversion-settings="conversionSettings"
    ></InformationTileSingle>
    <InformationListTile
      v-else-if="tile.measurements && tile.measurements.length > 0"
      :style="'width:100%'"
      :tile="tile"
      :pdata="pdata"
      :settings="mSettings"
      :conversion-settings="conversionSettings"
    />
    <div v-else style="width: 100%">{{ $t("view.no_panel_measurements") }}</div>
  </div>
</template>
<script>
import InformationListTile from "./InformationListTile.vue";
import KnobTile from "./KnobTile.vue";
import DoughnutTile from "./DoughnutTile.vue";
import ChartTile from "./ChartTile.vue";
import InformationTileSingle from "./InformationTileSingle.vue";
import MultiKnobTile from "./MultiKnobTile.vue";
import { TileTypes } from "@/plugins/model/Enums.js";
import icons from "./icons";
// import MultiDoughnutTile from "./MultiDoughnutTile.vue";

function validateTileSettings(tile, settings, ctx) {
  if (tile.props) {
    return {
      label: ctx.$te(`enums.measurement_name.${tile.name}`) ? ctx.$t(`enums.measurement_name.${tile.name}`) : tile.label,
      icon: icons[tile.props.icon],
      icon_visibility: tile.props.icon_visibility != null ? tile.props.icon_visibility : true,
      legend: tile.props.legend != null ? tile.props.legend : settings.legend,
      legend_label_color: tile.props.legend_label_color != null ? tile.props.legend_label_color : "#495057",
      chart_type: tile.props.chart_type != null ? tile.props.chart_type : settings.chart_type,
      title_visibility:
        !ctx.demand &&
        (tile.props.title_visibility != null ? tile.props.title_visibility : settings.title_visibility != null ? settings.title_visibility : true),
      measurement_list: tile.props.measurement_list != null ? tile.props.measurement_list : true,
      measurement_background: tile.props.measurement_background != null ? tile.props.measurement_background : false,
      title_color: tile.props.title_color != null ? tile.props.title_color : null,
      fontSize: settings.fontSize,
      background_mask: tile.props.mask,
      background: tile.props.background,
      template: tile.props.template,
      knob_color: tile.props.knob_color,
      // asset_id: settings.asset_id,
    };
  }
  return settings;
}

export default {
  name: "InformationTile",
  components: {
    InformationListTile,
    KnobTile,
    DoughnutTile,
    InformationTileSingle,
    ChartTile,
    // MultiDoughnutTile,
    MultiKnobTile,
    PanelTile: () => import("./PanelTile.vue"),
  },
  props: {
    tilePreview: { type: Boolean, default: true },
    edit: { type: Boolean, default: false },
    //Determines if it is wrapped by demand/recommendation compoent
    demand: { type: Boolean, default: false },
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
    filter: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  emits: ["edit", "notification", "timeseries-update", "preview-tile"],
  data() {
    console.info(this.settings);
    return {
      conversionSettings: this.$store.getters["settings/conversion"],
      mSettings: this.mSettings,
    };
  },
  computed: {
    titleColor: function () {
      return this.tileTitleColor;
    },
    tileDataPreview: function () {
      try {
        return this.tilePreview && this.tile.measurements.length > 0;
      } catch {
        return false;
      }
    },
    background: function () {
      return `background-color:${this.mSettings.tile.background_mask}`;
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
        this.mSettings = { tile: validateTileSettings(newValue, this.settings, this), panel: this.settings };
      },
      deep: true,
    },
  },
  beforeCreate() {
    this.mSettings = { tile: validateTileSettings(this.tile, this.settings, this), panel: this.settings };
  },

  mounted() {},
  methods: {
    onTimeseriesUpdate(evt) {
      this.$emit("timeseries-update", evt);
    },
    viewMeasurements() {
      this.$emit("preview-tile", this.tile);
    },
  },
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

.demand-box {
  .tile_wrapper {
    padding: 0.5rem;
  }
}
.tile_wrapper #tileicon path,
.tile_wrapper .tileicon path {
  stroke: $ren-primary-border-color;
  stroke-width: 10;
  stroke-linejoin: round;
}
.data-preview {
  font-size: 1.5rem;
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
</style>
