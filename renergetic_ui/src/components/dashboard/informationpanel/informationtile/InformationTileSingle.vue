<template>
  <div class="flex flex-column justify-content-center" style="height: 100%">
    <div
      v-if="settings.tile.icon_visibility && settings.tile.icon"
      id="tileicon"
      class="flex flex-none flex-column align-items-center justify-content-center"
    >
      <!-- {{ settings.tile.icon }} -->
      <!-- :style="'background-image: url(' + settings.icon + ')'" -->
      <font-awesome-icon :icon="settings.tile.icon" />
    </div>
    <div class="flex flex-none flex-column align-items-center justify-content-center">
      <span> {{ label }}</span>
      <span
        ><h2>{{ value }} {{ measurement.type.unit }}</h2></span
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
  },

  data() {
    let measurement = this.tile.measurements.length > 0 ? this.tile.measurements[0] : null;
    return {
      measurement: measurement,
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
