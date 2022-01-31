<template>
  <div><HeatMapViewComponent :heat-map="heatmap"></HeatMapViewComponent></div>
</template>
<script>
import { HeatMapView as HeatMapViewComponent } from "../../components/dashboard/HeatMapView.vue";

//initial canvas size
// const sceneWidth = 900;
// const sceneHeight = 450;

export default {
  name: "HeatMapView",
  components: { HeatMapViewComponent },
  data() {
    return { heatmap: null };
  },
  async created() {
    this.$ren.dashboardApi
      .getHeatMap(this.$route.params.id)
      .then((heatmap) => {
        this.heatmap = heatmap;
      })
      .catch((e) => {
        this.$toast.add({
          severity: "error",
          summary: this.$t("view.toast.get_heatmap", {
            label: this.label,
            error: e,
          }),
          life: 3000,
        });
      });
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss"></style>
