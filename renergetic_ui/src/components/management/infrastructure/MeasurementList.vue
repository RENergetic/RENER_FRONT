<template>
  <InfoIcon :show-icon="false">
    <template #content>
      <!-- some info -->
    </template>
  </InfoIcon>
  <DataTable
    v-model:filters="filters"
    :value="measurementList"
    filter-display="row"
    :global-filter-fields="['name', 'label', 'type.name', 'type.physical_name', 'domain', 'direction', 'asset.name']"
  >
    <!-- <Column v-for="col of columns" :key="col" :field="col" :header="$t('model.measurement.' + col)"></Column> -->
    <Column field="id" :header="$t('model.measurement.id')"></Column>
    <Column field="name" :header="$t('model.measurement.name')" :show-filter-menu="false">
      <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" type="text" class="p-column-filter" @input="filterCallback()" /> </template
    ></Column>
    <Column field="label" :header="$t('model.measurement.label')" :show-filter-menu="false">
      <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" type="text" class="p-column-filter" @input="filterCallback()" />
      </template>
    </Column>
    <Column field="physical_name" filter-field="type.physical_name" :header="$t('model.measurement.physical_name')" :show-filter-menu="false">
      <template #body="slotProps">
        <span> {{ $t("enums.metric_type." + slotProps.data.type.physical_name) }} </span>
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" type="text" class="p-column-filter" @input="filterCallback()" />
      </template>
    </Column>
    <Column field="asset" filter-field="asset.name" :header="$t('model.measurement.asset')">
      <template #body="slotProps">
        <span> {{ slotProps.data.asset ? slotProps.data.asset.name : slotProps.data.asset_category }} </span>
      </template>
    </Column>
    <Column field="type" filter-field="type.name" :header="$t('model.measurement.type')" :show-filter-menu="false">
      <template #body="slotProps">
        <span> {{ $t("enums.metric_type." + slotProps.data.type.name) }} [{{ slotProps.data.type.unit }}] </span>
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" type="text" class="p-column-filter" @input="filterCallback()" />
      </template>
    </Column>

    <Column field="domain" :header="$t('model.measurement.domain')" :show-filter-menu="false">
      <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" type="text" class="p-column-filter" @input="filterCallback()" />
      </template>
    </Column>
    <Column field="direction" :header="$t('model.measurement.direction')" :show-filter-menu="false">
      <template #body="slotProps">
        <span v-if="slotProps.data.direction.direction"> {{ $t("model.measurement.direction_out") }}</span>
        <span v-else-if="slotProps.data.direction == false"> {{ $t("model.measurement.direction_in") }}</span>
        <span v-else> {{ $t("model.measurement.direction_null") }}</span>
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

    <Column field="measurement_details" :header="$t('model.measurement.details')">
      <template #body="slotProps">
        <span @click="showDetails(slotProps)">
          {{ $t("view.show_details") }}
        </span>
      </template>
    </Column>
    <Column field="edit" :header="$t('view.edit')"> <template #body>todo:</template></Column>
  </DataTable>
  <Dialog v-model:visible="measurementDetailsDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <MeasurementDetails :model="selectedRow.data.measurement_details" @update="onDetailsUpdate"></MeasurementDetails>
    <!-- @update:model-value="onCreate($event, 0)" -->
  </Dialog>
  <!-- <Button :label="$t('view.button.add')" @click="measurementAdd = true" /> -->
  <Dialog v-model:visible="measurementEditDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <MeasurementForm @update:model-value="onCreate($event, 0)"></MeasurementForm>
  </Dialog>
</template>

<script>
import InfoIcon from "../../miscellaneous/InfoIcon.vue";
import MeasurementForm from "./MeasurementForm.vue";
import MeasurementDetails from "./MeasurementDetails.vue";
export default {
  name: "MeasurementList",
  components: { InfoIcon, MeasurementForm, MeasurementDetails },
  props: {},
  data() {
    return {
      // measurementAdd: false,
      measurementList: [],
      columns: [],
      filters: this.initFilters(),
      selectedRow: null,
      measurementEditDialog: false,
      measurementDetailsDialog: false,
    };
  },
  computed: {},
  watch: {},
  async created() {
    this.measurementList = await this.$ren.managementApi.listMeasurement();
    if (this.measurementList != null && this.measurementList.length > 0) {
      this.columns = Object.keys(this.measurementList[0]);
    }
  },
  methods: {
    initFilters() {
      return {
        name: { value: null },
        label: { value: null },
        "type.name": { value: null },
        "type.physical_name": { value: null },
        domain: { value: null },
        direction: { value: null },
        sensor_name: { value: null },
        // "asset.name": { value: null },
      };
    },
    onDetailsUpdate(details) {
      this.selectedRow.data.measuremet_details = details;
      alert("Save error, not implemented");
      //todo: store to db save
    },
    showDetails(row) {
      // console.info(row.data);
      this.selectedRow = row;
      this.measurementDetailsDialog = true;
    },
    onCreate(o, i) {
      alert(o);
      alert(i);
    },
    async loadData() {
      await this.$ren.measurementApi.measurements(this.objects).then((data) => {
        this.data = data;
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
