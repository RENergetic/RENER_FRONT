<template>
  <div class="block">
    <h3 v-if="tile != null && tile.label != null">{{ tile.label }}</h3>

    <KnobTile v-if="tile.type == 'knob'" :tile="tile" :pdata="pdata.data"></KnobTile>

    <DoughnutTile
      v-else-if="tile.type == 'doughnut'"
      :tile="tile"
      :pdata="pdata"
      :legend="settings.legend"
    ></DoughnutTile>
    <InformationListTile v-else :tile="tile" :pdata="pdata" :font-size="fontSize"></InformationListTile>
  </div>
</template>
<script>
import InformationListTile from "./InformationListTile.vue";
import KnobTile from "./KnobTile.vue";
import DoughnutTile from "./DoughnutTile.vue";
// import Card from "primevue/card";
export default {
  name: "InformationTileData",
  components: { InformationListTile, KnobTile, DoughnutTile },
  props: {
    edit: { type: Boolean, default: false },
    tile: {
      type: Object,
      default: () => ({}),
    },
    pdata: {
      type: Object,
      default: () => ({}),
    },
    settings: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["edit", "notification"],
  // data() {
  //   return {};
  // },
  computed: {
    fontSize: function () {
      let size = this.settings != null && this.settings.fontSize != null ? this.settings.fontSize : 2.0;
      return `${size}rem`;
    },
  },

  mounted() {},
  methods: {},
};
</script>

<style lang="scss"></style>
