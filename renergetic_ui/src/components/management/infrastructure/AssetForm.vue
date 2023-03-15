<template>
  <InfoIcon :show-icon="false">
    <template #content>
      <!-- some info -->
    </template>
  </InfoIcon>
  <!-- {{ mModel }} -->
  <Card v-if="mModel">
    <!-- <template #title> </template> -->
    <template #content>
      <div class="ren">
        <ren-input
          v-model="mModel.name"
          :text-label="'model.asset.name'"
          :invalid="v$.mModel.name.$invalid"
          :errors="v$.mModel.name.$silentErrors"
        />
        <ren-input v-model="mModel.label" :text-label="'model.asset.label'" />
        <ren-input-wrapper
          :text-label="'model.asset.asset_type'"
          :invalid="v$.mModel.type.$invalid"
          :errors="v$.mModel.type.$silentErrors"
        >
          <template #content>
            <Dropdown
              id="assetType"
              v-model="mModel.type"
              :options="assetTypes"
              option-label="label"
              option-value="value"
              :placeholder="$t('view.select_asset_type')"
            />
          </template>
        </ren-input-wrapper>
        <ren-input-wrapper :text-label="'model.asset.parent'">
          <template #content>
            <span v-if="parentLabel" @click="selectAsset">{{ parentLabel }}</span>
            <span v-else @click="selectAsset">{{ $t("view.select_parent_asset") }}</span>
          </template>
        </ren-input-wrapper>
        <ren-input-wrapper :text-label="'model.asset.owner'">
          <template #content>
            <span v-if="ownerLabel" @click="selectOwner">{{ ownerLabel }}</span>
            <span v-else @click="selectOwner">{{ $t("view.select_owner") }}</span>
          </template>
        </ren-input-wrapper>
      </div>
    </template>
  </Card>

  <ren-submit :cancel-button="true" :disabled="v$.$invalid" @cancel="cancel" @submit="submit" />

  <!-- <Button :label="$t('view.button.submit')" @click="submit" />
  <Button :label="$t('view.button.cancel')" @click="cancel" /> -->
  <AssetSelectDialog ref="assetSelectDialog" :current="mModel.parent" @submit="onParentSelect" />
  <AssetSelectDialog ref="ownerSelectDialog" />
</template>

<script>
//TODO: on owner select
import { useVuelidate } from "@vuelidate/core";
import { maxLength, required, requiredTr, minLength } from "@/plugins/validators.js"; //required,
import InfoIcon from "../../miscellaneous/InfoIcon.vue";
import AssetSelectDialog from "./AssetSelectDialog.vue";
export default {
  name: "AssetForm",
  components: { InfoIcon, AssetSelectDialog },
  props: {
    modelValue: {
      type: Object,
      default: () => ({ measurements: [] }),
    },
  },
  emits: ["update:modelValue", "cancel"],
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return {
      mModel: this.modelValue ? this.modelValue : { measurements: [] },
      // assetTypes: this.$store.getters["view/assetTypes"],
      // assetTypes: [
      //   { value: "room", label: this.$t("model.asset.asset_types.room") },
      //   { value: "pv", label: this.$t("model.asset.asset_types.pv") },
      // ],
    };
  },
  validationConfig: {
    $lazy: true,
  },
  validations() {
    return {
      mModel: {
        name: { maxLength: maxLength(20), required: required, minLength: minLength(5) },
        type: { required: requiredTr("validations.fields.custom.asset.") },
      },
    };
  },
  computed: {
    parentLabel: function () {
      if (this.mModel != null && this.mModel.parent != null)
        return this.mModel.parent.label ? this.mModel.parent.label : this.mModel.parent.name;
      return null;
    },
    ownerLabel: function () {
      return this.mModel != null && this.mModel.owner != null ? this.mModel.owner.label : null;
    },
    assetTypes: function () {
      return this.$store.getters["view/assetTypes"].map((assetType) => {
        return { value: assetType.id, label: assetType.label };
      });
    },
  },
  watch: {},
  async mounted() {},
  methods: {
    selectAsset() {
      this.$refs.assetSelectDialog.open();
    },
    selectOwner() {
      this.$refs.ownerSelectDialog.open();
    },
    submit() {
      this.$emit("update:modelValue", this.mModel);
    },
    cancel() {
      this.$emit("cancel", this.model);
    },
    onParentSelect(selectedAsset) {
      this.mModel.parent = selectedAsset;
      // console.log(selectedAsset);
    },
  },
};
// this.assetTypes = (await this.$ren.managementApi.listAssetType()).map((type) => {
//   return { value: type.id, label: type.label };
// });
</script>

<style scoped lang="scss"></style>
