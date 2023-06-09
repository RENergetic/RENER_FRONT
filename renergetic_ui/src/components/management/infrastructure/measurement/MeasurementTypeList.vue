<template>
  <!--  TODO: edit measuremet tpes -->
  <InfoIcon :show-icon="false">
    <template #content>
      <!-- some info -->
    </template>
  </InfoIcon>

  <DataTable :value="typeList">
    <Column v-for="col of columns" :key="col" :field="col" :header="$t('model.measurement_type.' + col)"></Column>

    <!-- <Column field="edit" :header="$t('view.edit')"> <template #body>todo:</template></Column> -->
  </DataTable>
</template>

<script>
import InfoIcon from "../../../miscellaneous/InfoIcon.vue";
export default {
  name: "MeasurementTypeList",
  components: { InfoIcon },
  props: {},
  data() {
    return {
      // measurementAdd: false,
      typeList: [],
      columns: [],
      selectedRow: null,
      // measurementEditDialog: false,
      // measurementDetailsDialog: false,
    };
  },
  computed: {},
  watch: {},
  async created() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      this.typeList = await this.$ren.managementApi.listMeasurementType();
      if (this.typeList != null && this.typeList.length > 0) {
        this.columns = Object.keys(this.typeList[0]);
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
