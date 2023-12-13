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
        <!-- <Column field="edit" :header="$t('view.edit')"> <template #body>todo:</template></Column> -->
      </DataTable>
    </template>
  </RenSpinner>
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
  async mounted() {
    await this.loadData();
  },
  methods: {
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
      // console.info(selectedPanel);
      // console.info(state);
    },
    async updateType(type, key, value) {
      //updateMeasurementType
      if (type[key] + "" != value + "") {
        type[key] = value;
        await this.$ren.managementApi.updateMeasurementType(type).then((resp) => {
          type[key] = resp[key];
        });
      }
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
