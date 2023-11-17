<template>
  <Card style="margin: auto; margin-top: 1rem">
    <template #content>
      <RenSpinner ref="spinner" :lock="true" style="margin: auto; max-width: 95%">
        <!--  max-width: 80vw -->
        <template #content>
          <!-- {{ filters }} -->
          <measurement-list v-model:filters="filters" :measurement-list="measurementList" @reload="loadMeasurements" />
        </template>
      </RenSpinner>
    </template>
  </Card>
</template>
<script>
import MeasurementList from "@/components/management/infrastructure/measurement/MeasurementList.vue";
export default {
  name: "MeasurementListView",
  components: {
    MeasurementList,
  },
  data() {
    return {
      filters: null,
      measurementList: [],
    };
  },

  watch: {
    filters: function () {
      this.loadMeasurements();
    },
  },
  mounted() {
    this.loadMeasurements();
  },
  methods: {
    async loadMeasurements() {
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
        };
      await this.$refs.spinner.run(async () => {
        await this.$ren.managementApi.listMeasurement({ ...params, limit: 2000 }).then((data) => {
          for (let m of data) {
            this.$ren.utils.setMeasurementLabel(m);
          }
          this.measurementList = data;
        });
      });
    },
  },
};
</script>

<style lang="scss"></style>
