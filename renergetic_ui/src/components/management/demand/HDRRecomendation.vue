<template>
  <RenSpinner ref="spinner" :key="reloadChart" :lock="true" style="margin: auto; max-width: 95%">
    <template #content>
      <!-- {{ recommendationId }}{{ compareId }} -->
      <div v-if="pdata" style="width: 100%">
        <div v-for="(measurements, index) in mGroups" :key="index">
          <!-- :style="'margin:auto;max-width: 90%;'" -->
          <!-- :immediate="false" -->
          <MeasurementChart
            :ref="`mChart_${index}`"
            :pdata="{ timeseries: pdata }"
            :filter="filter"
            :style="mStyle"
            width="1200"
            height="500"
            :chart-type="chartType"
            :title-visible="true"
            :legend="true"
            :measurements="measurements"
          />
        </div>
      </div>
      <!-- {{ recommendationMeasurements }}  {{ recommendationCompareMeasurements }}  -->
      <!-- {{ mGroups }} -->
      <!-- {{ pdata }} -->
    </template>
  </RenSpinner>
</template>
<script>
import MeasurementChart from "@/components/dashboard/measurement/MeasurementChart.vue";
export default {
  name: "HDRRecomendation",
  components: { MeasurementChart },

  props: {
    recommendation: {
      type: Object,
      default: null,
    },
    comparewith: {
      type: Object,
      default: null,
    },
  },
  emits: ["reload"],
  data() {
    return {
      measurementGroups: [],
      recommendationMeasurements: [],
      recommendationCompareMeasurements: [],
      pdata: {},
      mDict: {},
      mGroups: [],
      reloadChart: false,
    };
  },
  computed: {
    recommendationId() {
      return this.recommendation ? this.recommendation.id : null;
    },
    compareId() {
      return this.comparewith ? this.comparewith.id : null;
    },
  },
  watch: {
    recommendation: {
      handler: async function () {
        await this.loadMeasurements();
        await this.loadData();
      },
      deep: true,
    },
    comparewith: {
      handler: async function () {
        await this.loadCompareMeasurements();
        await this.loadData();
      },
      deep: true,
    },
  },
  async mounted() {
    await this.loadMeasurements();
    await this.loadCompareMeasurements();
    await this.loadData();
  },
  methods: {
    measurementGroupKey(m) {
      let assetId = m.asset ? m.asset.id : "";
      return `${m.name}_${m.sensor_name}_${m.type.id}_${assetId}_${m.direction}_${m.domain}`;
    },
    async loadMeasurements() {
      if (this.recommendation) {
        this.recommendationMeasurements = await this.$ren.hdrApi.getRecommendationsMeasurements(this.recommendation.id);
        for (let m of this.recommendationMeasurements) {
          m.recommendation = this.recommendation.tag.value;
          m.label = `${m.recommendation}:${m.label ? m.label : m.name}`;
          if (m.measurement_details) {
            m.measurement_details.color = "#0044ff";
            m.measurement_details["fill_chart"] = false;
          } else {
            m.measurement_details = { fill_chart: false, color: "#0044ff" };
          }
        }
      }
    },
    async loadCompareMeasurements() {
      if (this.comparewith) {
        this.recommendationCompareMeasurements = await this.$ren.hdrApi.getRecommendationsMeasurements(this.comparewith.id);
        for (let m of this.recommendationCompareMeasurements) {
          m.recommendation = this.comparewith.tag.value;
          m.label = `${m.recommendation}:${m.label ? m.label : m.name}`;
          if (m.measurement_details) {
            m.measurement_details.color = "#90A4AE";
            m.measurement_details["fill_chart"] = false;
          } else {
            m.measurement_details = { fill_chart: false, color: "#90A4AE" };
          }
        }
      }
    },
    async loadData() {
      let mDict = {};
      let mGroups = {};
      if (this.recommendationMeasurements)
        for (let m of this.recommendationMeasurements) {
          mDict[m.id] = m;
        }
      if (this.recommendationCompareMeasurements)
        for (let m of this.recommendationCompareMeasurements) {
          mDict[m.id] = m;
        }
      this.mDict = mDict;
      let measurements = Object.values(mDict);
      for (let m of measurements) {
        let k = this.measurementGroupKey(m);
        if (!mGroups[k]) mGroups[k] = [];
        mGroups[k].push(m);
      }
      this.mGroups = Object.values(mGroups);
      console.info(measurements);
      //todo: filter last 24h and 24h ahead
      let filter = {};
      if (measurements.length > 0) {
        this.$refs.spinner.run(async () => {
          this.pdata = await this.$ren.dataApi.getMeasurementTimeseries(measurements, filter);
          this.reloadChart = !this.reloadChart;
        });
      }
    },

    reload() {
      this.$emit("reload");
    },
  },
};
</script>

<style lang="scss"></style>
