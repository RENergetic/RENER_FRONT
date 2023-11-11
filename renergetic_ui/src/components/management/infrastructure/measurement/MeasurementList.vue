<template>
  <InfoIcon :show-icon="false">
    <template #content>
      <!-- some info -->
    </template>
  </InfoIcon>
  <!-- @row-expand="onexpand" -->
  <DataTable
    v-model:expandedRows="expanded"
    v-model:filters="filters"
    data-key="id"
    :rows="50"
    :paginator="true"
    :row-class="rowClass"
    :rows-per-page-options="[10, 20, 50, 100]"
    :value="measurementList"
    filter-display="row"
    :global-filter-fields="['name', 'label', 'type.name', 'type.physical_name', 'domain', 'direction', 'asset.name']"
  >
    <template #header>
      <span class="p-input-icon-left">
        <i class="pi pi-search" />
        <InputText v-model="filters['global'].value" :placeholder="$t('view.search')" />
      </span>
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
    <Column field="type" filter-field="type.name" :header="$t('model.measurement.type')" :show-filter-menu="false">
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
          option-value="name"
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
  </DataTable>
  <Toolbar>
    <template #end><Button :label="$t('view.button.add')" icon="pi pi-plus-circle" @click="addDialog = true" /> </template>
    <template #start><Button :label="$t('view.button.measurement_types')" icon="pi pi-list" @click="typeDialog = true" /> </template>
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
</template>

<script>
import InfoIcon from "@/components/miscellaneous/InfoIcon.vue";
import MeasurementForm from "./MeasurementForm.vue";
// import MeasurementDetails from "./MeasurementDetails.vue";
// import DeleteMeasurement from "./DeleteMeasurement.vue";
import MeasurementTypeList from "./MeasurementTypeList.vue";
import MeasurementExtension from "./MeasurementExtension.vue";
import { MeasurementDomains, MeasurementDirection } from "@/plugins/model/Enums.js";

export default {
  name: "MeasurementList",
  components: { InfoIcon, MeasurementForm, MeasurementTypeList, MeasurementExtension },
  props: {
    measurementList: { type: Array, default: () => [] },
  },
  emits: ["reload"],
  data() {
    let physicalTypes = Object.keys(this.$store.getters["view/measurementTypes"]).map((it) => {
      return { value: it, label: this.$t("enums.metric_type." + it) };
    });

    return {
      // measurementAdd: false,
      domains: MeasurementDomains.keys(),
      directions: MeasurementDirection.keys(),
      physicalTypes: physicalTypes,
      measurementTypeList: this.$store.getters["view/wrapper"]["measurementTypeList"],
      expanded: [],
      columns: [],
      filters: this.initFilters(),
      selectedMeasurement: null,
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
  mounted() {
    if (this.measurementList != null && this.measurementList.length > 0) {
      this.columns = Object.keys(this.measurementList[0]);
    }
  },
  methods: {
    rowClass(data) {
      if (data.panel_count === 0) {
        return "disabled";
      }
      return "";
    },
    initFilters() {
      return {
        global: { value: null },
        name: { value: null },
        label: { value: null },
        "type.name": { value: null },
        "type.physical_name": { value: null },
        "asset.name": { value: null },
        domain: { value: null },
        direction: { value: null },
        sensor_name: { value: null },
        // "asset.name": { value: null },
      };
    },
    filterNameCallback(f) {
      this.filters.label = f;
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
    reload() {
      //TODO: filter
      this.$emit("reload");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
