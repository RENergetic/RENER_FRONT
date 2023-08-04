<template>
  <Dialog v-model:visible="dialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <Card>
      <p></p>
      <template #content>
        <DataTable
          v-model:selection="selectedMeasurement"
          selection-mode="single"
          :meta-key-selection="metaKey"
          data-key="id"
          :value="measurementListAbstracMeter"
          :paginator="true"
          :rows="10"
        >
          <Column field="id" header="ID" :sortable="true" />
          <Column field="name" header="Name" :sortable="true" />
          <Column field="type.name" header="Type_name" :sortable="true" />
        </DataTable>
        <div class="card flex flex-wrap gap-5 field grid box">
          <Button :disabled="buttonDisabled" label="Select" @click="selectCurrentMeasurement" />
          <Button label="Create new measurement" @click="addNewMeasurement" />
          <Button label="Cancel" @click="cancelMeasurementAddition" />
        </div>
        <Dialog v-model:visible="measurementEditDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
          <MeasurementForm @update:model-value="onCreate($event, 0)"></MeasurementForm>
        </Dialog>
      </template>
    </Card>
  </Dialog>
</template>
<script>
import MeasurementForm from "@/components/management/infrastructure/MeasurementForm.vue";
export default {
  name: "AbstractMetersCalculation",
  components: {
    MeasurementForm,
  },
  emits: ["selected-measurement-formula", "selected-measurement-condition"],
  data() {
    return {
      dialog: false,
      selectedMeasurement: null,
      measurementListAbstracMeter: [],
      calculationType: null,
    };
  },
  async created() {
    this.measurementListAbstracMeter = await this.$ren.managementApi.listMeasurement();
    //console.log(this.measurementListAbstracMeter);
  },
  methods: {
    async open(calculationType) {
      this.dialog = true;
      this.calculationType = calculationType;
    },
    selectCurrentMeasurement() {
      console.log("I will return this value: " + this.selectedMeasurement.id);
      if (this.calculationType == "formula") {
        console.log("The calculationType is formula");
        this.$emit("selected-measurement-formula", this.selectedMeasurement.id);
      } else if (this.calculationType == "condition") {
        console.log("The calculationType is condition");
        this.$emit("selected-measurement-condition", this.selectedMeasurement.id);
      } else {
        console.error("The calculationType is not correctly received");
      }
      this.dialog = false;
      this.selectedMeasurement = null;
    },
    addNewMeasurement() {
      console.log("add new measurement");
    },
    cancelMeasurementAddition() {
      this.dialog = false;
      this.selectedMeasurement = null;
    },
    onCreate(o, i) {
      alert(o);
      alert(i);
    },
  },
  /*
  data() {
    return {
      tableData: [
        { name: "John Doe", id: 25 },
        { name: "Jane Smith", id: 30 },
        { name: "Bob Johnson", id: 35 },
      ],
    };
  },
  */
};
</script>
.selected-row { background-color: yellow; }
<style scoped lang="scss"></style>
