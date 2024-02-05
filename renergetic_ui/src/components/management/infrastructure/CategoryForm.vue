<template>
  <Dialog v-model:visible="formVisible" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <Card v-if="editCategoryModel">
      <!-- <template #title> </template> -->
      <template #content>
        <div class="ren">
          <ren-input
            v-model="editCategoryModel.name"
            :text-info="'model.name_description'"
            :text-label="'model.asset.name'"
            :invalid="v$.editCategoryModel.name.$invalid"
            :errors="v$.editCategoryModel.name.$silentErrors"
          />
          <ren-input v-model="editCategoryModel.label" :text-info="'model.label_description'" :text-label="'model.asset.label'" />
          <ren-input-text v-model="editCategoryModel.description" :text-label="'model.asset.description'" />
        </div>
      </template>
      <template #footer>
        <ren-submit :cancel-button="false" :disabled="v$.editCategoryModel.name.$invalid" @cancel="cancel" @submit="submit" />
      </template>
    </Card>
  </Dialog>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { maxLength, minLength, required, requiredTr } from "@/plugins/validators";

export default {
  name: "CategoryForm",
  emits: ["submit", "cancel"],
  setup: () => ({ v$: useVuelidate() }),
  validationConfig: {
    $lazy: true,
  },
  data() {
    return {
      formVisible: false,
      editCategoryModel: null,
      initialCategory: null,
    };
  },
  validations() {
    return {
      editCategoryModel: {
        name: { maxLength: maxLength(30), required: required, minLength: minLength(3) },
        type: { required: requiredTr("validations.fields.custom.asset.") },
      },
    };
  },
  methods: {
    open(selectedCategory) {
      if (selectedCategory) {
        this.initialCategory = selectedCategory;
        this.editCategoryModel = {
          id: selectedCategory.id,
          name: selectedCategory.name,
          label: selectedCategory.label,
          description: selectedCategory.description,
        };
      } else {
        this.editCategoryModel = {
          name: "",
          label: "",
          description: "",
        };
      }
      this.formVisible = true;
    },
    submit() {
      this.$emit("submit", this.editCategoryModel);
      this.formVisible = false;
    },
  },
};
</script>
