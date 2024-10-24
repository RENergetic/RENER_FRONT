<template>
  <div v-if="mSettings" :class="tileClass">
    <!-- :style="background" -->
    <div class="tile-bar">
      <i v-if="tileDataPreview" v-tooltip="$t('view.measurements')" class="pi pi-chart-line data-preview tile-icon" @click="viewMeasurements()" />
      <i v-if="edit" v-tooltip="$t('view.edit')" class="pi pi-pencil tile-icon" @click="$emit('edit')" />
    </div>
    <!-- TODO: make propert empty tile
     titleVisible &&  || (titleVisible && tile.measurements.length == 0) && tile.type=='empty' && tile.label && tile.type != 'image' && tile.type != 'qrcode') -->
    <div v-if="tile.type == 'empty'" class="flex flex-column justify-content-center" style="height: 100%; width: 100%">
      <h3 :style="`margin: 0; text-align: center;color:${titleColor}`">{{ tile.label }}</h3>
    </div>
    <!--  register new tile  in enums  -->

    <KnobTile
      v-else-if="tile.type == 'knob'"
      :style="'width:100%'"
      :tile="tile"
      :pdata="pdata"
      :settings="mSettings"
      :conversion-settings="conversionSettings"
    ></KnobTile>
    <ImageTile
      v-else-if="tile.type == 'image'"
      :style="'width:100%'"
      :tile="tile"
      :pdata="pdata"
      :settings="mSettings"
      :conversion-settings="conversionSettings"
    />
    <QRCodeTile
      v-else-if="tile.type == 'qrcode'"
      :style="'width:100%'"
      :tile="tile"
      :pdata="pdata"
      :settings="mSettings"
      :conversion-settings="conversionSettings"
    />
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
    <InformationTileList
      v-else-if="tile.measurements && tile.measurements.length > 0"
      :style="'width:100%'"
      :tile="tile"
      :pdata="pdata"
      :settings="mSettings"
      :conversion-settings="conversionSettings"
    ></InformationTileList>
    <div v-else style="width: 100%">{{ $t("view.no_panel_measurements") }}</div>
  </div>
</template>
<script>
import InformationTileList from "./InformationTileList.vue";
import KnobTile from "./KnobTile.vue";
import DoughnutTile from "./DoughnutTile.vue";
import ChartTile from "./ChartTile.vue";
import InformationTileSingle from "./InformationTileSingle.vue";
import MultiKnobTile from "./MultiKnobTile.vue";
import { TileTypes } from "@/plugins/model/Enums.js";
import icons from "./components/icons";
import ImageTile from "./ImageTile.vue";
import QRCodeTile from "./QRCodeTile.vue";
// import MultiDoughnutTile from "./MultiDoughnutTile.vue";

function validateTileSettings(tile, panelSettings, ctx) {
  if (tile != null && tile.props) {
    return {
      ...tile.props,
      ...{
        label: ctx.$te(`enums.measurement_name.${tile.name}`) ? ctx.$t(`enums.measurement_name.${tile.name}`) : tile.label,
        icon: icons[tile.props.icon],
        icon_visibility: tile.props.icon_visibility != null ? tile.props.icon_visibility : true,
        item_icon_visibility: tile.props.item_icon_visibility != null ? tile.props.item_icon_visibility : true,
        legend: tile.props.legend != null ? tile.props.legend : panelSettings.legend,
        legend_label_color: tile.props.legend_label_color != null ? tile.props.legend_label_color : "#495057",
        chart_type: tile.props.chart_type != null ? tile.props.chart_type : panelSettings.chart_type,
        title_visibility:
          !ctx.demand &&
          (tile.props.title_visibility != null
            ? tile.props.title_visibility
            : panelSettings.title_visibility != null
            ? panelSettings.title_visibility
            : false),
        measurement_list: tile.props.measurement_list != null ? tile.props.measurement_list : true,
        measurement_background: tile.props.measurement_background != null ? tile.props.measurement_background : false,
        // title_color: tile.props.title_color != null ? tile.props.title_color : null,
        fontSize: panelSettings.fontSize,
        background_mask: tile.props.background_mask ? tile.props.background_mask : tile.props.mask,
        // background: tile.props.background,
        // template: tile.props.template,
        // knob_color: tile.props.knob_color,
        // qrcode_content: tile.props.qrcode_content,
        // img_url: tile.props.img_url,
        // measurement_color: tile.props.measurement_color,
        // aggregate_values: tile.props.aggregate_values,
      },
      // asset_id: settings.asset_id,
    };
  }
  return panelSettings;
}

export default {
  name: "InformationTile",
  components: {
    InformationTileList,
    KnobTile,
    ImageTile,
    QRCodeTile,
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
    return {
      conversionSettings: this.$store.getters["settings/conversion"],
      mSettings: { tile: validateTileSettings(this.tile, this.settings, this), panel: this.settings },
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
      return `background-color:${this.mSettings.tile.background}`;
    },
    tileClass: function () {
      return this.settings != null && !this.settings.center ? "flex tile_wrapper" : " flex tile_wrapper_center";
    },
    isDoughnut: function () {
      return this.tile != null && this.tile.type == TileTypes.doughnut;
    },

    titleVisible: function () {
      //default use/show title
      try {
        return !this.mSettings.tile || this.mSettings.tile.title_visibility;
      } catch {
        return true;
      }
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
  // font-size: 1.5rem;
  // position: absolute;
  // top: 0.5rem;
  // right: 0.5rem;
}
.tile-icon {
  margin-left: 0.25rem;
}
.tile-bar {
  i {
    font-size: 0.75rem;
  }
  font-size: 0.75rem;
  min-width: 5rem;
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  width: max-content;
  display: flex;
  flex-direction: row-reverse;
  opacity: 0.4;
}

.tile-bar:hover {
  i {
    font-size: 1.5rem;
  }
  // background: red;
  opacity: 1;
  z-index: 4444444;
}
.presentation-view .tile-bar {
  display: none;
}
.presentation-view .data-preview {
  display: none;
}
</style>
