<template>
  <div v-for="m in measurements" :key="m.id" class="col-12 md:col-10 xl:col-6" style="max-height: 50vh; max-width: 40vw">
    <!-- :style="'margin:auto;max-width: 90%;'" -->
    <MeasurementChart
      :ref="`mChart_${m.id}`"
      :immediate="false"
      :filter="filter"
      :style="mStyle"
      :width="1200"
      :height="500"
      :chart-type="chartType"
      :title-visible="true"
      :legend="true"
      :measurements="[m]"
    />
  </div>
</template>

<script>
import MeasurementChart from "@/components/dashboard/measurement/MeasurementChart.vue";

export default {
  name: "MeasurementChartList",
  components: {
    MeasurementChart,
  },
  props: {
    measurements: { type: Array, required: true },
    filter: { type: Object, required: true },
    chartType: { type: String, default: "scatter" },
  },
  emits: ["reload", "onLoad"],
  data() {
    return {
      // mName: this.measurement.label ? `${this.measurement.label} (${this.measurement.name})` : this.measurement.name,
      loaded: false,
      mStyle: "max-width: 80rem;max-height:40rem; margin: auto;height:100%;width:100%; ",
    };
  },
  computed: {},
  watch: {},
  updated() {
    if (!this.loaded) {
      console.info(this.measurements);
      this.$emit("onLoad");
      this.loaded = true;
    }
  },
  mounted() {
    if (!this.loaded) {
      console.info(this.measurements);
      this.loaded = true;
      this.$emit("onLoad");
    }
  },
  methods: {
    async reload() {
      //TODO: filter
      console.info(this.loaded);
      if (!this.loaded) return;
      console.info("reload");
      for (let m of this.measurements) {
        let refId = `mChart_${m.id}`;
        await this.$refs[refId][0].reload();
      }
      this.$emit("reload");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
