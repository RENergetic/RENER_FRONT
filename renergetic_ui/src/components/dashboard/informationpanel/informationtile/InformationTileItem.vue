<template>
  <div :class="state" :style="style">
    <div class="flex flex-none flex-row align-items-center justify-content-center">
      <!-- <span v-if="icon != null" id="tileicon" :style="'background-image: url(' + icon + ')'"></span> -->
      <!-- {{ settings }}fff -->
      <!-- {{ measurement }} -->

      <span
        v-if="mSettings.tile.icon_visibility && mSettings.tile.icon"
        id="tileicon"
        class="flex flex-none flex-column align-items-center justify-content-center"
      >
        <!-- {{ settings.tile.icon }} -->
        <!-- :style="'background-image: url(' + settings.icon + ')'" -->
        <font-awesome-icon :icon="icon" />
      </span>
    </div>
    <div class="flex flex-grow-1 flex-column align-items-start justify-content-center message">
      <div class="flex flex-grow-1 align-items-center justify-content-center" style="width: 100%">
        <div v-tooltip="labelTooltip" class="flex flex-grow-1 message align-items-start">{{ label }}:</div>
        <div class="flex flex-none message align-items-end">{{ Math.round(value * 1000.0) / 1000.0 }} {{ unit }}</div>
      </div>
      <div v-if="measurement.description" class="flex">
        <div class="flex align-items-center justify-content-center">description: {{ measurement.description }}</div>
      </div>
    </div>
  </div>
  <!-- <div :class="state" :style="style">
    <span v-if="icon != null" id="tileicon" :style="'background-image: url(' + icon + ')'"></span>
    <span> {{ label }}: {{ Math.round(value, 2) }} {{ tileItem.type.unit }} </span>
    <div v-if="tileItem.description">description: {{ tileItem.description }}</div>
  </div> -->
</template>
<script>
import icons from "./icons";
export default {
  name: "InformationTileItem",
  components: {},
  props: {
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
    };
  },
  computed: {
    iconVisibility: function () {
      return (this.mSettings && this.mSettings.tile ? this.mSettings.tile.icon_visibility : true) && this.mSettings.tile.icon;
    },
    style: function () {
      let color = this.$ren.utils.measurementColor(this.measurement, this.value);
      return `background:${color.color};opacity:${color.alpha}`;
    },
    state: function () {
      let state;
      if (this.measurement.visible == null) state = true;
      else state = this.measurement.visible;
      if (state) {
        return "tileitem flex-grow-0 flex flex-row justify-content-start flex-wrap";
      }
      return "tileitem tileitem-hidden flex-grow-0 flex flex-row justify-content-start flex-wrap";
    },
    icon: function () {
      //todo: default

      let icon = this.measurement.domain ? this.measurement.domain : this.measurement.type.metric_type;
      if (this.measurement.measurement_details.icon != null) icon = this.measurement.measurement_details.icon;
      else if (this.measurement.type.icon != null) icon = this.measurement.type.icon;
      return icons[icon] != null ? icons[icon] : icons.default;
    },
    unit: function () {
      return this.$ren.utils.getUnit(this.measurement, this.settings.panel, this.conversionSettings);
    },

    value: function () {
      //todo support other aggregation functions
      try {
        if (this.mSettings.panel.relativeValues && this.measurement.type.base_unit != "%") {
          return (
            (this.pdata.current[this.measurement.aggregation_function][this.measurement.id] /
              this.pdata.max[this.measurement.aggregation_function][this.measurement.id]) *
            100.0
          );
        }
        return this.pdata.current[this.measurement.aggregation_function][this.measurement.id];
      } catch (e) {
        return null;
      }
      // this.pdata.current.last[m.id];
      // return this.pdata ? this.pdata[this.tileItem.id] : null;
    },
    assetStr: function () {
      let m = this.measurement;
      return m.asset ? (m.asset.label ? `- ${m.asset.label}` : `- ${m.asset.name}}`) : "";
    },
    measurementlabel: function () {
      if (this.measurement.label != null) {
        return this.measurement.label;
      } else {
        //TODO: translate it
        return this.measurement.name;
      }
    },
    label: function () {
      return `${this.measurementlabel}${this.assetStr}`;
    },
    labelTooltip: function () {
      let m = this.measurement;
      let directionStr = m.direction ? ` (${this.$t("enums.measurement_direction." + m.direction)})` : "";
      let assetStr = m.asset ? (m.asset.label ? `- ${m.asset.label} (${m.asset.name})` : `- ${m.asset.name}}`) : "";
      return `${this.measurementlabel}${assetStr}${directionStr}`;
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
  margin: 5px;
  padding: 5px;
  border-radius: 0.5rem;
  // margin-left: 1rem;
}
.tileitem-hidden {
  opacity: 0.6 !important;
}
</style>
