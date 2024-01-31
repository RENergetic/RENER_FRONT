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
      <Button v-tooltip="$t('view.view_data')" icon="pi pi-chart-line" class="p-button-rounded" @click="showData()" />

      <Button v-tooltip="$t('view.edit')" icon="pi pi-pencil" class="p-button-rounded" @click="edit()" />
      <Button v-tooltip="$t('view.copy')" icon="pi pi-copy" class="p-button-rounded" @click="copy()" />
      <Button v-tooltip="$t('view.view_json')" icon="pi pi-question-circle" class="p-button-rounded" @click="jsonDialog = true" />

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
      <div class="col-12">
        <h3>{{ $t("view.tags") }}:</h3>
      </div>
      <div v-for="tag in measurementTags" :key="tag.id" class="col-12">
        <ren-input v-model="tag.value" :text-label="tag.key" :disabled="true" />
      </div>
    </div>
  </div>

  <Dialog v-model:visible="measurementDetailsDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <MeasurementDetails :model="mMeasurement.measurement_details" @update="onDetailsUpdate"></MeasurementDetails>
  </Dialog>
  <!-- <Button :label="$t('view.button.add')" @click="measurementAdd = true" /> -->
  <!-- <Dialog v-model:visible="measurementEditDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <MeasurementForm @update:model-value="onCreate($event, 0)"></MeasurementForm>
  </Dialog> -->
  <DeleteMeasurement ref="deleteMeasurement" :measurements="[mMeasurement]" @delete="onDelete" />
  <Dialog v-model:visible="editDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <MeasurementForm v-if="mMeasurement" v-model="mMeasurement" @update="onEdit($event)" @cancel="editDialog = false" />
  </Dialog>
  <Dialog v-model:visible="typeDialog" :style="{ width: '75vw' }" :modal="true" :dismissable-mask="true">
    <MeasurementTypeList />
  </Dialog>
  <Dialog v-model:visible="panelListDialog" :style="{ width: '75vw' }" :modal="true" :dismissable-mask="true">
    measurement {{ mMeasurement.name }}({{ mMeasurement.id }}) :{{ mMeasurement.panel_count }}
    TODO: list panels
  </Dialog>
  <Dialog v-model:visible="dataDialog" :style="{ width: '90vw' }" :modal="true" :dismissable-mask="true">
    <div>
      <MeasurementChart
        ref="chart"
        :filter="filter"
        :style="'margin:auto;max-width: 90%;'"
        :width="1200"
        :height="500"
        :measurements="[mMeasurement]"
      />
      <BasicFilterSettings
        style="width: 100%; margin: auto; margin-top: 1rem"
        class="ren-card"
        :setting-key="'measurement'"
        :submit-button="false"
        :columns="3"
        :labels="false"
        @update="reloadSettings()"
      />
    </div>
  </Dialog>
  <MeasurementDialog v-model:visible="jsonDialog" v-model="mMeasurement" />

  <measurement-tags ref="tagDialog" :measurement="mMeasurement" />
</template>

<script>
import InfoIcon from "@/components/miscellaneous/InfoIcon.vue";
import MeasurementForm from "./MeasurementForm.vue";
import MeasurementDialog from "./MeasurementDialog.vue";
import MeasurementDetails from "./MeasurementDetails.vue";
import DeleteMeasurement from "./DeleteMeasurement.vue";
import MeasurementTypeList from "./MeasurementTypeList.vue";
import MeasurementChart from "@/components/dashboard/measurement/MeasurementChart.vue";
import MeasurementTags from "./MeasurementTags.vue";
import BasicFilterSettings from "@/components/miscellaneous/settings/BasicFilterSettings.vue";

export default {
  name: "MeasurementExtension",
  components: {
    InfoIcon,
    BasicFilterSettings,
    MeasurementForm,
    MeasurementChart,
    MeasurementTags,
    MeasurementDetails,
    DeleteMeasurement,
    MeasurementDialog,
    MeasurementTypeList,
  },
  props: {
    measurement: { type: Object, required: true },
  },
  emits: ["reload"],
  data() {
    return {
      mMeasurement: this.measurement,
      mName: this.measurement.label ? `${this.measurement.label} (${this.measurement.name})` : this.measurement.name,
      panelListDialog: false,
      editDialog: false,
      addDialog: false,
      jsonDialog: false,
      typeDialog: false,
      dataDialog: false,
      measurementDetailsDialog: false,
      filter: this.$store.getters["settings/parsedFilter"]("measurement"),
      measurementTags: [],
    };
  },
  computed: {},
  watch: {
    // "filters.name": function (f1 ) {
    //   this.filters.label.value = f1.value;
    // },
  },
  async mounted() {
    this.measurementTags = await this.$ren.managementApi.getMeasurementTags(this.measurement.id);
  },
  methods: {
    reloadSettings() {
      this.filter = this.$store.getters["settings/parsedFilter"]("measurement");
      // this.conversionSettings = this.$store.getters["settings/conversion"];
    },
    async manageTags() {
      await this.$refs.tagDialog.open();
    },
    listPanels() {
      alert("todo:");
      this.panelListDialog = true;
    },
    async onDetailsUpdate(details) {
      this.mMeasurement.measurement_details = details;
      await this.$ren.managementApi.updateMeasurementProperties(this.mMeasurement, details).then(() => {
        this.reload();
      });
      // alert("Save error, not implemented");
      //todo: store to db save
    },
    async showData() {
      await this.$ren.managementApi.getMeasurementProperties(this.mMeasurement.id).then((details) => {
        this.mMeasurement.measurement_details = details;
      });
      this.dataDialog = true;
    },
    async showDetails() {
      await this.$ren.managementApi.getMeasurementProperties(this.mMeasurement.id).then((details) => {
        this.mMeasurement.measurement_details = details ? details : {};
      });

      this.measurementDetailsDialog = true;
    },

    async copy() {
      //todo: confirm?
      await this.$ren.managementApi.duplicateMeasurement(this.mMeasurement.id).then((newM) => {
        console.info(newM);
        this.reload();
      });
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
      this.$refs.deleteMeasurement.delete([this.mMeasurement]);
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
  // width: 2.5rem !important;
  // height: 2.5rem !important;
}
// button span {
//   font-size: 1.25rem !important;
// }
</style>
<style lang="scss">
// button span.pi {
//   font-size: 1.25rem !important;
// }
</style>
