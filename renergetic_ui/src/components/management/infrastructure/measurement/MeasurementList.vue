<template>
  <InfoIcon :show-icon="false">
    <template #content>
      <!-- some info -->
    </template>
  </InfoIcon>
  <!-- @row-expand="onexpand" -->
  <!-- :global-filter-fields="['name', 'label', 'type.name', 'type.physical_name', 'domain', 'direction', 'asset.name']" -->

  <DataTable
    v-model:expandedRows="expanded"
    v-model:selection="selectedMeasurements"
    :filters="mFilters"
    :lazy="true"
    data-key="id"
    :rows="50"
    :row-class="rowClass"
    :value="measurementList"
    filter-display="row"
    class="sticky-header"
    @filter="onFilter"
  >
    <template #header>
      <!-- <span class="p-input-icon-left">
        <i class="pi pi-search" />
        <InputText v-model="mFilters['global'].value" :placeholder="$t('view.search')" />
      </span> -->

      <span class="p-input-icon-left" style="margin-left: 1rem">
        <i class="pi pi-search" />
        <Dropdown v-model="mFilters.tag_key.value" show-clear :options="tagsKeys" :placeholder="$t('view.tag_filter')" />
      </span>
      <Button
        v-if="selectedMeasurements.length > 0"
        :label="$t('view.measurements_export_json')"
        icon="pi pi-list"
        style="position: sticky; left: 2rem; top: 1rem; z-index: 3333; margin-left: 1rem"
        @click="exportJSON"
      />
    </template>

    <Column :expander="true" header-style="width: 3rem" />
    <template #expansion="slotProps">
      <!-- refresh button: TODO: :ref="'roles_' + user.data.id" :user="user.data.id"-->
      <measurement-extension :measurement="slotProps.data" @reload="reload()" />
    </template>
    <!-- <Column field="id" :header="$t('model.measurement.id')"></Column> -->
    <Column field="name" :header="$t('model.measurement.name')" :show-filter-menu="false">
      <!-- <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" type="text" class="p-column-filter" @input="filterCallback()" />
      </template> -->
      <template #body="slotProps">
        <span v-if="slotProps.data._label"> {{ slotProps.data.label }} ({{ slotProps.data._label }})</span>
        <span v-else> {{ slotProps.data.label }} </span>
        <div>
          <span v-if="slotProps.data.measurementTags">
            <li v-for="tag in slotProps.data.measurementTags" :key="tag.id">{{ tag.key }}={{ tag.value }}</li>
          </span>
        </div>
      </template>
    </Column>
    <!-- <Column field="label" :header="$t('model.measurement.label')" :show-filter-menu="false">
      <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" type="text" class="p-column-filter" @input="filterCallback()" />
      </template>
    </Column> -->
    <Column field="physical_name" filter-field="type.physical_name" :header="$t('model.measurement.physical_name')" :show-filter-menu="false">
      <template #body="slotProps">
        <span> {{ $t("enums.metric_type." + slotProps.data.type.physical_name) }} </span>
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <Dropdown
          v-model="filterModel.value"
          style="min-width: 12rem"
          class="p-column-filter"
          :options="physicalTypes"
          option-label="label"
          option-value="value"
          :placeholder="$t('view.select_physical_type')"
          :show-clear="true"
          @change="filterCallback()"
        >
          <!-- <template #option="slotProps">
            <Tag :value="slotProps.option" :severity="getSeverity(slotProps.option)" />
          </template> -->
        </Dropdown>
      </template>
    </Column>
    <Column field="asset" filter-field="asset.name" :header="$t('model.measurement.asset')">
      <template #body="slotProps">
        <span> {{ slotProps.data.asset ? slotProps.data.asset.name : slotProps.data.asset_category }} </span>
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" type="text" class="p-column-filter" @input="filterCallback()" />
      </template>
    </Column>
    <Column field="type" filter-field="type.id" :header="$t('model.measurement.type')" :show-filter-menu="false">
      <template #body="slotProps">
        <span> {{ typeLabel(slotProps.data.type) }} </span>
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <!-- <InputText v-model="filterModel.value" type="text" class="p-column-filter" @input="filterCallback()" /> -->

        <Dropdown
          v-model="filterModel.value"
          style="min-width: 12rem"
          class="p-column-filter"
          :options="measurementTypeList"
          :option-label="(opt) => typeLabel(opt)"
          option-value="id"
          :placeholder="$t('view.select_measurement_type')"
          :show-clear="true"
          @change="filterCallback()"
        >
        </Dropdown>
      </template>
    </Column>

    <Column field="domain" :header="$t('model.measurement.domain')" :show-filter-menu="false">
      <template #body="slotProps">
        {{ $t(`enums.domain.${slotProps.data.domain}`) }}
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <!-- <InputText v-model="filterModel.value" type="text" class="p-column-filter" @input="filterCallback()" /> -->

        <Dropdown
          v-model="filterModel.value"
          style="min-width: 12rem"
          class="p-column-filter"
          :options="domains"
          :option-label="(opt) => $t(`enums.domain.${opt}`)"
          :placeholder="$t('view.select_measurement_domain')"
          :show-clear="true"
          @change="filterCallback()"
        >
        </Dropdown>
      </template>
    </Column>
    <Column field="direction" :header="$t('model.measurement.direction')" :show-filter-menu="false">
      <template #body="slotProps">
        <span v-if="slotProps.data.direction"> {{ $t(`enums.measurement_direction.${slotProps.data.direction}`) }}</span>

        <span v-else> {{ $t("enums.measurement_direction.none") }}</span>
      </template>
      <!-- <template #filter="{ filterModel, filterCallback }">
        <TriStateCheckbox v-model="filterModel.value" @change="filterCallback()" />
      </template> -->
    </Column>
    <Column field="sensor_name" :header="$t('model.measurement.sensor_name')" :show-filter-menu="false">
      <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" type="text" class="p-column-filter" @input="filterCallback()" />
      </template>
    </Column>

    <!-- <Column field="measurement_details" :header="$t('model.measurement.details')">
      <template #body="slotProps">
        <span @click="showDetails(slotProps.data)">
          {{ $t("view.show_details") }}
        </span>
      </template>
    </Column> -->
    <!-- <Column field="edit" :header="$t('view.edit')">
      <template #body="slotProps">
        <Button v-tooltip="$t('view.edit')" icon="pi pi-pencil" class="p-button-rounded" @click="edit(slotProps.data)" />
      </template>
    </Column>
    <Column field="delete" :header="$t('view.delete')">
      <template #body="slotProps">
        <Button v-tooltip="$t('view.delete')" icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="deleteConfirm(slotProps.data)" />
      </template>
    </Column> -->
    <Column selection-mode="multiple" header-style="width: 3rem"></Column>
  </DataTable>
  <ren-paginator v-if="measurementList" v-model:offset="mOffset" style="left: 0" sticky :current-rows="measurementList.length" @update="reload" />
  <Toolbar class="ren-toolbar ren-sticky">
    <template #end>
      <Button :label="$t('view.button.add')" icon="pi pi-plus-circle" @click="addDialog = true" />
      <Button style="margin-left: 0.5rem" @click="importMeasurementsDialog = true">{{ $t("view.upload_measurements") }}</Button>
    </template>
    <template #start>
      <Button :label="$t('view.button.measurement_types')" icon="pi pi-list" @click="typeDialog = true" />
    </template>
  </Toolbar>

  <!-- <Dialog v-model:visible="measurementDetailsDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <MeasurementDetails :model="selectedMeasurement.measurement_details" @update="onDetailsUpdate"></MeasurementDetails>
  </Dialog> -->
  <!-- <DeleteMeasurement ref="deleteMeasurement" :measurement="selectedMeasurement" @delete="onDelete" />
  <Dialog v-model:visible="editDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <MeasurementForm v-if="selectedMeasurement" v-model="selectedMeasurement" @update="onEdit($event)" @cancel="editDialog = false" />
  </Dialog> -->
  <Dialog v-model:visible="addDialog" :style="{ width: '75vw' }" :modal="true" :dismissable-mask="true">
    <MeasurementForm @update="onCreate($event)" @cancel="addDialog = false" />
  </Dialog>
  <Dialog v-model:visible="typeDialog" :style="{ width: '75vw' }" :modal="true" :dismissable-mask="true">
    <MeasurementTypeList />
  </Dialog>
  <Dialog v-model:visible="importMeasurementsDialog" :style="{ width: '50vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <Card>
      <template #header> </template>
      <template #content>
        <FileUpload
          ref="FileUpload"
          name="template[]"
          :custom-upload="true"
          :multiple="false"
          :show-upload-button="false"
          :cancel-label="$t('view.button.clear')"
          :choose-label="$t('view.button.choose')"
          :auto="true"
          :show-cancel-button="false"
          accept="text/*, .json"
          :max-file-size="1000000"
          @upload="onUpload"
          @uploader="onFileUpload"
          @select="onSelect"
        >
          <!-- @upload="onFileUpload" -->
          <template #empty>
            <!-- <ren-input-text v-if="submittedPanel" v-model="submittedPanel" :text-label="null" :cols="50" :maxlength="10000" /> -->
            <ren-input-wrapper v-if="submittedMeasurements" :text-label="null">
              <template #content>
                <Textarea v-model="submittedMeasurementsJSON" style="width: 100%" :maxlength="20000" rows="15" :cols="80"></Textarea>
              </template>
            </ren-input-wrapper>
            <p v-if="!submittedMeasurements">{{ $t("view.file_drag_drop") }}</p>
          </template>
        </FileUpload>

        <ren-submit v-if="submittedMeasurements != null" :cancel-button="true" @submit="submitMeasurements" @cancel="onFileClear" />
      </template>
    </Card>
  </Dialog>
</template>

<script>
// if (mPanel.name !== undefined) delete mPanel.name;
// if (mPanel.id !== undefined) delete mPanel.id;
function clearMeasurementInput(measurements) {
  let mMeasurements = JSON.parse(JSON.stringify(measurements));
  mMeasurements = mMeasurements
    .map((m) => {
      let obj;
      obj = {
        name: m.name,
        domain: m.domain,
        direction: m.direction,
        sensor_name: m.sensor_name,
        aggregation_function: m.aggregation_function,
      };
      if (m.type) {
        obj.type = { id: m.type.id, physical_name: m.type.physical_name, unit: m.type.unit, name: m.type.name };
      }
      if (m.asset) {
        obj.asset = { id: m.asset.id, name: m.asset.name };
      }
      return obj;
    })
    .filter((m) => m != null);

  return mMeasurements;
}
import InfoIcon from "@/components/miscellaneous/InfoIcon.vue";
import MeasurementForm from "./MeasurementForm.vue";
// import MeasurementDetails from "./MeasurementDetails.vue";
// import DeleteMeasurement from "./DeleteMeasurement.vue";
import MeasurementTypeList from "./MeasurementTypeList.vue";
import MeasurementExtension from "./MeasurementExtension.vue";
import { MeasurementDomains, MeasurementDirection } from "@/plugins/model/Enums.js";
import { DeferredFunction } from "@/plugins/renergetic/utils.js";

export default {
  name: "MeasurementList",
  components: { InfoIcon, MeasurementForm, MeasurementTypeList, MeasurementExtension },
  props: {
    measurementList: { type: Array, default: () => [] },
  },
  emits: ["reload", "update:filters"],
  data() {
    let physicalTypes = Object.keys(this.$store.getters["view/measurementTypes"]).map((it) => {
      return { value: it, label: this.$t("enums.metric_type." + it) };
    });

    return {
      // measurementAdd: false,
      mOffset: 0,
      domains: MeasurementDomains.keys(),
      directions: MeasurementDirection.keys(),
      physicalTypes: physicalTypes,
      measurementTypeList: this.$store.getters["view/wrapper"]["measurementTypeList"],
      expanded: [],
      selectedMeasurements: [],
      submittedMeasurements: null,
      columns: [],
      mFilters: this.initFilters(),
      selectedMeasurement: null,
      editDialog: false,
      importMeasurementsDialog: false,
      addDialog: false,
      typeDialog: false,
      measurementDetailsDialog: false,
      deferredEmitFilter: null,
      submittedMeasurementsJSON: "",
    };
  },
  computed: {},
  watch: {
    "mFilters.tag_key.value": async function () {
      await this.onFilter({ filters: this.mFilters });
    },
    measurementList: async function (mList) {
      await this.loadTags(mList);
    },
  },
  created() {
    this.deferredEmitFilter = new DeferredFunction(this._emitFilter);
  },
  async mounted() {
    if (this.measurementList != null && this.measurementList.length > 0) {
      this.columns = await Object.keys(this.measurementList[0]);
    }
    this.tagsKeys = await this.$ren.managementApi.listTagKeys();
  },
  methods: {
    async loadTags(mList) {
      if (mList != null && mList.length < 30)
        for (let m of mList) {
          m.measurementTags = await this.$ren.managementApi.getMeasurementTags(m.id);
        }
    },
    _emitFilter() {
      // console.info("emitFilter: " + new Date());
      this.$emit("update:filters", this.mFilters);
    },
    async onFilter(ev) {
      this.mFilters = ev.filters;
      await this.deferredEmitFilter.run();
    },
    rowClass(data) {
      if (data.panel_count === 0) {
        return "disabled";
      }
      return "";
    },
    initFilters() {
      return {
        global: { value: null, tagKey: null },
        name: { value: null },
        label: { value: null },
        // "type.name": { value: null },
        "type.id": { value: null },
        "type.physical_name": { value: null },
        "asset.name": { value: null },
        domain: { value: null },
        direction: { value: null },
        sensor_name: { value: null },
        tag_key: { value: null },
        // "asset.name": { value: null },
      };
    },
    filterNameCallback(f) {
      this.mFilters.label = f;
    },
    // async onDetailsUpdate(details) {
    //   this.selectedMeasurement.measurement_details = details;
    //   await this.$ren.managementApi.updateMeasurementProperties(this.selectedMeasurement, details).then(() => {
    //     this.reload();
    //   });
    //   //todo: store to db save
    // },
    // async showDetails(row) {
    //   await this.$ren.managementApi.getMeasurementProperties(row.id).then((details) => {
    //     row.measurement_details = details;
    //   });
    //   this.selectedMeasurement = row;
    //   this.measurementDetailsDialog = true;
    // },

    async onCreate(o) {
      // console.info(o);
      await this.$ren.managementApi.addMeasurement(o).then((measurement) => {
        console.info("add measurement:" + measurement.name);
        this.$emitter.emit("information", { message: this.$t("information.measurement_created") });
      });
      this.addDialog = false;
      this.reload();
    },
    typeLabel(mType) {
      return `(${mType.id}) ${this.$t("enums.metric_type." + mType.name)} [${mType.unit}] `;
    },
    async exportJSON() {
      this.$ren.utils.downloadJSON(this.selectedMeasurements, `measurements`);
    },
    // edit(o) {
    //   this.selectedMeasurement = o;
    //   this.editDialog = true;
    // },
    // async onEdit(o) {
    //   await this.$ren.managementApi.updateMeasurement(o).then((res) => {
    //     if (res) {
    //       this.$emitter.emit("information", { message: this.$t("information.measurement_updated") });
    //       this.editDialog = false;
    //       this.reload();
    //     } else {
    //       this.$emitter.emit("error", { message: this.$t("information.measurement_not_updated") });
    //     }
    //   });
    // },
    // deleteConfirm(o) {
    //   this.selectedMeasurement = o;
    //   this.$refs.deleteMeasurement.delete(o);
    // },
    // // onDelete(o){
    // onDelete() {
    //   this.selectedMeasurement = null;
    //   this.reload();
    // },
    reload(evt) {
      //TODO: filter

      this.$emit("reload", evt);
    },
    onSelect() {
      if (this.$refs.FileUpload !== undefined) this.hasFiles = this.$refs.FileUpload.files.length > 0;
      else this.hasFiles = false;
    },
    onFileClear() {
      // this.mPanelStructure = null;

      this.submittedMeasurements = null;
      this.submittedMeasurementsJSON = "";
    },
    async submitMeasurements() {
      var measurements = JSON.parse(this.submittedMeasurementsJSON);
      // console.info(measurements);
      console.warn("TODO: make yesno confirm dialog  ");

      await this.$ren.managementApi.addMeasurements(measurements).then((measurementsResponse) => {
        for (let m of measurementsResponse) {
          console.info("add measurement:" + m.name);
          console.info(m);
        }
        this.$emitter.emit("information", { message: this.$t("information.measurements_created") });
        // this.$emitter.emit("information", { message: this.$t("information.measurement_created") });
      });

      this.submittedMeasurements = null;
      this.submittedMeasurementsJSON = "";
      this.importPanelDialog = false;
      this.reload();
    },
    async onFileUpload(evt) {
      this.submittedMeasurements = null;
      // console.info(evt.files);
      if (evt.files.length == 1) {
        this.submittedMeasurements = clearMeasurementInput(await this.$ren.utils.readJSONFile(evt.files[0]));
        this.submittedMeasurementsJSON = JSON.stringify(this.submittedMeasurements, null, "\t");
      }
      // await this._submit(event.files);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
// .p-datatable-header {
//   position: sticky;
//   top: 0;
//   padding: 0.5rem 0.5rem;
//   height: 4rem;
//   z-index: 4000;
// }
// .p-datatable-thead {
//   position: sticky;
//   top: 4rem;
//   z-index: 4000;
// }
</style>
