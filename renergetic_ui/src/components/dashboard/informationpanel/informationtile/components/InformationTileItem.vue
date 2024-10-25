<template>
  <div :class="state" :style="style">
    <div v-if="iconVisibility" class="flex flex-none flex-row align-items-center justify-content-center">
      <span id="tileicon" class="flex flex-none flex-column align-items-center justify-content-center">
        <font-awesome-icon :icon="icon" />
      </span>
    </div>
    <div class="flex flex-grow-1 flex-column justify-content-center" style="font-size: 0.9em; padding: 0.33rem">
      <div class="flex flex-grow-1 align-items-center justify-content-center flex-row">
        <!-- .align-items-start -->
        <div v-tooltip="labelTooltip" class="flex-grow-1">{{ label }}</div>
        <!-- .align-items-end -->
        <div class="flex">
          <span class="flex-grow-1"> {{ $ren.utils.roundValue(value) }} {{ unit }}</span> <RenValueCompare :value-diff="prevDiff" />
        </div>
      </div>
      <div v-if="measurement.description" class="flex">
        <div class="flex align-items-center justify-content-center">{{ measurement.description }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import icons from "./icons";
export default {
  name: "InformationTileItem",
  components: {},
  props: {
    height: { type: Number, default: null },
    settings: { type: Object, default: () => ({}) },
    conversionSettings: { type: Object, default: () => ({}) },
    measurement: {
      type: Object,
      default: () => null,
    },
    idx: {
      type: Number,
      default: -1,
    },
    pdata: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      mSettings: this.settings,
      // measurement: this.getTileMeasurement(),
    };
  },
  computed: {
    iconVisibility: function () {
      return this.mSettings && this.mSettings.tile ? this.mSettings.tile.item_icon_visibility : true;
    },
    style: function () {
      let color = this.measurementColor; //this.$ren.utils.measurementColor(this.measurement, this.value);
      let height = this.height ? `height: max-content;max-height: ${this.height}%;` : "";
      return `background:${color.color};opacity:${color.alpha};color: set-text-color(${color.color});` + height;
    },
    state: function () {
      let state;
      if (this.measurement.visible == null) state = true;
      else state = this.measurement.visible;
      if (state) {
        return "tileitem flex-grow-0 flex flex-row justify-content-start "; // flex-wrap
      }
      return "tileitem tileitem-hidden flex-grow-0 flex flex-row justify-content-start"; // flex-wrap
    },
    icon: function () {
      //todo: default

      let icon = this.measurement.domain ? this.measurement.domain : this.measurement.type.metric_type;

      if (!this.measurement.measurement_details) {
        console.warn("no measurement details ");
        console.warn(this.measurement);
      }
      if (this.measurement.measurement_details && this.measurement.measurement_details.icon != null) icon = this.measurement.measurement_details.icon;
      else if (this.measurement.type.icon != null) icon = this.measurement.type.icon;
      return icons[icon] != null ? icons[icon] : icons.default;
    },
    unit: function () {
      return this.$ren.utils.getUnit(this.measurement, this.settings.panel, this.conversionSettings);
    },

    value: function () {
      return this.$ren.utils.getConvertedValue(this.measurement, this.pdata, this.mSettings);
    },
    prevDiff: function () {
      if (!this.mSettings.tile.compare_with_previous) {
        return null;
      }
      if (this.measurement == null) return null;
      return this.value - this.$ren.utils.getValue(this.measurement, this.pdata.previous);
    },
    assetStr: function () {
      let m = this.measurement;
      return m.asset ? (m.asset.label ? `${m.asset.label}` : `${m.asset.name}}`) : "";
    },
    measurementlabel: function () {
      let labelKey = `model.measurement.labels.${this.measurement.label}`;
      if (this.measurement.label != null && this.$te(labelKey)) {
        return this.$t(labelKey);
      }
      let nameKey = `enums.measurement_name.${this.measurement.name}`;
      if (this.$te(nameKey)) {
        return this.$t(nameKey);
      }
      if (this.measurement.label != null) {
        return this.measurement.label;
      }
      return this.measurement.name;
    },
    label: function () {
      let assetStr = this.assetStr ? `: ${this.assetStr}` : "";

      let label = `${this.measurementlabel}${assetStr}`;

      if (label.length < 36) {
        return label;
      }
      return label.substring(0, 33) + "...";
      // return label;
    },
    labelTooltip: function () {
      let aggFunc = this.$t("enums.measurement_aggregation." + this.measurement.aggregation_function);
      let m = this.measurement;
      let directionStr = m.direction ? ` (${this.$t("enums.measurement_direction." + m.direction)})` : "";
      let assetStr = m.asset ? (m.asset.label ? ` - ${m.asset.label} (${m.asset.name})` : ` - ${m.asset.name}}`) : "";
      return `${aggFunc}:${this.measurementlabel}${assetStr}${directionStr}`;
    },
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
span {
  display: inline-block;
}
// #tileicon {
//   width: 2.5rem;
//   height: 2.5rem;
//   // display: inherit;
//   background-size: 100%;
//   background-repeat: no-repeat;
//   background-position: center;
//   margin-right: 1rem;
// }
#tileicon {
  width: 2rem;
  height: 2rem;
  // left: 37.5%;
  // top: 37.5%;
  svg {
    height: 80%;
  }
}
.tileitem {
  border: gray 2px solid;
  background: gray;
  margin-top: 5px;
  padding: 0px;
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 0.25rem;
  // margin-left: 1rem;
}
.tileitem-hidden {
  opacity: 0.6 !important;
}
</style>
