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
    <template #footer>
      <Button :label="$t('model.asset.category.delete')" class="p-button-danger" icon="pi pi-trash" text @click="deleteSelectedCategory" />
      <Button :label="$t('model.asset.category.cancel')" autofocus @click="cancelDelete" />
    </template>
  </Dialog>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { maxLength, minLength, required, requiredTr } from "@/plugins/validators";
import CategoryForm from "@/components/management/infrastructure/CategoryForm.vue";

export default {
  name: "CategoryList",
  components: { CategoryForm },
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
      selectedCategoryForDelete: null,
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
    promptDeleteCategory(category) {
      this.selectedCategoryForDelete = category;
      this.deleteVisible = true;
      this.deleteHeader = category.name;
      //this.$emit("delete", category);
    },
    deleteSelectedCategory() {
      if (this.selectedCategoryForDelete) {
        this.$emit("delete", this.selectedCategoryForDelete);
      }
      this.deleteVisible = false;
    },
    cancelDelete() {
      this.selectedCategoryForDelete = null;
      this.deleteVisible = false;
    },
    async showAssets(category) {
      const assets = await this.$ren.managementApi.listCategoryAssets(category, 0, 100);
      console.log(assets);
    },
  },
};
</script>

<style scoped></style>
