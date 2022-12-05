<template>
  <div :class="state" :style="style">
    <div class="flex flex-none flex-row align-items-center justify-content-center">
      <!-- <span v-if="icon != null" id="tileicon" :style="'background-image: url(' + icon + ')'"></span> -->
      <!-- {{ settings }}fff -->
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
        <div class="flex flex-grow-1 message align-items-start">{{ label }}:</div>
        <div class="flex flex-none message align-items-end">{{ Math.round(value * 1000.0) / 1000.0 }} {{ unit }}</div>
      </div>
      <div v-if="tileItem.description" class="flex">
        <div class="flex align-items-center justify-content-center">description: {{ tileItem.description }}</div>
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
    tileItem: {
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
      return (
        (this.mSettings && this.mSettings.tile ? this.mSettings.tile.icon_visibility : true) && this.mSettings.tile.icon
      );
    },
    style: function () {
      let color = this.$ren.utils.measurementColor(this.tileItem, this.value);
      return `background:${color.color};opacity:${color.alpha}`;
    },
    state: function () {
      let state;
      if (this.tileItem.visible == null) state = true;
      else state = this.tileItem.visible;
      if (state) {
        return "tileitem flex-grow-1 flex flex-row justify-content-start flex-wrap";
      }
      return "tileitem tileitem-hidden flex-grow-1 flex flex-row justify-content-start flex-wrap";
    },
    icon: function () {
      //todo: default

      let icon = this.tileItem.domain ? this.tileItem.domain : this.tileItem.type.metric_type;
      if (this.tileItem.measurement_details.icon != null) icon = this.tileItem.measurement_details.icon;
      else if (this.tileItem.type.icon != null) icon = this.tileItem.type.icon;
      // console.info(icon);
      return icons[icon] != null ? icons[icon] : icons.default;
    },
    unit: function () {
      return this.$ren.utils.getUnit(this.tileItem, this.settings.panel, this.conversionSettings);
    },

    value: function () {
      //todo support other aggregation functions
      try {
        if (this.mSettings.panel.relativeValues) {
          // return (
          //   ((this.tileItem.type.factor * this.pdata.current.last[this.tileItem.id]) /
          //     this.pdata.current.max[this.tileItem.id]) *
          //   100.0
          // );
          return (
            (this.pdata.current[this.tileItem.aggregation_function][this.tileItem.id] /
              this.pdata.current.max[this.tileItem.id]) *
            100.0
          );
        }
        return this.pdata.current[this.tileItem.aggregation_function][this.tileItem.id];
      } catch (e) {
        return null;
      }
      // this.pdata.current.last[m.id];
      // return this.pdata ? this.pdata[this.tileItem.id] : null;
    },
    label: function () {
      if (this.tileItem.label != null) {
        return this.tileItem.label;
      } else {
        //TODO: translate it
        return this.tileItem.name;
      }
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
