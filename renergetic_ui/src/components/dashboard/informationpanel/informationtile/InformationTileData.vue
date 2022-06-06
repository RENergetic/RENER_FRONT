<template>
  <div v-if="tile">
    <h3 v-if="tile != null && tile.title != null">{{ tile.title }}</h3>

    <!-- {{ tile.type }} -->
    <KnobTile v-if="tile.type == 'knob'" :tile="tile" :pdata="pdata.data"></KnobTile>
    <DoughnutTile
      v-else-if="tile.type == 'doughnut'"
      :tile="tile"
      :pdata="pdata"
      :legend="settings.legend"
    ></DoughnutTile>
    <PanelTile v-else-if="tile.type == 'panel'" :tile="tile" :pdata="pdata"></PanelTile>
    <InformationListTile v-else :tile="tile" :pdata="pdata" :font-size="fontSize"></InformationListTile>
  </div>
</template>
<script>
import InformationListTile from "./InformationListTile.vue";
import PanelTile from "./PanelTile.vue";
import KnobTile from "./KnobTile.vue";
import DoughnutTile from "./DoughnutTile.vue";
// import Card from "primevue/card";
export default {
  name: "InformationTileData",
  components: { InformationListTile, KnobTile, DoughnutTile, PanelTile },
  props: {
    edit: { type: Boolean, default: false },
    tile: {
      type: Object,
      default: () => null,
    },
    pdata: {
      type: Object,
      default: () => null,
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
