<template>
  <Card class="col-12" style="width: 95%; margin: auto; margin-top: 1rem">
    <template #content>
      <RenSpinner ref="spinner" :lock="true" style="margin: auto; max-width: 100%">
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
          this.measurementList = data;
        });
      });
    },
  },
};
</script>

<style lang="scss"></style>
