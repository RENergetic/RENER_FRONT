<template>
  <div>
    <div v-if="tile">
      <h3 v-if="tile != null && tile.title != null">{{ tile.title }}</h3>

      <KnobTile v-if="tile.type == 'knob'" :tile="tile" :pdata="pdata.data"></KnobTile>
      <DoughnutTile
        v-else-if="tile.type == 'doughnut'"
        :tile="tile"
        :pdata="pdata"
        :legend="settings.legend"
      ></DoughnutTile>
      <!-- <MultiDoughnutTile
        v-else-if="tile.type == 'multi_doughnut'"
        :tile="tile"
        :pdata="pdata"
        :legend="settings.legend"
      ></MultiDoughnutTile> -->
      <MultiKnobTile
        v-else-if="tile.type == 'multi_knob'"
        :tile="tile"
        :pdata="pdata"
        :legend="settings.legend"
      ></MultiKnobTile>
      <PanelTile v-else-if="tile.type == 'panel'" :tile="tile" :pdata="pdata"></PanelTile>
      <InformationListTile v-else :tile="tile" :pdata="pdata" :font-size="fontSize"></InformationListTile>
    </div>
  </div>
</template>
<script>
import InformationListTile from "./InformationListTile.vue";
import KnobTile from "./KnobTile.vue";
import DoughnutTile from "./DoughnutTile.vue";
import MultiKnobTile from "./MultiKnobTile.vue";
// import MultiDoughnutTile from "./MultiDoughnutTile.vue";
export default {
  name: "InformationTileData",
  components: {
    InformationListTile,
    KnobTile,
    DoughnutTile,
    // MultiDoughnutTile,
    MultiKnobTile,
    PanelTile: () => import("./PanelTile.vue"),
  },
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
  computed: {
    fontSize: function () {
      let size = this.settings != null && this.settings.fontSize != null ? this.settings.fontSize : 2.0;
      return `${size}rem`;
    },
  },
  // data() {
  //   return {};
  // },
  watch: {
    tile: {
      handler: function () {},
      deep: true,
    },
  },

  mounted() {},
  methods: {},
};
</script>
<style lang="scss"></style>
