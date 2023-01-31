<template>
  <!-- {{ dashboards }} -->
  <div class="col-12">
    <RenSpinner ref="spinner" :lock="true">
      <template #content>
        <DataTable
          v-if="dashboards"
          :value="dashboards"
          :lazy="true"
          data-key="name"
          :filters="filters"
          filter-display="row"
          :loading="isLoading"
          responsive-layout="scroll"
          :global-filter-fields="['name', 'label']"
        >
          <Column name="name" :header="$t('model.dashboard.name')">
            <template #body="slotProps">
              {{ slotProps.data.label ? slotProps.data.label + "(" + slotProps.data.name + ")" : slotProps.data.name }}
            </template>
          </Column>
          <Column field="ext.model" :header="$t('model.dashboard.model')" :show-filter-menu="false"> </Column>
          <Column field="ext.measurement_type" :header="$t('model.dashboard.measurement_type')"> </Column>
          <Column field="ext.unit" :header="$t('model.dashboard.unit')"> </Column>
          <Column field="url" :header="$t('model.dashboard.url')">
            <template #body="slotProps">
              {{ slotProps.data.url }}
              <i
                v-if="slotProps.data.url"
                v-tooltip="$t('view.go_to_dashboard')"
                class="pi pi-arrow-circle-right"
                @click="navigate(slotProps.data.url)"
              />
            </template>
          </Column>

          <Column field="user" :header="$t('model.dashboard.user')">
            <template #body="slotProps">
              <span v-if="slotProps.data.user">
                {{ slotProps.data.user }}
              </span>
              <span v-else class="disabled">
                {{ $t("view.na") }}
              </span>
            </template>
          </Column>

          <Column name="edit" :header="$t('view.edit')">
            <template #body="slotProps">
              <i v-tooltip="$t('view.edit')" class="pi pi-pencil" @click="edit(slotProps.data)" /></template
          ></Column>
          <!-- <Column field="geo_location" :header="$t('model.asset.geo_location')"> </Column> -->
          <template #header>
            <div class="flex justify-content-end align-content-end">
              <div class="flex align-items-center" style="flex-grow: 0">
                <!-- <i class="pi pi-search" /> -->
                <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                <i class="pi pi-filter" :label="$t('view.button.filter')" @click="reload" />
                <i
                  v-if="filters['global'] && filters['global'].value"
                  class="pi pi-filter-slash"
                  :label="$t('view.button.clear_filter')"
                  @click="clearFilter"
                />
              </div>
            </div>
            <div class="flex justify-content-between"></div>
          </template>
          <template #footer>
            <div class="flex justify-content-between">
              <div>
                <Button
                  type="button"
                  icon="pi pi-filter-slash"
                  :label="$t('view.button.previous')"
                  class="p-button-outlined"
                  @click="previous"
                />

                <Button
                  type="button"
                  icon="pi pi-filter-slash"
                  :label="$t('view.button.next')"
                  class="p-button-outlined"
                  @click="next"
                />
              </div>
              <div style="text-align: end">
                <i class="pi pi-plus-circle ren add-button" label="$t('view.button.add')" @click="editDialog = true" />
              </div>
            </div>
          </template>
        </DataTable>
      </template>
    </RenSpinner>
  </div>

  <Dialog
    v-model:visible="editDialog"
    :style="{ width: '75vw' }"
    :maximizable="true"
    :modal="true"
    :dismissable-mask="true"
  >
    <!-- {{ selectedRow.measurements }} -->
    <DashboardForm v-if="selectedRow" :dashboard="selectedRow" @save="onEdit" @cancel="editDialog = false" />
    <DashboardForm v-else @save="onCreate" @cancel="editDialog = false" />

    <!-- <Button :label="$t('view.button.add_measurement')" @click="addMeasurement" /> -->
  </Dialog>
</template>

<script>
import DashboardForm from "./DashboardForm.vue";

const PAGE_SIZE = 10;
export default {
  name: "DashboardList",
  components: { DashboardForm },
  props: { dashboards: { type: Array, default: () => [] } },
  data() {
    return {
      mDashboards: this.dashboards,
      page: 0,
      isLoading: false,
      columns: [],
      selectedRow: null,
      editDialog: false,
      filters: this.initFilter(),
    };
  },
  computed: {},
  async created() {
    this.assetList = await this.$ren.managementApi.listAsset();
    if (this.assetList != null && this.assetList.length > 0) {
      this.columns = Object.keys(this.assetList[0]);
    }
  },
  methods: {
    navigate(url) {
      window.open(url, "_blank");
    },
    onFilter(ev) {
      this.filters = ev.filters;
    },

    edit(row) {
      console.info(row);
      this.selectedRow = row;
      this.editDialog = true;
    },

    onEdit(evt) {
      console.info(evt);
      alert("todo");
    },
    async onCreate(o) {
      alert("todo");
      console.error("AQUI HA LLEGADO");
      console.log(o);
      await this.$ren.managementApi.addAsset(o).then((assetId) => {
        console.info("add asset:" + assetId);
        // o.id = assetId;
        // this.assetList.push(o);
      });
      this.reload();
    },

    async reload() {
      //TODO: tomek will manage filtering feature with api
      console.info(this.filters);
      let params = {
        label: this.filters.label.value,
        name: this.filters.name.value,
        type: this.filters["type.label"] ? this.filters["type.label"].value.name : null,
        category: this.filters["category.label"] ? this.filters["category.label"].value.name : null,
      };

      console.info(params);
      this.assetList = await this.$ren.managementApi.listAsset(params, PAGE_SIZE * this.page, PAGE_SIZE);
    },
    next() {
      if (this.assetList.lenth == 0) return;
      this.page += 1;
    },
    previous() {
      this.page = Math.max(0, this.page - 1);
    },
    clearFilter() {
      this.filters = this.initFilter();
    },

    initFilter() {
      return {
        global: { value: null }, //, matchMode: FilterMatchMode.CONTAINS
      };
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
