<template>
  <!-- {{ mDashboards }} -->
  <!-- :filters="filters"
    filter-display="row"
    :global-filter-fields="['name', 'label','url']" 
    :paginator="true"
    :rows="10" -->
  <DataTable
    v-if="mDashboards && limit != null"
    :value="mDashboards"
    :rows="limit"
    :first="mOffset"
    paginator-template=""
    paginator
    data-key="name"
    responsive-layout="scroll"
  >
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
          <!-- <i class="pi pi-search" /> -->
          <InputText v-model="filters['global'].value" :placeholder="$t('view.search')" />
          <i v-if="filters.state" class="pi pi-filter active" :label="$t('view.button.filter')" @click="setFilter" />
          <i v-else class="pi pi-filter" :label="$t('view.button.filter')" @click="setFilter" />
          <i v-if="filters.state" class="pi pi-filter-slash" :label="$t('view.button.clear_filter')" @click="clearFilter" />
        </div>
      </div>
      <div class="flex justify-content-between"></div>
    </template>
    <!-- <template #footer>
      <div class="flex justify-content-between">
        <RenPaginator ref="pag" v-model:offset="mOffset" :total-rows="mDashboards.length" @update="searchAsset" />

        <div class="flex justify-content-between">
          <div v-if="canEdit" style="text-align: end">
            <Button icon="pi pi-plus-circle" :label="$t('view.button.add')" @click="addDialog = true" />
          </div>
        </div>
      </div>
    </template> -->
  </DataTable>
  <div>
    <div class="flex justify-content-between">
      <RenPaginator ref="pag" v-model:offset="mOffset" :total-rows="mDashboards.length" @update="searchAsset" />
    </div>
    <Toolbar>
      <template #end>
        <Button icon="pi pi-plus-circle" :label="$t('view.button.add')" class="mr-2" @click="addDialog = true" />
      </template>
    </Toolbar>
  </div>
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
      limit: null,
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
  },
  mounted() {
    this.limit = this.$refs && this.$refs.pag ? this.$refs.pag.limit : 10;
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
      this.$emit("reload", { q: this.filters.global.value, limit: this.limit, offset: this.mOffset });
    },
    async setFilter() {
      this.filters.state = true;
      this.filter();
    },
    filter() {
      if (!this.filters.state) {
        return;
      }
      let q = this.filters.global.value;
      function f(d) {
        return d.name.toLowerCase().includes(q) || d.url.includes(q) || (d.label != null && d.label.toLowerCase().includes(q));
      }
      this.mDashboards = this.dashboards.filter(f);
      // this.reload()
    },
    clearFilter() {
      this.filters = this.initFilter();
      this.mDashboards = this.dashboards;
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
        global: { value: null }, //, matchMode: FilterMatchMode.CONTAINS
      };
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
