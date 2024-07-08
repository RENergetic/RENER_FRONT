<template>
  <DataTable
    v-model:expandedRows="expanded"
    v-model:selection="selectedMeasurements"
    :selection-mode="basic ? 'single' : null"
    :filters="mFilters"
    :lazy="true"
    data-key="id"
    :row-class="rowClass"
    :value="measurementList"
    filter-display="row"
    class="sticky-header"
    @filter="onFilter"
  >
    <template #header>
      <span class="p-input-icon-left" style="margin-left: 1rem">
        <i class="pi pi-search" />
        <Dropdown v-model="mFilters.tag_key.value" show-clear :options="tagsKeys" :placeholder="$t('view.tag_filter')" />
      </span>
      <div v-if="selectedMeasurements.length > 0" style="display: inline; position: sticky; left: 2rem; top: 1rem; z-index: 3333; margin-left: 1rem">
        <Button :label="$t('view.measurements_export_json')" icon="pi pi-list" style="margin-right: 1rem" @click="exportJSON" />
        <Button v-tooltip="$t('view.delete_measurements')" :label="$t('view.delete_measurements')" icon="pi pi-trash" @click="deleteMeasurements" />
      </div>
    </template>

    <Column v-if="!basic" :expander="true" header-style="width: 3rem" />
    <template #expansion="slotProps">
      <measurement-extension :measurement="slotProps.data" @reload="reload()" />
    </template>
    <!-- <Column field="id" :header="$t('model.measurement.id')"></Column> -->
    <Column field="name" :header="$t('model.measurement.name')" :show-filter-menu="false">
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
        <span> {{ typeUnitLabel(slotProps.data.type) }} </span>
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <!-- <InputText v-model="filterModel.value" type="text" class="p-column-filter" @input="filterCallback()" /> -->

        <Dropdown
          v-model="filterModel.value"
          style="min-width: 12rem"
          class="p-column-filter"
          :options="measurementTypeList"
          :option-label="(opt) => typeUnitLabel(opt)"
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

    <Column v-if="!basic" selection-mode="multiple" header-style="width: 3rem"></Column>
  </DataTable>
  <ren-paginator v-if="measurementList" v-model:offset="mOffset" style="left: 0" sticky :current-rows="measurementList.length" @update="reload" />
  <Toolbar v-if="!basic" class="ren-toolbar ren-sticky">
    <template #end>
      <Button :label="$t('view.button.add')" icon="pi pi-plus-circle" @click="addDialog = true" />
      <Button style="margin-left: 0.5rem" @click="importMeasurementsDialog = true">{{ $t("view.upload_measurements") }}</Button>
    </template>
    <template #start>
      <Button :label="$t('view.button.measurement_types')" icon="pi pi-list" @click="typeDialog = true" />
    </template>
  </Toolbar>

  <Dialog v-model:visible="addDialog" :style="{ width: '75vw' }" :modal="true" :dismissable-mask="true">
    <MeasurementForm @update="onCreate($event)" @cancel="addDialog = false" />
  </Dialog>
  <Dialog v-model:visible="typeDialog" class="ren-page-content" :style="{ width: '75vw' }" :modal="true" :dismissable-mask="true">
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
  <DeleteMeasurement ref="deleteMeasurement" @delete="onDelete" />
</template>

<script>
function clearMeasurementInput(measurements) {
  let mMeasurements = JSON.parse(JSON.stringify(measurements));
  mMeasurements = mMeasurements
    .map((m) => {
      let obj;
      obj = {
        name: m.name,
        label: m.label,
        domain: m.domain,
        direction: m.direction,
        sensor_name: m.sensor_name,
        aggregation_function: m.aggregation_function,
        measurement_details: m.measurement_details,
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
function initFilters(filters) {
  var f = {
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
  if (filters != null) {
    return { ...f, ...filters };
  }
  return f;
}
// import InfoIcon from "@/components/miscellaneous/InfoIcon.vue";
import MeasurementForm from "./MeasurementForm.vue";
// import MeasurementDetails from "./MeasurementDetails.vue";
import MeasurementTypeList from "./MeasurementTypeList.vue";
import MeasurementExtension from "./MeasurementExtension.vue";
import DeleteMeasurement from "./DeleteMeasurement.vue";
import { MeasurementDomains, MeasurementDirection } from "@/plugins/model/Enums.js";
import { DeferredFunction } from "@/plugins/renergetic/utils.js";

export default {
  name: "MeasurementList",
  components: { MeasurementForm, MeasurementTypeList, MeasurementExtension, DeleteMeasurement },
  props: {
    measurementList: { type: Array, default: () => [] },
    basic: { type: Boolean, default: false },
    filters: { type: Object, default: null },
  },
  emits: ["reload", "update:filters", "select"],
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
      mFilters: initFilters(this.filters),
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
    selectedMeasurements: function (v) {
      this.$emit("select", v);
    },
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
      this.$emit("update:filters", this.mFilters);
    },
    async onFilter(ev) {
      this.mFilters = ev.filters;
      await this.deferredEmitFilter.run();
    },
    rowClass(data) {
      if (data._selected && data.panel_count === 0) {
        return "disabled selected";
      }
      if (data._selected) {
        return "selected";
      }
      if (data.panel_count === 0) {
        return "disabled";
      }
      return "";
    },

    filterNameCallback(f) {
      this.mFilters.label = f;
    },
    async onCreate(o) {
      await this.$ren.managementApi.addMeasurement(o).then((measurement) => {
        console.info("add measurement:" + measurement.name);
        this.$emitter.emit("information", { message: this.$t("information.measurement_created") });
      });
      this.addDialog = false;
      this.reload();
    },
    typeUnitLabel(mType) {
      return `(${mType.id}) ${this.$t("enums.metric_type." + mType.physical_name)} [${mType.unit}] `;
    },
    async exportJSON() {
      var sm = await Promise.all(
        this.selectedMeasurements.map(async (it) => {
          if (it._label) {
            let label = it.label;
            it.label = it._label; //label code
            it._label = label; //translated code
          }
          await this.$ren.managementApi.getMeasurementProperties(it.id).then((details) => {
            it.measurement_details = details ? details : {};
          });
          return it;
        }),
      );
      this.$ren.utils.downloadJSON(sm, `measurements`);
    },
    onDelete() {
      this.reload();
    },
    async deleteMeasurements() {
      this.$refs.deleteMeasurement.delete(this.selectedMeasurements);
    },

    reload(evt) {
      this.$emit("reload", evt);
    },
    onSelect() {
      if (this.$refs.FileUpload !== undefined) this.hasFiles = this.$refs.FileUpload.files.length > 0;
      else this.hasFiles = false;
    },
    onFileClear() {
      this.submittedMeasurements = null;
      this.submittedMeasurementsJSON = "";
    },
    async submitMeasurements() {
      var measurements = JSON.parse(this.submittedMeasurementsJSON);
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
      if (evt.files.length == 1) {
        this.submittedMeasurements = clearMeasurementInput(await this.$ren.utils.readJSONFile(evt.files[0]));
        this.submittedMeasurementsJSON = JSON.stringify(this.submittedMeasurements, null, "\t");
      }
    },
  },
};
</script>

<style lang="scss"></style>
