<template>
  <Card style="margin: auto; margin-top: 1rem">
    <template #content>
      <RenSpinner ref="spinner" :lock="true" style="margin: auto; max-width: 95%">
        <!--  max-width: 80vw -->
        <template #content>
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
      measurementList: [],
    };
  },
  mounted() {
    this.loadMeasurements();
  },
  methods: {
    async loadMeasurements() {
      await this.$refs.spinner.run(async () => {
        await this.$ren.managementApi.listMeasurement().then((data) => {
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
