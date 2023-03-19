<template>
  <Card class="col-12" style="width: 90%; margin: auto; margin-top: 1rem">
    <template #content>
      <RenSpinner ref="spinner" :lock="true" style="margin: auto; max-width: 80rem">
        <!--  max-width: 80vw -->
        <template #content>
          <measurement-list v-model:filters="filters" :measurement-list="measurementList" @reload="loadMeasurements" />
        </template>
      </RenSpinner>
    </template>
  </Card>
</template>
<script>
import MeasurementList from "@/components/management/infrastructure/MeasurementList.vue";
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
  methods: {
    loadMeasurements() {},
  },
};
</script>

<style lang="scss"></style>
