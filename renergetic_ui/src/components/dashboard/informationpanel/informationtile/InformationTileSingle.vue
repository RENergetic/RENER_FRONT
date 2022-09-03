<template>
  <div
    v-if="settings.icon != null && iconVisibility"
    id="tileicon"
    :style="'background-image: url(' + settings.icon + ')'"
  ></div>
  <div style="position: relative">
    <span> {{ label }}</span>
    <span
      ><h1>{{ value }} {{ measurement.type.unit }}</h1></span
    >
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
  },

  data() {
    let measurement = this.tile.measurements.length > 0 ? this.tile.measurements[0] : null;
    return {
      measurement: measurement,
      // icons: {
      //   battery: require(`../../../../assets/img/tileicons/battery.png`),
      //   renewability: require(`../../../../assets/img/tileicons/battery.png`),
      //   electricity: require(`../../../../assets/img/tileicons/electricity.png`),
      //   heat: require(`../../../../assets/img/tileicons/heat.png`),
      // },
    };
  },
  computed: {
    iconVisibility: function () {
      return this.tile.props.icon_visibility != null ? this.tile.props.icon_visibility : true;
    },
    icon: function () {
      //todo: default
      let icon = this.measurement.type.metric_type;
      if (this.measurement.measurement_details.icon != null) icon = this.measurement.measurement_details.icon;
      else if (this.measurement.type.icon != null) icon = this.measurement.type.icon;
      return this.icons[icon] != null ? this.icons[icon] : this.icons.default;
    },
    value: function () {
      //todo support other aggregation functions
      try {
        return this.pdata.current.last[this.measurement.id];
      } catch (e) {
        return null;
      }
      // this.pdata.current.last[m.id];
      // return this.pdata ? this.pdata[this.tileItem.id] : null;
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
  height: 5rem;
}
</style>
