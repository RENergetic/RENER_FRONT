<template>
  <div>
    <div>{{ tileItem.value }} {{ tileItem.unit }}</div>
    <div
      v-if="tileItem.icon != null"
      id="tileicon"
      :style="
        'background-image: url(\'../../assets/' + tileItem.icon + '.png\')'
      "
    ></div>
    <div>{{ tileItem.description }}</div>
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
      default: null,
    },
  },
  // data() {
  //   return {};
  // },

  mounted() {},
  methods: {},
};
</script>

<style lang="scss">
#tileicon {
  width: 1rem;
  height: 1rem;
  display: inherit;
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
