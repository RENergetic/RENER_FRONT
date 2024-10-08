<template>
  <Dialog v-model:visible="dataDialog" :style="{ width: '90vw' }" :modal="true" :dismissable-mask="true">
    <div v-if="mMeasurement">
      <MeasurementChart
        :key="mMeasurement.id"
        ref="chart"
        :filter="filter"
        :style="'margin:auto;max-width: 90%;'"
        :width="1200"
        :height="500"
        :measurements="[mMeasurement]"
      />
      <BasicFilterSettings
        style="width: 100%; margin: auto; margin-top: 1rem"
        class="ren-card"
        :setting-key="'measurement'"
        :submit-button="false"
        :columns="3"
        :labels="false"
        @update="reloadSettings()"
      />
    </div>
  </Dialog>
</template>
<script>
import MeasurementChart from "@/components/dashboard/measurement/MeasurementChart.vue";
import BasicFilterSettings from "@/components/miscellaneous/settings/BasicFilterSettings.vue";
export default {
  name: "MeasurementChartDialog",
  components: { BasicFilterSettings, MeasurementChart },
  props: {
    masurement: { type: Object, default: null },
    // filter: {
    //   type: Object,
    //   default: () => {
    //     return {};
    //   },
    // },
  },
  emits: ["update:measurement"],
  data() {
    return {
      dataDialog: false,
      filter: null,
      mMeasurement: this.measurement,
    };
  },

  async mounted() {},
  methods: {
    async show() {
      await this.$ren.managementApi.getMeasurementProperties(this.mMeasurement.id).then((details) => {
        this.mMeasurement.measurement_details = details;
      });
      this.dataDialog = true;
    },
    async showMeasurement(measurement) {
      await this.$ren.managementApi.getMeasurementProperties(measurement.id).then((details) => {
        measurement.measurement_details = details;
      });
      this.mMeasurement = measurement;
      this.$emit("update:measurement", measurement);
      this.dataDialog = true;
    },
    reloadSettings() {
      this.filter = this.$store.getters["settings/parsedFilter"]("measurement");
      // this.conversionSettings = this.$store.getters["settings/conversion"];
    },
  },
};
</script>

<style lang="scss"></style>
