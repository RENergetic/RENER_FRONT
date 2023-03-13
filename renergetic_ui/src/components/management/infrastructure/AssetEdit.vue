<template>
  <Dialog
    v-model:visible="dialog"
    :style="{ width: '75vw' }"
    :maximizable="true"
    :modal="true"
    :dismissable-mask="true"
  >
    <div class="edit-form">
      <div class="property-form">
        <label>Name</label>
        <InputText type="text" v-model="this.updateAsset.name"></InputText>
      </div>
      <div class="property-form">
        <label>Label</label>
        <InputText type="text" v-model="this.updateAsset.label"></InputText>
      </div>
      <div class="property-form">
        <label for="description">Description</label>
        <Textarea id="description" auto-resize rows="5" cols="30" v-model="this.updateAsset.description"></Textarea>
      </div>
      <div class="property-form">
        <label for="geo_location">Geo Location</label>
        <InputText
          id="geo_location"
          type="text"
          auto-resize
          rows="5"
          cols="30"
          v-model="this.updateAsset.geo_location"
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
    <Button @click="submit">Submit</Button>
  </Dialog>
</template>

<script>
export default {
  name: "AssetEdit",
  emits: ["updateAsset"],
  data() {
    return {
      dialog: false,
      initialAsset: null,
      name: "",
      label: "",
      description: "",
      geo_location: "",
      asset_category: null,
      type: null,
      updateAsset: null,
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
      this.updateAsset = {
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
      this.$emit("updateAsset", this.updateAsset);
      console.log("asset", this.updateAsset);
      this.dialog = false;
    },
  },
};
</script>

<style scoped>
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.property-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
