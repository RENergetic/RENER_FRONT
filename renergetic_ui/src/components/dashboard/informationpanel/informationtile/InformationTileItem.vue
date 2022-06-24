<template>
  <div>
    <div>
      <span v-if="icon != null" id="tileicon" :style="'background-image: url(' + icon + ')'"></span>
      <span> {{ label }}: {{ value }} {{ tileItem.type.unit }}</span>
    </div>
    <div v-if="tileItem.description">description: {{ tileItem.description }}</div>
  </div>
</template>
<script>
export default {
  name: "InformationTileItem",
  components: {},
  props: {
    tileItem: {
      type: Object,
      default: () => null,
    },
    pdata: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      icons: {
        battery: require(`../../../../assets/img/tileicons/battery.png`),
        renewability: require(`../../../../assets/img/tileicons/battery.png`),

        electricity: require(`../../../../assets/img/tileicons/electricity.png`),
        heat: require(`../../../../assets/img/tileicons/heat.png`),
      },
    };
  },
  computed: {
    icon: function () {
      //todo: default
      let icon = this.tileItem.type.metric_type;
      if (this.tileItem.measurement_details.icon != null) icon = this.tileItem.measurement_details.icon;
      else if (this.tileItem.type.icon != null) icon = this.tileItem.type.icon;
      return this.icons[icon] != null ? this.icons[icon] : this.icons.default;
    },
    value: function () {
      //todo support other aggregation functions
      try {
        return this.pdata.current.default[this.tileItem.id];
      } catch (e) {
        return null;
      }
      // this.pdata.current.default[m.id];
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

<style lang="scss">
span {
  display: inline-block;
}
#tileicon {
  width: 3rem;
  height: 3rem;
  // display: inherit;
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
