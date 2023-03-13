<template>
  <Dialog
    v-model:visible="dialog"
    :style="{ width: '75vw' }"
    :maximizable="true"
    :modal="true"
    :dismissable-mask="true"
  >
    <div class="properties-form">
      <div v-for="detailsKey in detailsKeys" :key="detailsKey" class="property-form">
        <span>{{ detailsKey }}</span>
        <InputText type="text" v-model="this.details[detailsKey]"></InputText>
      </div>
    </div>
    <Button @click="submit">Submit</Button>
  </Dialog>
</template>

<script>
export default {
  name: "AssetProperties",
  emits: ["updateDetails"],
  data() {
    return {
      initialAsset: null,
      dialog: false,
      detailsKeys: null,
      details: null,
    };
  },
  methods: {
    open(selectedAsset, detailsKeys) {
      this.detailsKeys = detailsKeys;
      this.initialAsset = selectedAsset;
      this.details = {};
      this.detailsKeys.forEach(
        (detailsKey) =>
          (this.details[detailsKey] =
            selectedAsset.details && selectedAsset.details[detailsKey] ? selectedAsset.details[detailsKey] : ""),
      );
      this.dialog = true;
    },
    submit() {
      this.$emit("updateDetails", this.initialAsset, this.details);
      this.dialog = false;
    },
  },
};
</script>

<style scoped>
.properties-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 20rem;
  margin-bottom: 2rem;
}
.properties-form div {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
