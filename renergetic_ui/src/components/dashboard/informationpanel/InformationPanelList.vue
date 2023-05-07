<template>
  <!-- <RenSpinner ref="spinner1"></RenSpinner> -->
  todo: integracja z API
  <!-- {{ panelList }} -->
  <DataTable :key="headers" :value="panelList">
    <!-- <Column v-for="h of headers" :key="h" :field="h" :header="$t('model.information_panel.' + h)"></Column> -->
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
        <i v-if="item.data.featured" class="pi pi-eye" style="fontsize: 2rem" @click="featureChange(item.data, false)" />
        <i v-else class="pi pi-eye-slash" style="fontsize: 2rem" @click="featureChange(item.data, true)" />
      </template>
    </Column>

    <Column field="is_template" :header="$t('model.panel.is_template')" :show-filter-menu="false">
      <template #body="item">
        <div style="height: 100%; width: 100%">
          <i v-if="item.data.is_template" class="pi pi-bookmark-fill" style="fontsize: 2rem" />
          <i v-else class="pi pi-bookmark" style="fontsize: 2rem" />
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
        TODO:
      </template>
    </Column>

    <Column field="link" :header="$t('view.go_to_panel')">
      <template #body="item">
        <i class="pi pi-chevron-circle-right" style="fontsize: 2rem" @click="view(item.data)" />
      </template>
    </Column>
    <Column field="edit" :header="$t('view.edit')">
      <template #body="item">
        TODO: edit <span style="display: block; height: 7rem; max-width: 8rem; overflow: hidden">{{ item.data }}</span>
        <Button v-tooltip="$t('view.edit')" icon="pi pi-pencil" class="p-button-rounded" @click="editPanel(item.data)" />
      </template>
    </Column>
  </DataTable>

  <!-- <AssetConnectionManagementDialog ref="assetConnectionManagementDialog" /> -->

  <Dialog v-model:visible="panelEdit" :style="{ width: '50vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <InformationPanelForm @update:model-value="onEdit($event, 0)" @cancel="panelEdit = false" />
  </Dialog>
</template>
<script>
import InformationPanelForm from "./InformationPanelForm.vue";
function initFilter() {
  return {
    label: { value: null },
    name: { value: null },
  };
}
export default {
  name: "InformationPanelList",
  components: { InformationPanelForm },

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
      assetDialog: false,
    };
  },
  async mounted() {
    if (this.panelList.length > 0) {
      this.headers = Object.keys(this.panelList[0]).filter((it) => it != "tiles");
    } else {
      this.headers = [];
    }
  },
  methods: {
    manageAssets() {
      alert("TODO:1");
    },
    featureChange(item, evt) {
      console.info(item);
      console.info(evt);
    },
    onFilter(ev) {
      this.mFilters = ev.filters;
      this.deferredEmitFilter.run();
    },
    view(selected) {
      let to = `/panel/view/${selected.id}`;
      this.$router.push(to);
    },
    //   manageAssetConnections(row) {
    //   this.$refs.assetConnectionManagementDialog.open(row);
    // },
    editPanel(o) {
      this.selectedRow = o;
      alert("open edit form dialog");
    },
    async onEdit(o) {
      await this.$ren.dasboardApi.updateInformationPanel(o).then((panel) => {
        console.info("update panel:" + panel.id);
      });
      await this.reload();
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
