<template>
  <div :class="state" :style="style">
    <span v-if="icon != null" id="tileicon" :style="'background-image: url(' + icon + ')'"></span>
    <span> {{ label }}: {{ Math.round(value, 2) }} {{ tileItem.type.unit }} </span>
    <div v-if="tileItem.description">description: {{ tileItem.description }}</div>
  </div>
</template>
<script>
export default {
  name: "InformationTileItem",
  components: {},
  props: {
    settings: { type: Object, default: () => ({}) },
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
      icons: {
        battery: require(`../../../../assets/img/tileicons/battery.png`),
        renewability: require(`../../../../assets/img/tileicons/battery.png`),

        electricity: require(`../../../../assets/img/tileicons/electricity.png`),
        heat: require(`../../../../assets/img/tileicons/heat.png`),
      },
    };
  },
  computed: {
    style: function () {
      let color = this.$ren.utils.measurementColor(this.tileItem, this.value);
      return `background:${color.color};opacity:${color.alpha}`;
    },
    state: function () {
      let state;
      if (this.tileItem.visible == null) state = true;
      else state = this.tileItem.visible;
      if (state) {
        return "tileitem";
      }
      return "tileitem tileitem-hidden";
    },
    icon: function () {
      //todo: default
      let icon = this.tileItem.domain ? this.tileItem.domain : this.tileItem.type.metric_type;
      if (this.tileItem.measurement_details.icon != null) icon = this.tileItem.measurement_details.icon;
      else if (this.tileItem.type.icon != null) icon = this.tileItem.type.icon;
      return this.icons[icon] != null ? this.icons[icon] : this.icons.default;
    },
    value: function () {
      //todo support other aggregation functions
      try {
        return this.pdata.current.last[this.tileItem.id];
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
.tileitem {
  border: gray 2px solid;
  background: gray;
  margin: 5px;
  padding: 5px;
  margin-left: 1rem;
  margin-right: 1rem;
}
.tileitem-hidden {
  opacity: 0.6 !important;
}
</style>
