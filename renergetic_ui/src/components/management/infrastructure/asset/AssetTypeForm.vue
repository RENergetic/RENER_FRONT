<template>
  <Card>
    <!-- <template #title> </template> -->
    <template #content>
      <div class="ren">
        <ren-input
          v-model="mAssetType.name"
          :text-info="'model.name_description'"
          :text-label="'model.asset.type.name'"
          :invalid="v$.mAssetType.name.$invalid"
          :errors="v$.mAssetType.name.$silentErrors"
          :disabled="mEdit"
        />
        <ren-input
          v-model="mAssetType.label"
          :text-info="'model.label_description'"
          :text-label="'model.asset.type.label'"
          :invalid="v$.mAssetType.name.$invalid"
          :errors="v$.mAssetType.name.$silentErrors"
        />
      </div>
    </template>
    <template #footer>
      <ren-submit :cancel-button="false" :disabled="v$.mAssetType.name.$invalid" @cancel="cancel" @submit="submit" />
    </template>
  </Card>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { maxLength, minLength, required, requiredTr } from "@/plugins/validators";

export default {
  name: "AssetTypeForm",
  props: {
    assetType: { type: Object, default: null },
  },
  emits: ["submit", "cancel"],
  setup: () => ({ v$: useVuelidate() }),
  validationConfig: {
    $lazy: true,
  },
  data() {
    return {
      mAssetType: this.assetType ? this.assetType : {},
      mEdit: this.assetType ? true : false,
    };
  },
  validations() {
    return {
      mAssetType: {
        name: { maxLength: maxLength(30), required: required, minLength: minLength(3) },
        type: { required: requiredTr("validations.fields.custom.asset.") },
      },
    };
  },
  methods: {
    submit() {
      this.$emit("submit", this.mAssetType);
    },
  },
};
</script>
