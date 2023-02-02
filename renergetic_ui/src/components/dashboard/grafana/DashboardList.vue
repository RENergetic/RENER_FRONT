<template>
  <!-- {{ mDashboards }} -->
  <DataTable
    v-if="mDashboards"
    paginator-template="CurrentPageReport  PrevPageLink PageLinks NextPageLink    "
    :paginator="true"
    :rows="10"
    :value="mDashboards"
    data-key="name"
    :filters="filters"
    filter-display="row"
    responsive-layout="scroll"
    :global-filter-fields="['name', 'label']"
  >
    <Column name="name" :header="$t('model.dashboard.name')">
      <template #body="slotProps">
        {{ slotProps.data.label ? slotProps.data.label + " (" + slotProps.data.name + ")" : slotProps.data.name }}
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

    <Column name="delete" :header="$t('view.delete')">
      <template #body="slotProps">
        <i v-tooltip="$t('view.delete')" class="pi pi-trash" @click="deleteConfirm(slotProps.data)" /></template
    ></Column>
    <!-- <Column field="geo_location" :header="$t('model.asset.geo_location')"> </Column> -->
    <template #header>
      <div class="flex justify-content-end align-content-end">
        <div class="flex align-items-center" style="flex-grow: 0">
          <!-- <i class="pi pi-search" /> -->
          <InputText v-model="filters['global'].value" :placeholder="$t('view.search')" />
          <i v-if="filters.state" class="pi pi-filter active" :label="$t('view.button.filter')" @click="setFilter" />
          <i v-else class="pi pi-filter" :label="$t('view.button.filter')" @click="setFilter" />
          <i
            v-if="filters.state"
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
          <!-- TODO: pagination buttons ?-->
          <!-- <Button
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
          /> -->
        </div>
        <div style="text-align: end">
          <i class="pi pi-plus-circle ren add-button" label="$t('view.button.add')" @click="addDialog = true" />
        </div>
      </div>
    </template>
  </DataTable>

  <Dialog
    v-model:visible="editDialog"
    :style="{ width: '75vw' }"
    :maximizable="true"
    :modal="true"
    :dismissable-mask="true"
  >
    <DashboardForm v-if="selectedRow" :dashboard="selectedRow" @save="onEdit" @cancel="editDialog = false" />
    <DashboardForm v-else @save="onCreate" @cancel="editDialog = false" />
  </Dialog>
  <Dialog v-model:visible="addDialog" :style="{ width: '75vw' }" :modal="true" :dismissable-mask="true">
    <DashboardForm @save="onCreate" @cancel="addDialog = false" />
  </Dialog>
  <DeleteDashboard ref="deleteDashboard" :dashboard="selectedRow" @delete="onDelete" />
</template>

<script>
import DashboardForm from "./DashboardForm.vue";
import DeleteDashboard from "@/components/dashboard/grafana/DeleteDashboard.vue";

// const PAGE_SIZE = 10;
export default {
  name: "DashboardList",
  components: { DashboardForm, DeleteDashboard },
  props: { dashboards: { type: Array, default: () => [] } },
  emits: ["reload"],
  data() {
    return {
      mDashboards: this.dashboards,
      page: 0,
      selectedRow: null,
      editDialog: false,
      addDialog: false,
      filters: this.initFilter(),
    };
  },
  // mounted: {
  //     mDashboards= this.dashboards,
  // },
  watch: {
    dashboards: function (v) {
      this.mDashboards = v;
      this.filter();
    },
  },
  async created() {},
  methods: {
    navigate(url) {
      window.open(url, "_blank");
    },
    // onFilter(ev) {
    //   this.filters = ev.filters;
    // },

    edit(row) {
      // console.info(row);
      this.selectedRow = row;
      this.editDialog = true;
    },

    async onEdit(o) {
      await this.$ren.dashboardApi.update(o).then((res) => {
        if (res) {
          this.$emitter.emit("information", { message: this.$t("information.dashboard_updated") });
          this.editDialog = false;
          this.reload();
        } else {
          this.$emitter.emit("error", { message: this.$t("information.dashboard_not_updated") });
        }
      });
    },
    async onCreate(o) {
      // console.log(o);
      await this.$ren.dashboardApi.add(o).then((dashboard) => {
        console.info("add dashboard:" + dashboard.name);
        this.$emitter.emit("information", { message: this.$t("information.dashboard_created") });
      });
      this.addDialog = false;
      this.reload();
    },

    async reload() {
      //TODO: filter
      this.$emit("reload", { q: this.filters.global.value, page: this.page });
    },
    async setFilter() {
      // console.info(this.filters.global.value);
      this.filters.state = true;

      this.filter();
    },
    filter() {
      if (!this.filters.state) {
        return;
      }
      let q = this.filters.global.value;
      function f(d) {
        return (
          d.name.toLowerCase().includes(q) ||
          d.url.includes(q) ||
          (d.label != null && d.label.toLowerCase().includes(q))
        );
      }
      this.mDashboards = this.dashboards.filter(f);
      // this.reload()
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
      this.mDashboards = this.dashboards;
    },
    deleteConfirm(o) {
      this.selectedRow = o;
      this.$refs.deleteDashboard.delete();
    },
    // onDelete(o){
    onDelete() {
      this.selectedRow = null;
      this.$emit("reload", { q: this.filters.global.value, page: this.page });
    },
    initFilter() {
      return {
        state: false,
        global: { value: null }, //, matchMode: FilterMatchMode.CONTAINS
      };
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.active {
  background-color: rgba(100, 225, 100, 0.5);
  border-radius: 100%;
  padding: 0.4rem;
}
</style>
