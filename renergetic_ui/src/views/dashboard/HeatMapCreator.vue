<template>
  <!-- {{ heatmap }} -->
  <HeatMapEdit v-model="heatmap" @save="onSave" />
</template>
<script>
import HeatMapEdit from "@/components/dashboard/area/HeatMapEdit.vue";
import { HeatMap } from "../../plugins/model/HeatMap";

export default {
  name: "HeatMapCreator",
  components: { HeatMapEdit },
  props: {
    id: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      heatmap: null,
    };
  },
  created() {
    this.heatmap = new HeatMap();
  },
  mounted() {
    this.heatmap = new HeatMap();
  },
  methods: {
    onSave() {},

    async submit() {
      //todo: validate:
      await this.$ren.dashboardApi.addHeatMap(this.heatmap).then(() => {
        // dashoard.id = id;
        // this.$store.commit("view/dashboardsAdd", dashoard);
        // TODO: router back?
        this.$router.push(this.$route.meta.from);
      });
    },
  },
};
</script>

<style lang="scss">
#heatmap {
  max-width: 75%;
  max-height: 75vh;
}
#heatmapContainer {
  padding: 0.5rem;
}
</style>
