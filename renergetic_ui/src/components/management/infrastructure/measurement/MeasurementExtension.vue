<template>
  <InfoIcon :show-icon="false">
    <template #content>
      <!-- some info -->
    </template>
  </InfoIcon>
  <div class="grid">
    <div class="col-12">
      <Button v-tooltip="$t('view.show_details')" icon="pi pi-cog" class="p-button-rounded" @click="showDetails()" />
      <Button
        v-if="mMeasurement.panel_count > 0"
        v-tooltip="$t('view.list_panels')"
        icon="pi pi-th-large"
        class="p-button-rounded"
        @click="listPanels()"
      />
      <Button v-tooltip="$t('view.manage_tags')" icon="pi pi-tags" class="p-button-rounded" @click="manageTags()" />
      <Button v-tooltip="$t('view.view_data')" icon="pi pi-chart-line" class="p-button-rounded" @click="manageTags()" />

      <Button v-tooltip="$t('view.edit')" icon="pi pi-pencil" class="p-button-rounded" @click="edit()" />
      <Button v-tooltip="$t('view.delete')" icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="deleteConfirm()" />
    </div>
    <div class="col-12 md:col-10 xl:col-6">
      <div class="col-12">
        <ren-input v-model="mMeasurement.id" :text-label="'model.measurement.id'" :disabled="true" />
      </div>
      <div class="col-12">
        <ren-input v-model="mName" :text-label="'model.measurement.name'" :disabled="true" />
      </div>
      <div class="col-12">
        <ren-input v-model="mMeasurement.panel_count" :text-label="'model.measurement.panel_count'" :disabled="true" />
      </div>
    </div>
  </div>

  <Dialog v-model:visible="measurementDetailsDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <!-- {{ selectedMeasurement.measurement_details }} -->
    <MeasurementDetails :model="mMeasurement.measurement_details" @update="onDetailsUpdate"></MeasurementDetails>
    <!-- @update:model-value="onCreate($event, 0)" -->
  </Dialog>
  <!-- <Button :label="$t('view.button.add')" @click="measurementAdd = true" /> -->
  <!-- <Dialog v-model:visible="measurementEditDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <MeasurementForm @update:model-value="onCreate($event, 0)"></MeasurementForm>
  </Dialog> -->
  <DeleteMeasurement ref="deleteMeasurement" :measurement="mMeasurement" @delete="onDelete" />
  <Dialog v-model:visible="editDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <MeasurementForm v-if="mMeasurement" v-model="mMeasurement" @update="onEdit($event)" @cancel="editDialog = false" />
  </Dialog>
  <Dialog v-model:visible="typeDialog" :style="{ width: '75vw' }" :modal="true" :dismissable-mask="true">
    <MeasurementTypeList />
  </Dialog>
  <measurement-tags ref="tagDialog" :measurement="mMeasurement" />
</template>

<script>
import InfoIcon from "@/components/miscellaneous/InfoIcon.vue";
import MeasurementForm from "./MeasurementForm.vue";
import MeasurementDetails from "./MeasurementDetails.vue";
import DeleteMeasurement from "./DeleteMeasurement.vue";
import MeasurementTypeList from "./MeasurementTypeList.vue";
import MeasurementTags from "./MeasurementTags.vue";

export default {
  name: "MeasurementExtension",
  components: { InfoIcon, MeasurementForm, MeasurementTags, MeasurementDetails, DeleteMeasurement, MeasurementTypeList },
  props: {
    measurement: { type: Object, required: true },
  },
  emits: ["reload"],
  data() {
    return {
      mMeasurement: this.measurement,
      mName: this.measurement.label ? `${this.measurement.label} (${this.measurement.name})` : this.measurement.name,
      hasPanels: false, //TODO:
      editDialog: false,
      addDialog: false,
      typeDialog: false,
      measurementDetailsDialog: false,
    };
  },
  computed: {},
  watch: {
    // "filters.name": function (f1 ) {
    //   this.filters.label.value = f1.value;
    //   // alert(value);
    // },
  },
  mounted() {},
  methods: {
    async manageTags() {
      await this.$refs.tagDialog.open();
    },
    async onDetailsUpdate(details) {
      this.mMeasurement.measurement_details = details;
      await this.$ren.managementApi.updateMeasurementProperties(this.mMeasurement, details).then(() => {
        this.reload();
      });
      // alert("Save error, not implemented");
      //todo: store to db save
    },
    async showDetails() {
      await this.$ren.managementApi.getMeasurementProperties(this.mMeasurement.id).then((details) => {
        this.mMeasurement.measurement_details = details;
      });

      this.measurementDetailsDialog = true;
    },

    edit() {
      this.editDialog = true;
    },
    async onEdit(o) {
      await this.$ren.managementApi.updateMeasurement(o).then((res) => {
        if (res) {
          this.$emitter.emit("information", { message: this.$t("information.measurement_updated") });
          this.editDialog = false;
          this.reload();
        } else {
          this.$emitter.emit("error", { message: this.$t("information.measurement_not_updated") });
        }
      });
    },
    deleteConfirm() {
      this.$refs.deleteMeasurement.delete(this.mMeasurement);
    },
    // onDelete(o){
    onDelete() {
      this.reload();
    },
    reload() {
      //TODO: filter
      this.$emit("reload");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
button {
  margin: 0.5rem;
  font-size: 1rem;
  width: 3rem !important;
  height: 3rem !important;
}
button span {
  font-size: 1.5rem !important;
}
</style>
<style lang="scss">
button span.pi {
  font-size: 1.5rem !important;
}
</style>
