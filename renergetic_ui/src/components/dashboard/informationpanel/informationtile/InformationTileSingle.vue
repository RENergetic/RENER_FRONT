<template>
  <div class="flex flex-column justify-content-center" :style="tileStyle">
    <div
      v-if="mSettings.tile.icon_visibility && mSettings.tile.icon"
      id="tileicon"
      class="flex flex-none flex-column align-items-center justify-content-center"
    >
      <!-- {{ mSettings.tile.icon }} -->
      <font-awesome-icon :icon="mSettings.tile.icon" />
    </div>
    <div class="flex flex-none flex-column align-items-center justify-content-center">
      <span :style="color"> {{ label }} </span>
      <span :style="color"
        ><h2>{{ Math.round(value * 1000) / 1000.0 }} {{ unit }}</h2></span
      >
    </div>
  </div>
  <!-- {{ tile.props }} -->
  <!-- <div v-if="measurement.description">description: {{ measurement.description }}</div> -->
</template>
<script>
export default {
  name: "InformationTileSingle",
  props: {
    // edit: { type: Boolean, default: false },
    tile: {
      type: Object,
      default: () => ({}),
    },
    pdata: {
      type: Object,
      default: () => ({}),
    },

    settings: { type: Object, default: () => ({}) },
    conversionSettings: { type: Object, default: () => ({}) },
  },

  data() {
    let measurement = this.tile.measurements.length > 0 ? this.tile.measurements[0] : null;
    return {
      measurement: measurement,
      mSettings: this.settings,
    };
  },
  computed: {
    // icon: function () {
    //   //todo: default
    //   let icon = this.measurement.type.metric_type;
    //   if (this.measurement.measurement_details.icon != null) icon = this.measurement.measurement_details.icon;
    //   else if (this.measurement.type.icon != null) icon = this.measurement.type.icon;
    //   return this.icons[icon] != null ? this.icons[icon] : this.icons.default;
    // },

    unit: function () {
      if (this.mSettings.panel.relativeValues) {
        return "%";
      }
      let mt = this.conversionSettings[this.measurement.type.physical_name];

      return mt ? mt : this.measurement.type.unit;
    },
    color: function () {
      let color = this.$ren.utils.measurementColor(this.measurement, this.value);
      return `color:${color.color}`;
    },
    tileStyle: function () {
      let color = this.$ren.utils.measurementBackgroundColor(this.measurement, this.value);
      return `height: 100%;background:${color} `;
    },
    value: function () {
      //todo support other aggregation functions
      try {
        if (this.mSettings.panel.relativeValues) {
          return (this.pdata.current.last[this.measurement.id] / this.pdata.current.max[this.measurement.id]) * 100.0;
        }
        return this.pdata.current.last[this.measurement.id];
      } catch (e) {
        return null;
      }
    },
    label: function () {
      if (this.measurement.label != null) {
        return this.measurement.label;
      } else {
        //TODO: translate it
        return this.measurement.name;
      }
    },
  },

  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
span {
  float: left;
  width: 100%;
  text-align: center;
}
#tileicon {
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  width: 100%;
  // height: 4.5rem;
  height: 45%;
  svg {
    height: 100%;
  }
}

h2 {
  margin: 0;
}
</style>
