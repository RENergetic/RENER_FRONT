<template>
  <DataTable
    :value="categoryList"
    :lazy="true"
    data-key="id"
    responsive-layout="scroll"
    :global-filter-fields="['name', 'label', 'type.name', 'category.label']"
  >
    <Column field="id" :header="$t('model.asset.category.id')" :show-filter-menu="false"></Column>
    <Column field="name" :header="$t('model.asset.category.name')" :show-filter-menu="false"></Column>
    <Column field="label" :header="$t('model.asset.category.label')" :show-filter-menu="false"></Column>
    <Column field="description" :header="$t('model.asset.category.description')" :show-filter-menu="false"></Column>
    <Column :exportable="false">
      <template #body="slotProps">
        <span class="ren-pointer" @click="showAssets(slotProps.data)">Show Assets</span>
      </template>
    </Column>
    <Column :exportable="false" style="min-width: 8rem">
      <template #body="slotProps">
        <Button v-tooltip="$t('view.edit')" icon="pi pi-pencil" class="p-button-rounded" @click="editCategory(slotProps.data)" />
        <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="promptDeleteCategory(slotProps.data)" />
      </template>
    </Column>
  </DataTable>
  <Toolbar>
    <template #end><Button :label="$t('view.button.add')" icon="pi pi-plus-circle" @click="addCategory" /> </template>
  </Toolbar>
  <category-form ref="categoryForm" @submit="updateCategory"></category-form>
  <Dialog v-model:visible="deleteVisible" modal :header="$t('model.asset.category.delete') + ' ' + deleteHeader" :style="{ width: '50vw' }">
    <p>{{ $t("model.asset.category.delete_prompt") }}</p>
    <p>{{ $t("model.asset.category.affected_assets") }}:</p>
    <ul v-if="!affectedAssetsLoading">
      <li v-for="asset in affectedAssets" :key="asset.id">
        {{ asset.name }}
      </li>
    </ul>
    <ul v-if="affectedAssetsLoading">
      <li>
        <Skeleton width="10rem"></Skeleton>
      </li>
      <li>
        <Skeleton width="10rem"></Skeleton>
      </li>
    </ul>
    <template #footer>
      <Button :label="$t('model.asset.category.delete')" class="p-button-danger" icon="pi pi-trash" text @click="deleteSelectedCategory" />
      <Button :label="$t('model.asset.category.cancel')" autofocus @click="cancelDelete" />
    </template>
  </Dialog>
  <Dialog v-if="selectedCategory" v-model:visible="assetListVisible" modal :header="selectedCategory.name" :style="{ width: '90vw' }">
    <div v-if="affectedAssetsLoading">
      <Skeleton width="100%" height="20rem"></Skeleton>
    </div>
    <AssetList v-if="affectedAssets && !affectedAssetsLoading" :asset-list="affectedAssets" @reload="updateAffectedAssets"></AssetList>
    <p v-if="!affectedAssetsLoading && !affectedAssets">{{ $t("model.asset.category.no_assets_found") }}</p>
  </Dialog>
  <RenSpinner :lock="true"></RenSpinner>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { maxLength, minLength, required, requiredTr } from "@/plugins/validators";
import CategoryForm from "@/components/management/infrastructure/CategoryForm.vue";
import Skeleton from "primevue/skeleton";
import AssetList from "@/components/management/infrastructure/AssetList.vue";
import RenSpinner from "@/components/miscellaneous/RenSpinner.vue";

export default {
  name: "CategoryList",
  components: { CategoryForm, Skeleton, AssetList, RenSpinner },
  props: {
    categoryList: { type: Array, default: () => [] },
  },
  emits: ["update", "delete", "create"],
  setup: () => ({ v$: useVuelidate() }),
  validationConfig: {
    $lazy: true,
  },
  validations() {
    return {
      editCategoryModel: {
        name: { maxLength: maxLength(30), required: required, minLength: minLength(3) },
        type: { required: requiredTr("validations.fields.custom.asset.") },
      },
    };
  },
  data() {
    return {
      editVisible: false,
      deleteVisible: false,
      editCategoryModel: null,
      deleteHeader: "",
      selectedCategory: null,
      affectedAssets: null,
      affectedAssetsLoading: false,
      assetListVisible: false,
    };
  },
  methods: {
    addCategory() {
      this.$refs.categoryForm.open();
    },
    editCategory(selectedCategory) {
      this.$refs.categoryForm.open(selectedCategory);
    },
    updateCategory(category) {
      if (category.id) {
        this.$emit("update", category);
      } else this.$emit("create", category);
    },
    async promptDeleteCategory(category) {
      this.selectedCategory = category;
      this.deleteVisible = true;
      this.deleteHeader = category.name;
      this.affectedAssetsLoading = true;
      await this.updateAffectedAssets();
      this.affectedAssetsLoading = false;
    },
    deleteSelectedCategory() {
      if (this.selectedCategory) {
        this.$emit("delete", this.selectedCategory);
      }
      this.deleteVisible = false;
    },
    cancelDelete() {
      this.selectedCategory = null;
      this.deleteVisible = false;
    },
    async showAssets(category) {
      this.assetListVisible = true;
      this.affectedAssetsLoading = true;
      this.selectedCategory = category;
      await this.updateAffectedAssets();
      this.affectedAssetsLoading = false;
    },
    async updateAffectedAssets(evt) {
      try {
        let offset = 0;
        let limit = 10;
        if (evt) {
          offset = evt.offset;
          limit = evt.limit;
        }
        this.affectedAssets = await this.$ren.managementApi.listCategoryAssets(this.selectedCategory, offset, limit);
      } catch (e) {
        console.log(e);
        this.affectedAssets = [];
      }
    },
  },
};
</script>

<style scoped></style>
