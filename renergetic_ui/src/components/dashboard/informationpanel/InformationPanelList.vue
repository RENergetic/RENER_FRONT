<template>
  <!-- todo:  confirm buttons -->

  <DataTable :key="headers" :value="panelList">
    <!-- <Column v-for="h of headers" :key="h" :field="h" :header="$t('model.information_panel.' + h)"></Column> -->

    <Column field="id" :header="$t('model.information_panel.id')" :show-filter-menu="false"> </Column>
    <Column field="name" :header="$t('model.information_panel.name')" :show-filter-menu="false">
      <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" type="text" class="p-column-filter" :placeholder="$t('view.search')" @input="filterCallback()" />
      </template>
    </Column>
    <Column field="label" :header="$t('model.information_panel.label')" :show-filter-menu="false">
      <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" type="text" class="p-column-filter" :placeholder="$t('view.search')" @input="filterCallback()" />
      </template>
    </Column>
    <Column field="featured" :header="$t('model.information_panel.featured')" :show-filter-menu="false">
      <template #body="item">
        <i v-if="item.data.featured" class="pi pi-eye" style="font-size: 1.5rem" @click="setFeatured(item.data, false)" />
        <i v-else class="pi pi-eye-slash" style="font-size: 1.5rem" @click="setFeatured(item.data, true)" />
      </template>
    </Column>

    <Column field="is_template" :header="$t('model.information_panel.is_template')" :show-filter-menu="false">
      <template #body="item">
        <div style="height: 100%; width: 100%">
          <i v-if="item.data.is_template" class="pi pi-bookmark-fill" style="font-size: 1.5rem" />
          <i v-else class="pi pi-bookmark" style="font-size: 1.5rem" />
        </div>
      </template>
    </Column>
    <Column field="manage_asset_assignment" :header="$t('view.manage_asset_assignment')">
      <template #body="item">
        <span
          v-if="item.data.is_template"
          v-tooltip="$t('view.manage_panel_asset_assignment_description')"
          class="ren-pointer"
          @click="manageAssets(item.data)"
        >
          {{ $t("view.manage_panel_asset_assignment") }}
        </span>
        <span v-else v-tooltip="$t('view.panel_asset_management_only_template')" class="disabled">
          {{ $t("view.na") }}
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
        <Button v-tooltip="$t('view.edit')" icon="pi pi-pencil" class="p-button-rounded" @click="editPanel(item.data)" />
      </template>
    </Column>
    <Column field="export">
      <template #body="item">
        <Button v-tooltip="$t('view.export_json_template')" icon="pi pi-file" class="p-button-rounded" @click="exportPanelTemplate(item.data)" />
        <Button
          v-if="!item.data.is_template"
          v-tooltip="$t('view.export_json')"
          icon="pi pi-download"
          class="p-button-rounded"
          @click="exportPanel(item.data)"
        />
      </template>
    </Column>
    <Column field="delete">
      <template #body="item">
        <!-- :header="$t('view.button.delete')" -->
        <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="confirmDelete(item.data)" />
      </template>
    </Column>
  </DataTable>
  <ren-paginator v-model:offset="mOffset" style="left: 0" sticky :limit="limit" :current-rows="panelList.length" @update="onPagination" />
  <Toolbar class="ren-toolbar ren-sticky">
    <template #end><Button :label="$t('view.button.add')" icon="pi pi-plus-circle" @click="panelAdd = true" /> </template>
  </Toolbar>
  <RenSpinner ref="spinner" />
  <RenSpinner ref="assetSpinner" :lock="true" style="margin: auto; max-width: 95%">
    <template #content>
      <Dialog
        id="asset-panel-dialog"
        v-model:visible="assetManagementDialog"
        :style="{ width: '75vw', height: '90vh' }"
        :maximizable="true"
        :modal="true"
        :dismissable-mask="true"
      >
        <Card class="ren-page-content">
          <template #content>
            <div class="asset-panel-list">
              <asset-list :basic="true" :asset-list="assetList" hidden-filters="true" @on-select="(evt) => (selectedAsset = evt)" />
            </div>
            <Toolbar class="ren-toolbar ren-sticky bottom">
              <template #end>
                <ren-input-wrapper :text-label="null">
                  <template #content>
                    <Button :label="$t('view.add_asset_panel')" @click="$refs.assetSelectDialog.open()" />
                  </template>
                </ren-input-wrapper>
              </template>
              <template v-if="selectedAsset" #start>
                <span style="font-size: 1.2rem; margin-right: 0.75rem">
                  <b>{{ `${selectedAsset.label}(${selectedAsset.name}):` }}</b>
                </span>
                <Button
                  v-tooltip="$t('view.button.asset_go_to_panel', [`${selectedAsset.label}(${selectedAsset.name})`])"
                  class="p-button-rounded"
                  icon="pi pi-chevron-circle-right"
                  @click="openAssetPanel"
                />
                <Button
                  v-tooltip="$t('view.button.revoke_asset_assignment', [`${selectedAsset.label}(${selectedAsset.name})`])"
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-danger"
                  @click="revoke"
                />
                <Button v-tooltip="$t('view.export_json')" class="p-button-rounded" icon="pi pi-download" @click="exportAssetPanel" />
              </template>
            </Toolbar>
          </template>
        </Card>
      </Dialog>
    </template>
  </RenSpinner>
  <AssetSelectDialog ref="assetSelectDialog" @submit="onAssetSelect" />
  <Dialog
    v-model:visible="panelAdd"
    :closable="false"
    :style="{ width: '90vw', height: '100vh', maxHeight: '100%', paddingTop: '1rem' }"
    :modal="true"
    :dismissable-mask="true"
    :show-header="false"
  >
    <InformationPanelForm @update:model-value="onCreate($event, 0)" @cancel="panelAdd = false"> </InformationPanelForm>
  </Dialog>
  <Dialog
    v-model:visible="panelEdit"
    :closable="false"
    :style="{ width: '90vw', height: '100vh', maxHeight: '100%', paddingTop: '1rem' }"
    :modal="true"
    :dismissable-mask="true"
    :show-header="false"
  >
    <InformationPanelForm :model-value="editedPanel" @update:model-value="onEdit($event, 0)" @cancel="panelEdit = false" />
  </Dialog>
</template>
<script>
import InformationPanelForm from "./InformationPanelForm.vue";
import { getCleanPanelStructure } from "./InformationPanelForm.vue";
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
  emits: ["update:filters", "reload"],
  data() {
    return {
      headers: [],
      panelEdit: false,
      limit: 15,
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
    async exportAssetPanel() {
      await this.$refs.spinner.run(async () => {
        await this.$ren.dashboardApi.getInformationPanel(this.selectedRow.id, this.selectedAsset.id).then(async (panel) => {
          this.mExportJSON(panel, false);
        });
      });
    },
    mExportJSON(panel, asTemplate) {
      let panelTemplate = getCleanPanelStructure(panel, asTemplate);

      let filename = asTemplate ? `template_${panel.name}` : `${panel.id}_${panel.name}`;
      this.$ren.utils.downloadJSON(panelTemplate, filename, true);
    },
    async mExportPanel(panelId, asTemplate) {
      await this.$refs.spinner.run(async () => {
        await this.$ren.dashboardApi.getInformationPanel(panelId).then(async (panel) => {
          this.mExportJSON(panel, asTemplate);
        });
      });
    },
    async exportPanel(o) {
      await this.mExportJSON(o.id, false);
    },
    async exportPanelTemplate(o) {
      await this.mExportJSON(o.id, true);
    },

    reload() {
      this.$emit("reload");
    },
    onPagination(ev) {
      this.$emit("reload", ev);
    },
    async deletePanel(panel) {
      await this.exportJSON(panel, false); //export full panel
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
        this.panelAdd = false;
      });
    },
    async onEdit(o) {
      await this.$ren.dashboardApi.updateInformationPanel(o).then((panel) => {
        this.$emitter.emit("information", { message: this.$t("information.panel_update", [panel.id]) });
        this.reload();
        this.panelEdit = false;
      });
    },
  },
};
</script>

<style lang="scss">
#asset-panel-dialog {
  .p-card-body {
    height: 100%;
  }

  .ren-page-content {
    height: 100%;
  }

  .p-card-content {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .asset-panel-list {
    // flex-grow: 1;
    overflow: auto;
  }
}
</style>
