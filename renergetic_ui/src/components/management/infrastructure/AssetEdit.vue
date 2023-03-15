<template>
  <Dialog
    v-model:visible="dialog"
    :style="{ width: '75vw' }"
    :maximizable="true"
    :modal="true"
    :dismissable-mask="true"
  >
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
          <ren-input-text v-model="mModel.description" :text-label="'model.asset.description'" />
          <ren-input v-model="mModel.geo_location" :text-label="'model.asset.geo_location'" />
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
        </div>
      </template>
    </Card>
    <ren-submit :cancel-button="false" :disabled="v$.$invalid" @cancel="cancel" @submit="submit" />
    <!-- <div class="edit-form">
      <div class="property-form">
        <label>Name</label>
        <InputText v-model="updateAsset.name" type="text"></InputText>
      </div>
      <div class="property-form">
        <label>Label</label>
        <InputText v-model="updateAsset.label" type="text"></InputText>
      </div>
      <div class="property-form">
        <label for="description">Description</label>
        <Textarea id="description" v-model="updateAsset.description" auto-resize rows="5" cols="30"></Textarea>
      </div>
      <div class="property-form">
        <label for="geo_location">Geo Location</label>
        <InputText
          id="geo_location"
          v-model="updateAsset.geo_location"
          type="text"
          auto-resize
          rows="5"
          cols="30"
        ></InputText>
      </div>
      <div class="field grid">
        <label for="assetType" class="col-fixed" style="width: 5rem">
          {{ $t("model.asset.asset_type") }}
        </label>
        <div class="col">
          <Dropdown
            id="assetType"
            v-model="updateAsset.type"
            :options="assetTypes"
            option-label="label"
            option-value="value"
            :placeholder="$t('view.select_asset_type')"
          />
        </div>
      </div>
    </div>
    <Button @click="submit">Submit</Button> -->
  </Dialog>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { maxLength, required, requiredTr, minLength } from "@/plugins/validators.js";
export default {
  name: "AssetEdit",
  emits: ["submit", "cancel"],
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return {
      dialog: false,
      initialAsset: null,
      // updateAsset: null,
      mModel: null,
    };
  },
  validationConfig: {
    $lazy: true,
  },
  validations() {
    return {
      mModel: {
        name: { maxLength: maxLength(30), required: required, minLength: minLength(3) },
        type: { required: requiredTr("validations.fields.custom.asset.") },
      },
    };
  },
  computed: {
    assetTypes: function () {
      return this.$store.getters["view/assetTypes"].map((assetType) => {
        return { value: assetType.id, label: assetType.label };
      });
    },
  },
  methods: {
    open(selectedAsset) {
      this.initialAsset = selectedAsset;
      // this.updateAsset = {
      //   id: selectedAsset.id,
      //   name: selectedAsset.name,
      //   type: selectedAsset.type ? selectedAsset.type.id : null,
      //   label: selectedAsset.label,
      //   description: selectedAsset.description ? selectedAsset.description : null,
      //   geo_location: selectedAsset.geo_location,
      //   parent: selectedAsset.parent ? selectedAsset.parent.id : null,
      //   user: selectedAsset.user ? selectedAsset.user : null,
      //   asset_category: selectedAsset.category ? selectedAsset.category : null,
      //   dashboards: selectedAsset.dashboards ? selectedAsset.dashboards : null,
      // };
      this.mModel = {
        id: selectedAsset.id,
        name: selectedAsset.name,
        type: selectedAsset.type ? selectedAsset.type.id : null,
        label: selectedAsset.label,
        description: selectedAsset.description ? selectedAsset.description : null,
        geo_location: selectedAsset.geo_location,
        parent: selectedAsset.parent ? selectedAsset.parent.id : null,
        user: selectedAsset.user ? selectedAsset.user : null,
        asset_category: selectedAsset.category ? selectedAsset.category : null,
        dashboards: selectedAsset.dashboards ? selectedAsset.dashboards : null,
      };
      this.dialog = true;
    },
    submit() {
      this.$emit("submit", this.mModel);
      //TODO: confirm dialog
      // console.log("asset", this.updateAsset);
      this.dialog = false;
    },
  },
};
</script>

<style scoped></style>
