<template>
  <RenSpinner ref="spinner" :lock="true" style="min-width: 100%">
    <template #content>
      <div style="z-index: 1001">
        <measurement-list v-model:filters="filters" :measurement-list="measurementList" :basic="true" @select="onSelect" @reload="loadMeasurements" />
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
    selectedMeasurements: { type: Array, default: null },
  },
  emits: ["select"],
  data() {
    //tODO: filter tempId or match dynamic measurements here ?
    let mSelectedMeasurements = this.selectedMeasurements
      ? Object.fromEntries(this.selectedMeasurements.map((m) => [m.id ? m.id : m.tempId, m]))
      : [];
    return {
      mSelectedMeasurements: mSelectedMeasurements,
      filters: null,
      measurementList: [],
      selectedMeasurement: null,
    };
  },

  watch: {
    filters: {
      handler: function () {
        this.loadMeasurements();
      },
      deep: true,
    },
  },
  mounted() {
    this.mSelectedMeasurements = this.selectedMeasurements
      ? Object.fromEntries(this.selectedMeasurements.map((m) => [m.id ? m.id : m.tempId, m]))
      : [];
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
      if (this.filters)
        params = {
          name: this.filters.name.value,
          type_id: this.filters["type.id"].value,
          type_physical_name: this.filters["type.physical_name"].value,
          asset_name: this.filters["asset.name"].value,
          domain: this.filters.domain.value,
          direction: this.filters.direction.value,
          sensor_name: this.filters.sensor_name.value,
          tag_key: this.filters.tag_key.value,
        };
      await this.$refs.spinner.run(async () => {
        await this.$ren.managementApi.listMeasurement({ params: params, offset: offset, limit: limit }).then((data) => {
          for (let m of data) {
            this.$ren.utils.setMeasurementLabel(m);
          }
          console.error(this.mSelectedMeasurements);
          for (let m of data) {
            console.error(m);
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
