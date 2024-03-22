<template>
  <Dialog v-model:visible="dialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <Card>
      <template #content>
        <RenSpinner ref="spinner" :lock="lock" style="min-width: 100%">
          <template #content>
            <DataTable
              v-model:selection="selectedMeasurement"
              selection-mode="single"
              :meta-key-selection="metaKey"
              data-key="id"
              :value="measurementListAbstracMeter"
              :paginator="true"
              :rows="10"
              @page="handlePageChange"
            >
              <Column field="id" header="ID" :sortable="true" />
              <Column field="name" header="Name" :sortable="true" />
              <Column field="type.name" header="Type_name" :sortable="true" />
            </DataTable>
            <Dialog v-model:visible="measurementEditDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
              <MeasurementForm @update:model-value="onCreate($event, 0)"></MeasurementForm>
            </Dialog>
          </template>
        </RenSpinner>
        <Toolbar>
          <template #start><Button :disabled="buttonDisabled" label="Select" @click="selectCurrentMeasurement" /></template>
          <template #end><Button label="New measurement" icon="pi pi-plus-circle" @click="addDialog = true" /></template>
        </Toolbar>
      </template>
    </Card>
  </Dialog>
  <Dialog v-model:visible="addDialog" :style="{ width: '75vw' }" :modal="true" :dismissable-mask="true">
    <MeasurementForm @update="onCreate($event)" @cancel="addDialog = false" />
  </Dialog>
</template>
<script>
import MeasurementForm from "@/components/management/infrastructure/measurement/MeasurementForm.vue";
export default {
  name: "MeasurementSelectionList",
  components: {
    MeasurementForm,
  },
  emits: ["selected-measurement"],
  data() {
    return {
      dialog: false,
      turnPage: 0,
      offset: 0,
      limit: 25,
      maxLimit: 300,
      selectedMeasurement: null,
      measurementListAbstracMeter: [],
      addDialog: false,
      lock: true,
    };
  },
  async created() {
    this.measurementListAbstracMeter = await this.$ren.managementApi.listMeasurement();
  },
  methods: {
    async handlePageChange(event) {
      if (event.page > this.turnPage + 1 && this.limit < this.maxLimit) {
        this.limit += 25;
        await this.$refs.spinner.run(async () => {
          this.measurementListAbstracMeter = await this.$ren.managementApi.listMeasurement({ offset: this.offset, limit: this.limit });
        });
        this.turnPage = event.page;
      }
    },
    async open() {
      this.dialog = true;
      this.measurementListAbstracMeter = await this.$ren.managementApi.listMeasurement({ offset: this.offset, limit: this.limit });
      console.log("depurando #1 MeasurementselectionList: ");
      console.log(this.measurementListAbstracMeter);
    },
    selectCurrentMeasurement() {
      //console.log("The calculationType is formula");
      this.dialog = false;
      this.$emit("selected-measurement", this.selectedMeasurement.id);
      this.selectedMeasurement = null;
    },
    cancelMeasurementAddition() {
      this.dialog = false;
      this.selectedMeasurement = null;
    },
    async onCreate(o) {
      await this.$ren.managementApi.addMeasurement(o).then((measurement) => {
        console.info("add measurement:" + measurement.name);
        this.$emitter.emit("information", { message: this.$t("information.measurement_created") });
      });
      this.addDialog = false;
      this.measurementListAbstracMeter = await this.$ren.managementApi.listMeasurement();
      console.log(this.measurementListAbstracMeter);
    },
  },
};
</script>
<style scoped lang="scss">
.selected-row {
  background-color: yellow;
}
</style>
