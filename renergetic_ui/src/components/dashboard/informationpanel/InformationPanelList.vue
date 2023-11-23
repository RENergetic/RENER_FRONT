<template>
  <!-- todo:  confirm buttons -->
  <!-- {{ panelList }} -->

  <DataTable :key="headers" :value="panelList">
    <!-- <Column v-for="h of headers" :key="h" :field="h" :header="$t('model.information_panel.' + h)"></Column> -->

    <Column field="id" :header="$t('model.panel.id')" :show-filter-menu="false"> </Column>
    <Column field="name" :header="$t('model.panel.name')" :show-filter-menu="false">
      <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" type="text" class="p-column-filter" :placeholder="$t('view.search')" @input="filterCallback()" />
      </template>
    </Column>
    <Column field="label" :header="$t('model.panel.label')" :show-filter-menu="false">
      <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" type="text" class="p-column-filter" :placeholder="$t('view.search')" @input="filterCallback()" />
      </template>
    </Column>
    <Column field="featured" :header="$t('model.panel.featured')" :show-filter-menu="false">
      <template #body="item">
        <i v-if="item.data.featured" class="pi pi-eye" style="font-size: 1.5rem" @click="setFeatured(item.data, false)" />
        <i v-else class="pi pi-eye-slash" style="font-size: 1.5rem" @click="setFeatured(item.data, true)" />
      </template>
    </Column>

    <Column field="is_template" :header="$t('model.panel.is_template')" :show-filter-menu="false">
      <template #body="item">
        <div style="height: 100%; width: 100%">
          <i v-if="item.data.is_template" class="pi pi-bookmark-fill" style="font-size: 1.5rem" />
          <i v-else class="pi pi-bookmark" style="font-size: 1.5rem" />
        </div>
      </template>
    </Column>
    <Column field="manage_asset_assignment" :header="$t('view.manage_asset_assignment')">
      <template #body="item">
        <span v-if="item.data.is_template" class="ren-pointer" @click="manageAssets(item.data)">
          {{ $t("view.manage_asset_assignment") }}
        </span>
        <span v-else>
          {{ $t("view.asset_management_only_template") }}
        </span>
      </template>
    </Column>

    <Column field="link" :header="$t('view.go_to_panel')">
      <template #body="item">
        <i v-if="!item.data.is_template" class="pi pi-chevron-circle-right" style="fontsize: 2rem" @click="openPanel(item.data)" />
        <i v-else class="pi pi-chevron-circle-right disabled" style="fontsize: 2rem" />
      </template>
    </Column>
    <Column field="edit">
      <template #body="item">
        <!--  :header="$t('view.edit')" -->
        <Button v-tooltip="$t('view.edit')" icon="pi pi-pencil" class="p-button-rounded" @click="editPanel(item.data)" />
      </template>
    </Column>
    <Column field="export">
      <template #body="item">
        <!--  :header="$t('view.export_json')" pi-file-export-->
        <Button v-tooltip="$t('view.export_json')" icon="pi pi-file" class="p-button-rounded" @click="exportJSON(item.data)" />
      </template> </Column
    ><Column field="delete">
      <template #body="item">
        <!-- :header="$t('view.button.delete')" -->
        <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="confirmDelete(item.data)" />
      </template>
    </Column>
  </DataTable>
  <Toolbar>
    <template #end><Button :label="$t('view.button.add')" icon="pi pi-plus-circle" @click="panelAdd = true" /> </template>
  </Toolbar>

  <RenSpinner ref="spinner"> </RenSpinner>
  <RenSpinner ref="assetSpinner" :lock="true" style="margin: auto; max-width: 95%">
    <template #content>
      <Dialog v-model:visible="assetManagementDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
        <div v-if="selectedAsset">
          <!-- <ren-input-wrapper :text-label="`${selectedAsset.label}(${selectedAsset.name})`"> -->
          <div class="ren">
            <ren-input-wrapper :text-label="null">
              <template #content>
                <Button
                  icon="pi pi-trash"
                  style="max-width: 45%"
                  :label="$t('view.button.revoke_asset_assignment', [`${selectedAsset.label}(${selectedAsset.name})`])"
                  @click="revoke"
                />
                <Button
                  style="max-width: 45%; margin-left: 5%"
                  icon="pi pi-sign-in"
                  :label="$t('view.button.asset_go_to_panel', [`${selectedAsset.label}(${selectedAsset.name})`])"
                  @click="openAssetPanel"
                />
              </template>
            </ren-input-wrapper>
          </div>
          <!-- {{ selectedAsset }} -->
        </div>
        <asset-list :basic="true" :asset-list="assetList" hidden-filters="true" @on-select="(evt) => (selectedAsset = evt)" />
        <div>
          <!-- <ren-input-wrapper :text-label="`${selectedAsset.label}(${selectedAsset.name})`"> -->
          <ren-input-wrapper :text-label="null">
            <template #content>
              <Button :label="$t('view.select_asset')" @click="$refs.assetSelectDialog.open()" />
            </template>
          </ren-input-wrapper>
          <!-- {{ selectedAsset }} -->
        </div>
      </Dialog>
    </template>
  </RenSpinner>
  <AssetSelectDialog ref="assetSelectDialog" @submit="onAssetSelect" />
  <Dialog v-model:visible="panelAdd" :style="{ width: '75vw', height: '95vh' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <InformationPanelForm @update:model-value="onCreate($event, 0)" @cancel="panelAdd = false"> </InformationPanelForm>
  </Dialog>
  <Dialog v-model:visible="panelEdit" :style="{ width: '75vw', height: '95vh' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <InformationPanelForm :model-value="editedPanel" @update:model-value="onEdit($event, 0)" @cancel="panelEdit = false" />
  </Dialog>
</template>
<script>
import InformationPanelForm from "./InformationPanelForm.vue";
import AssetSelectDialog from "@/components/management/infrastructure/AssetSelectDialog.vue";
import AssetList from "@/components/management/infrastructure/AssetList.vue";
function initFilter() {
  return {
    label: { value: null },
    name: { value: null },
  };
}
export default {
  name: "InformationPanelList",
  components: { InformationPanelForm, AssetSelectDialog, AssetList },

  props: {
    panelList: { type: Array, default: () => [] },
    filters: { type: Array, default: () => initFilter() },
    page: { type: Number, default: 0 },
    offset: { type: Number, default: 0 },
  },
  emits: ["update:filters", "reload", "update:page"],
  data() {
    return {
      headers: [],
      panelEdit: false,
      mPage: this.page,
      mOffset: this.offset,
      mFilters: this.filters ? this.filters : initFilter(),
      selectedRow: null,
      editedPanel: null,
      assetDialog: false,
      assetList: [],
      assetManagementDialog: false,
      panelAdd: false,
      selectedAsset: null,
    };
  },
  updated() {},
  async mounted() {
    if (this.panelList.length > 0) {
      this.headers = Object.keys(this.panelList[0]).filter((it) => it != "tiles");
    } else {
      this.headers = [];
    }
  },
  methods: {
    async manageAssets(item) {
      this.assetList = [];
      this.assetManagementDialog = true;
      this.selectedRow = item;
      this.loadAssets();
      // console.info(item);
    },
    async onAssetSelect(asset) {
      await this.$refs.assetSpinner.run(async () => {
        await this.$ren.dashboardApi.assignAsset(this.selectedRow.id, asset.id).then(async (res) => {
          if (res) {
            this.$emitter.emit("information", { message: this.$t("information.asset_panel_assigned") });
            await this.loadAssets();
          } else this.$emitter.emit("error", { message: this.$t("information.asset_panel_assigned") });
        });
      });
    },
    async setFeatured(selectedPanel, state) {
      await this.$refs.spinner.run(async () => {
        await this.$ren.dashboardApi.setFeatured(selectedPanel.id, state).then(async (res) => {
          selectedPanel.featured = res;
          if (res == state) {
            this.$emitter.emit("information", { message: this.$t("information.visibility_changed") });
            await this.loadAssets();
          } else this.$emitter.emit("error", { message: this.$t("information.visibility_changed") });
        });
      });
      // console.info(selectedPanel);
      // console.info(state);
    },
    async revoke() {
      await this.$refs.assetSpinner.run(async () => {
        await this.$ren.dashboardApi.revokeAsset(this.selectedRow.id, this.selectedAsset.id).then(async (res) => {
          if (res) {
            this.$emitter.emit("information", { message: this.$t("information.asset_panel_revoked") });
            await this.loadAssets();
          } else this.$emitter.emit("error", { message: this.$t("information.asset_panel_revoked") });
        });
      });
    },
    // onFilter(ev) {
    //   this.mFilters = ev.filters;
    //   this.deferredEmitFilter.run();
    // },
    openPanel(panel) {
      // let to = `/panel/view/${selected.id}`;
      // this.$router.push(to);
      this.$ren.utils.openNewTab(`/panel/view/${panel.id}`);
    },

    openAssetPanel() {
      this.$ren.utils.openNewTab(`/asset/${this.selectedAsset.id}/panel/view/${this.selectedRow.id}`);
    },

    async editPanel(o) {
      this.selectedRow = o;
      await this.$refs.spinner.run(async () => {
        await this.$ren.dashboardApi.getInformationPanel(o.id).then(async (res) => {
          this.editedPanel = res;
        });
      });
      this.panelEdit = true;
    },
    async exportJSON(o) {
      await this.$refs.spinner.run(async () => {
        await this.$ren.dashboardApi.getInformationPanel(o.id).then(async (res) => {
          this.$ren.utils.downloadJSON(res, `${res.name}_${res.id}`);
        });
      });
    },
    reload() {
      this.$emit("reload");
    },
    async deletePanel(panel) {
      await this.exportJSON(panel);
      await this.$refs.spinner.run(async () => {
        await this.$ren.dashboardApi.deleteInformationPanel(panel.id);
      });
      await this.reload();
    },
    confirmDelete(panel) {
      this.$confirm.require({
        message: this.$t("view.panel_delete_confirm", {
          panel: panel,
          label: panel.label,
        }),
        header: this.$t("view.panel_delete"),
        icon: "pi pi-exclamation-triangle",
        accept: () => this.deletePanel(panel),
        reject: () => this.$confirm.close(),
      });
    },
    async loadAssets() {
      this.$refs.assetSpinner.run(async () => {
        await this.$ren.dashboardApi.getPanelConnectedAssets(this.selectedRow.id).then((list) => {
          this.assetList = list;
        });
      });
    },
    async onCreate(o) {
      await this.$ren.dashboardApi.saveInformationPanel(o).then((panel) => {
        this.$emitter.emit("information", { message: this.$t("information.panel_update", [panel.id]) });
        this.reload();
      });
    },
    async onEdit(o) {
      await this.$ren.dashboardApi.updateInformationPanel(o).then((panel) => {
        this.$emitter.emit("information", { message: this.$t("information.panel_update", [panel.id]) });
        this.reload();
      });
    },
  },
};
</script>

<style lang="scss">
// i.pi {
//   margin-left: 0.25rem;
// }
// .flex > div {
//   flex-grow: 1;
// }
</style>
