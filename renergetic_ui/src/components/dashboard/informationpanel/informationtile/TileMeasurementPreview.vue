<template>
  <Dialog v-model:visible="dialog" :style="{ width: '90vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <!-- <InfoIcon :show-icon="false">
      <template #content> 
      </template>
    </InfoIcon> -->

    <!-- <Card>  <template #title> {{ $t("view.detailed_view_for_measurements") }} </template>
      <template #content> -->
    <div v-if="tile" :key="tile.id" class="grid">
      <BasicFilterSettings
        style="width: 100%; margin: auto; margin-top: 1rem"
        class="ren-card"
        :setting-key="'measurement'"
        :submit-button="false"
        :columns="3"
        :labels="false"
        @update="reloadSettings()"
      />
      <!-- {{ tile }} -->
      <!-- {{ tile.measurements }} -->
      <MeasurementChartList ref="dataPreview" :filter="filter" :chart-type="'scatter'" :measurements="tile.measurements" @on-load="onLoad()" />
    </div>
    <!-- </template>
    </Card> -->
  </Dialog>
</template>

<script>
// import InfoIcon from "@/components/miscellaneous/InfoIcon.vue";
import MeasurementChartList from "@/components/dashboard/measurement/MeasurementChartList.vue";
import BasicFilterSettings from "@/components/miscellaneous/settings/BasicFilterSettings.vue";

export default {
  name: "TileMeasurementPreview",
  components: {
    // InfoIcon,
    BasicFilterSettings,
    MeasurementChartList,
  },
  props: {},
  emits: ["reload", "onLoad"],
  data() {
    return {
      loaded: false,
      dialog: false,
      filter: this.$store.getters["settings/parsedFilter"]("measurement"),

      tile: null,
    };
  },
  methods: {
    async onLoad() {
      this.loaded = true;
      this.$emit("onLoad");
      await this.reload();
    },
    async reloadSettings() {
      this.filter = this.$store.getters["settings/parsedFilter"]("measurement");
      await this.reload();
    },
    async open(tile) {
      this.tile = tile;
      this.dialog = true;
    },
    async reload() {
      //TODO: filter
      if (!this.loaded) {
        return;
      }
      console.info("reload");
      await this.$refs.dataPreview.reload();

      this.$emit("reload");
    },
  },
};
</script>
<style scoped lang="scss"></style>
