<template>
  <DataTable v-if="paginatedDashboards" class="sticky-header" :value="paginatedDashboards" data-key="name">
    <Column name="name" :header="$t('model.dashboard.name')">
      <template #body="slotProps">
        {{ slotProps.data.label ? slotProps.data.label + " (" + slotProps.data.name + ")" : slotProps.data.name }}
      </template>
    </Column>
    <Column field="ext.model" :header="$t('model.dashboard.model')" :show-filter-menu="false"> </Column>
    <Column field="measurement_type.physical_name" :header="$t('model.dashboard.measurement_type')"> </Column>
    <Column field="measurement_type.unit" :header="$t('model.dashboard.unit')"> </Column>
    <Column field="url" :header="$t('model.dashboard.url')">
      <template #body="slotProps">
        {{ slotProps.data.url }}
        <i v-if="slotProps.data.url" v-tooltip="$t('view.go_to_dashboard')" class="pi pi-arrow-circle-right" @click="navigate(slotProps.data.url)" />
      </template>
    </Column>
    <Column field="grafana_id" :header="$t('model.dashboard.grafana_id')"> </Column>
    <!-- <Column field="user" :header="$t('model.dashboard.user')">
      <template #body="slotProps">
        <span v-if="slotProps.data.user">
          {{ slotProps.data.user }}
        </span>
        <span v-else class="disabled">
          {{ $t("view.na") }}
        </span>
      </template>
    </Column> -->

    <Column v-if="canEdit" name="edit" :header="$t('view.edit')">
      <template #body="slotProps">
        <Button v-tooltip="$t('view.edit')" icon="pi pi-pencil" class="p-button-rounded" @click="edit(slotProps.data)" />
      </template>
    </Column>

    <Column v-if="canEdit" name="delete" :header="$t('view.delete')">
      <template #body="slotProps">
        <Button v-tooltip="$t('view.delete')" icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="deleteConfirm(slotProps.data)" />
      </template>
    </Column>
    <!-- <Column field="geo_location" :header="$t('model.asset.geo_location')"> </Column> -->
    <template #header>
      <div class="flex justify-content-end align-content-end">
        <div v-if="!canEdit" class="flex justify-content-start align-content-start" style="flex-grow: 1">
          <i v-tooltip="$t('view.edit_locked')" class="pi pi-lock" />
        </div>
        <div class="flex align-items-center" style="flex-grow: 0">
          <InputText v-model="filters['global'].value" :placeholder="$t('view.search')" />
          <i v-if="filters.state" class="pi pi-filter-slash" :label="$t('view.button.clear_filter')" @click="clearFilter" />
        </div>
      </div>
      <div class="flex justify-content-between"></div>
    </template>
  </DataTable>
  <ren-paginator
    v-if="mDashboards"
    v-model:offset="mOffset"
    style="left: 0"
    sticky
    :limit="limit"
    :current-rows="paginatedDashboards.length"
    @update="onPagination"
  />
  <Toolbar class="ren-toolbar ren-sticky">
    <template #end>
      <Button icon="pi pi-plus-circle" :label="$t('view.button.add')" class="mr-2" @click="addDialog = true" />
    </template>
  </Toolbar>

  <Dialog v-model:visible="editDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <DashboardForm v-if="selectedRow" :dashboard="selectedRow" @save="onEdit" @cancel="editDialog = false" />
    <DashboardForm v-else @save="onCreate" @cancel="editDialog = false" />
  </Dialog>
  <Dialog v-model:visible="addDialog" :style="{ width: '75vw' }" :modal="true" :dismissable-mask="true">
    <DashboardForm @save="onCreate" @cancel="addDialog = false" />
  </Dialog>
  <DeleteDashboard ref="deleteDashboard" :dashboard="selectedRow" @delete="onDelete" />
</template>

<script>
import { RenRoles } from "@/plugins/model/Enums";
import DashboardForm from "./DashboardForm.vue";
import DeleteDashboard from "@/components/dashboard/grafana/DeleteDashboard.vue";
var PAGE_SIZE = 10;
var flags = RenRoles.REN_ADMIN | RenRoles.REN_TECHNICAL_MANAGER;
export default {
  name: "DashboardList",
  components: { DashboardForm, DeleteDashboard },
  props: { dashboards: { type: Array, default: () => [] } },
  emits: ["reload"],
  data() {
    return {
      canEdit: flags & this.$store.getters["auth/renRole"],
      mDashboards: this.dashboards,
      paginatedDashboards: this.dashboards ? this.dashboards.slice(0, PAGE_SIZE) : null,
      limit: PAGE_SIZE,
      mOffset: 0,
      selectedRow: null,
      editDialog: false,
      addDialog: false,
      filters: this.initFilter(),
    };
  },
  watch: {
    dashboards: function (v) {
      this.mDashboards = v;
      this.filter();
    },
    filters: {
      handler: function (v) {
        if (v != null && v.global != null && v.global.value) {
          v.state = true;
          this.filter();
        } else {
          v.state = false;
          this.mOffset = 0;
          this.mDashboards = this.dashboards;
          this.onPagination();
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.onPagination();
  },
  async created() {},
  methods: {
    navigate(url) {
      window.open(url, "_blank");
    },

    edit(row) {
      // console.info(row);
      this.selectedRow = row;
      this.editDialog = true;
    },
    onPagination() {
      this.paginatedDashboards = this.mDashboards.slice(this.mOffset, this.mOffset + PAGE_SIZE);
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
      await this.$ren.dashboardApi.add(o).then((dashboard) => {
        console.info("add dashboard:" + dashboard.name);
        this.$emitter.emit("information", { message: this.$t("information.dashboard_created") });
      });
      this.addDialog = false;
      this.reload();
    },

    async reload() {
      this.filters = this.initFilter();
      this.mOffset = 0;
      this.mDashboards = this.dashboards;
      this.paginatedDashboards = this.mDashboards ? this.mDashboards.slice(0, PAGE_SIZE) : null;
      this.$emit("reload", { q: this.filters.global.value, limit: this.limit, offset: this.mOffset });
    },
    filter() {
      if (!this.filters.state) {
        this.onPagination();
        return;
      }
      let q = this.filters.global.value;
      function f(d) {
        return d.name.toLowerCase().includes(q) || d.url.includes(q) || (d.label != null && d.label.toLowerCase().includes(q));
      }
      this.mDashboards = this.dashboards.filter(f);
      this.mOffset = 0;
      this.onPagination();
    },
    clearFilter() {
      this.mOffset = 0;
      this.mDashboards = this.dashboards;
      this.paginatedDashboards = this.mDashboards.slice(this.mOffset, this.mOffset + PAGE_SIZE);
      this.filters = this.initFilter();
    },
    deleteConfirm(o) {
      this.selectedRow = o;
      this.$refs.deleteDashboard.delete(o);
    },
    // onDelete(o){
    onDelete() {
      this.selectedRow = null;
      this.reload();
    },
    initFilter() {
      return {
        state: false,
        global: { value: null },
      };
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
