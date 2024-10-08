<template>
  <!--  TODO: edit measuremet tpes -->
  <InfoIcon :show-icon="false">
    <template #content>
      <!-- some info -->
    </template>
  </InfoIcon>
  <RenSpinner ref="spinner" :lock="true" style="min-width: 100%">
    <!--  max-width: 80vw -->

    <template #content>
      <!-- scrollable scroll-height="70vh" -->
      <DataTable :value="typeList">
        <Column field="id" :header="$t('model.measurement_type.id')">
          <template #body="item">
            <span> ({{ item.data.id }}) {{ item.data.label ? `${item.data.label} (${item.data.name})` : item.data.name }}</span>
          </template>
        </Column>
        <Column v-for="col of columns" :key="col" :field="col" :header="$t('model.measurement_type.' + col)">
          <template v-if="col == 'color' || col == 'description'" #body="item">
            <!-- {{ item }} -->
            <ren-input v-model="item.data[col]" :inline="true" @submit="(evt) => updateType(item.data, col, evt)" />
          </template>
          <template v-else #body="item">{{ item.data[col] }}</template>
        </Column>

        <Column field="dashboard_visibility" :header="$t('model.measurement_type.dashboardVisibility')" :show-filter-menu="false">
          <template #body="item">
            <i v-if="item.data.dashboard_visibility" class="pi pi-eye" style="font-size: 1.5rem" @click="setDashboardVisibility(item.data, false)" />
            <i v-else class="pi pi-eye-slash" style="font-size: 1.5rem" @click="setDashboardVisibility(item.data, true)" />
          </template>
        </Column>
        <Column field="delete" :header="$t('view.delete')">
          <template #body="item">
            <Button v-tooltip="$t('view.delete')" icon="pi pi-trash" class="p-button-rounded" @click="deleteType(item.data)" />
          </template>
        </Column>
      </DataTable>
      <Button v-tooltip="$t('view.add')" icon="pi pi-plus-circle" class="p-button-rounded" @click="addDialog = true" />
      <Dialog v-model:visible="addDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
        <MeasurementTypeForm @update="onTypeSubmit($event)" @cancel="addDialog = false" />
      </Dialog>
    </template>
  </RenSpinner>
</template>

<script>
import InfoIcon from "../../../miscellaneous/InfoIcon.vue";
import MeasurementTypeForm from "./MeasurementTypeForm.vue";
export default {
  name: "MeasurementTypeList",
  components: { InfoIcon, MeasurementTypeForm },
  props: {},
  data() {
    return {
      addDialog: false,
      typeList: [],
      columns: [],
    };
  },
  computed: {},
  watch: {},
  async mounted() {
    await this.loadData();
  },
  methods: {
    measurementTypeLabel(type) {
      return this.$te("enums.metric_type." + type.name) ? this.$t("enums.metric_type." + type.name) : type.label ? type.label : type.name;
    },
    async setDashboardVisibility(measurementType, state) {
      await this.$refs.spinner.run(async () => {
        await this.$ren.managementApi.setMeasurementTypeVisibility(measurementType.id, state).then(async (res) => {
          measurementType.dashbhoardVisibility = res;
          if (res == state) {
            this.$emitter.emit("information", { message: this.$t("information.visibility_changed") });
            await this.loadData();
          } else this.$emitter.emit("error", { message: this.$t("information.visibility_changed") });
        });
      });
    },
    async deleteType(type) {
      this.$confirm.require({
        message: this.$t("view.measurement_type_delete_description", {
          role: this.measurementTypeLabel(type),
        }),
        header: this.$t("view.measurement_type_delete"),
        icon: "pi pi-exclamation-triangle",
        accept: async () =>
          await this.$ren.managementApi.deleteMeasurementType(type).then(async () => {
            // if (resp) this.infoDialog(this.$t("view.measurement_type_deleted")).show();
            await this.loadData();
          }),
        reject: () => this.$confirm.close(),
      });
    },

    async onTypeSubmit(type) {
      await this.$ren.managementApi.addMeasurementType(type).then((resp) => {
        this.infoDialog(this.$t("view.measurement_type_added", { name: resp.name })).show();
        this.addDialog = false;
      });
      await this.loadData();
    },
    async updateType(type, key, value) {
      //updateMeasurementType
      if (type[key] + "" != value + "") {
        type[key] = value;
        await this.$ren.managementApi.updateMeasurementType(type).then((resp) => {
          type[key] = resp[key];
        });
      }
      await this.loadData();
    },
    async loadData() {
      await this.$refs.spinner.run(async () => {
        this.typeList = await this.$ren.managementApi.listMeasurementType();
      });
      if (this.typeList != null && this.typeList.length > 0) {
        this.columns = Object.keys(this.typeList[0]).filter((it) => it != "dashboard_visibility" && it != "name" && it != "label" && it != "id");
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
