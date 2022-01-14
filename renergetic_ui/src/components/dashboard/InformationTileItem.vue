<template>
  <div>
    {{ tileItem }}
    <div>
      <span> value: {{ tileItem.value }} {{ tileItem.unit }}</span>
      <span
        v-if="tileItem.icon != null"
        id="tileicon"
        :style="'background-image: url(' + icons[tileItem.icon] + ')'"
      ></span>
    </div>
    <div>description {{ tileItem.description }}</div>
  </div>
</template>
<script>
// import { TileItem } from "../../plugins/model/TileItem";
//icons: heat,electricity, battery
export default {
  name: "InformationTileItem",
  components: {},
  props: {
    tileItem: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      icons: {
        battery: require(`../../assets/img/tileicons/battery.png`),
        electricity: require(`../../assets/img/tileicons/electricity.png`),
        heat: require(`../../assets/img/tileicons/heat.png`),
      },
    };
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
  width: 1rem;
  height: 1rem;
  // display: inherit;
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
