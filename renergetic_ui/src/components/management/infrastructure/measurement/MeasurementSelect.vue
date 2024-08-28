<template>
  <RenSpinner ref="spinner" :lock="true" style="min-width: 100%">
    <template #content>
      <div style="z-index: 1001">
        <!-- {{ mFilters }} -->
        <measurement-list
          v-model:filters="mFilters"
          :measurement-list="measurementList"
          :basic="true"
          @select="onSelect"
          @reload="loadMeasurements"
        />
      </div>
      <div style="position: sticky; bottom: 0; z-index: 999; padding-bottom: 0.5rem">
        <ren-submit v-if="selectedMeasurement != null" @submit="submit" />
      </div>
    </template>
  </RenSpinner>
</template>
<script>
import MeasurementList from "@/components/management/infrastructure/measurement/MeasurementList.vue";
export default {
  name: "MeasurementSelect",
  components: {
    MeasurementList,
  },
  props: {
    filters: { type: Object, default: null },
    selectedMeasurements: { type: [Array, Object], default: null },
    asset: { type: Object, default: null },
  },
  emits: ["select"],
  data() {
    //tODO: filter tempId or match dynamic measurements here ?
    let mSelectedMeasurements;
    if (typeof this.selectedMeasurements == Array)
      mSelectedMeasurements = this.selectedMeasurements ? Object.fromEntries(this.selectedMeasurements.map((m) => [m.id ? m.id : m.tempId, m])) : [];
    else {
      mSelectedMeasurements = this.selectedMeasurements;
    }
    return {
      mSelectedMeasurements: mSelectedMeasurements,
      mFilters: this.filters ? JSON.parse(JSON.stringify(this.filters)) : null,
      measurementList: [],
      selectedMeasurement: null,
    };
  },

  watch: {
    mFilters: {
      handler: function () {
        this.loadMeasurements();
      },
      deep: true,
    },
  },
  mounted() {
    if (typeof this.selectedMeasurements == Array)
      this.mSelectedMeasurements = this.selectedMeasurements
        ? Object.fromEntries(this.selectedMeasurements.map((m) => [m.id ? m.id : m.tempId, m]))
        : [];
    else {
      this.mSelectedMeasurements = this.selectedMeasurements;
    }
    this.loadMeasurements();
  },
  methods: {
    onSelect(evt) {
      this.selectedMeasurement = evt;
    },
    submit() {
      this.$emit("select", this.selectedMeasurement);
    },
    async loadMeasurements(evt) {
      let offset = 0;
      let limit = 25;
      if (evt) {
        offset = evt.offset;
        limit = evt.limit;
      }
      let params = {};
      //  { "global": { "value": null },
      if (this.mFilters)
        params = {
          name: this.mFilters.name ? this.mFilters.name.value : null,
          type_id: this.mFilters["type.id"] ? this.mFilters["type.id"].value : null,
          type_physical_name: this.mFilters["type.physical_name"] ? this.mFilters["type.physical_name"].value : null,
          asset_name: this.mFilters["asset.name"] ? this.mFilters["asset.name"].value : null,
          domain: this.mFilters.domain ? this.mFilters.domain.value : null,
          direction: this.mFilters.direction ? this.mFilters.direction.value : null,
          sensor_name: this.mFilters.sensor_name ? this.mFilters.sensor_name.value : null,
          tag_key: this.mFilters.tag_key ? this.mFilters.tag_key.value : null,
        };
      if (this.asset) {
        params.asset_name = this.asset.name;
      }
      await this.$refs.spinner.run(async () => {
        await this.$ren.managementApi.listMeasurement({ params: params, offset: offset, limit: limit }).then((data) => {
          for (let m of data) {
            this.$ren.utils.setMeasurementLabel(m);
          }
          // console.error(this.mSelectedMeasurements);
          for (let m of data) {
            // console.error(m);
            m._selected = this.mSelectedMeasurements[m.id] ? true : false;
          }
          this.measurementList = data;
        });
      });
    },
  },
};
</script>

<style lang="scss"></style>
