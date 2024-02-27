<template>
  <!-- responsive-layout="scroll"  -->
  <DataTable v-if="paginatedTypes" :value="paginatedTypes" :lazy="true" data-key="id" class="sticky-header" :global-filter-fields="['name', 'label']">
    <Column field="id" :header="$t('model.asset.type.id')" :show-filter-menu="false"></Column>
    <Column field="name" :header="$t('model.asset.type.name')" :show-filter-menu="false"></Column>
    <Column field="label" :header="$t('model.asset.type.label')" :show-filter-menu="false"></Column>
    <!-- <Column field="description" :header="$t('model.asset.category.description')" :show-filter-menu="false"></Column> -->

    <Column :exportable="false" style="min-width: 8rem">
      <template #header>
        <Button icon="pi pi-list" :label="$t('menu.manage_assets')" @click="() => $router.push({ name: 'AssetList' })" />
      </template>
      <template #body="slotProps">
        <Button v-tooltip="$t('view.edit')" icon="pi pi-pencil" class="p-button-rounded" @click="editType(slotProps.data)" />
        <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="promptDeleteType(slotProps.data)" />
      </template>
    </Column>
  </DataTable>
  <ren-paginator v-model:offset="mOffset" style="left: 0" sticky :limit="mLimit" :current-rows="paginatedTypes.length" @update="onPagination" />

  <Toolbar class="ren-toolbar ren-sticky">
    <!-- <template #start>
        </template> -->
    <template #end>
      <Button :label="$t('view.button.add')" icon="pi pi-plus-circle" @click="typeAddDialog = true" />
    </template>
  </Toolbar>
  <Dialog v-model:visible="typeAddDialog" class="ren-page-content" :style="{ width: '75vw' }" :modal="true" :dismissable-mask="true">
    <asset-type-form @submit="onTypeAdd" @cancel="typeAddDialog = false" />
  </Dialog>
  <Dialog v-model:visible="typeEditDialog" class="ren-page-content" :style="{ width: '75vw' }" :modal="true" :dismissable-mask="true">
    <RenSpinner ref="editSpinner" :lock="true" style="min-width: 100%">
      <template #content>
        <asset-type-form :asset-type="selectedType" @submit="onTypeEdit" @cancel="typeEditDialog = false" />
      </template>
    </RenSpinner>
  </Dialog>
</template>

<script>
import AssetTypeForm from "@/components/management/infrastructure/asset/AssetTypeForm.vue";
const PAGE_SIZE = 15;
export default {
  name: "AssetTypeList",
  components: { AssetTypeForm },
  props: {
    typeList: { type: Array, default: () => [] },
  },
  emits: ["update", "delete", "create"],

  data() {
    return {
      mOffset: 0,
      mLimit: PAGE_SIZE,
      paginatedTypes: this.typeList ? this.typeList.slice(0, PAGE_SIZE) : null,
      editVisible: false,
      selectedType: null,
      typeAddDialog: false,
      typeEditDialog: false,
    };
  },
  watch: {
    typeList: function (newValue) {
      this.paginatedTypes = newValue ? this.typeList.slice(0, PAGE_SIZE) : null;
    },
  },

  methods: {
    onPagination() {
      this.paginatedTypes = this.typeList.slice(this.mOffset, this.mOffset + PAGE_SIZE);
    },
    onTypeAdd(assetType) {
      this.$emit("create", assetType);
    },
    editType(assetType) {
      this.selectedType = assetType;
      if (assetType != null) this.typeEditDialog = true;
    },
    async onTypeEdit(assetType) {
      await this.$refs.editSpinner.run(async () => {
        await this.$ren.managementApi.updateAssetType(assetType);
        console.warn("TODO: inform user update the update");
        console.warn(assetType);
        this.$emit("update", assetType);
        this.selectedType = null;
        this.typeEditDialog = false;
      });
    },
    async promptDeleteType(assetType) {
      this.$confirm.require({
        message: this.$t("view.asset_type_delete_body", {
          label: assetType.label ? assetType.label : assetType.name,
        }),
        header: this.$t("view.asset_type_delete"),
        icon: "pi pi-exclamation-triangle",
        accept: () => this.$emit("delete", assetType),
        reject: () => this.$confirm.close(),
      });
    },
  },
};
</script>
