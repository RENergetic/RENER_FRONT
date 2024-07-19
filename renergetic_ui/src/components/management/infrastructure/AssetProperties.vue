<template>
  <Dialog v-model:visible="dialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <div class="ren">
      <!-- <div v-for="detailsKey in detailsKeys" :key="detailsKey" class="property-form"> -->
      <!-- <ren-input v-model="details[detailsKey]" :text-label="detailsKey" /> -->
      <!-- <span>{{ detailsKey }}</span>
        <InputText v-model="details[detailsKey]" type="text"></InputText> -->
      <!-- </div> -->
      <div class="property-form">
        <h3>Asset Detail Key</h3>
        <h3>Asset Detail Value</h3>
      </div>
      <div v-for="(detail, index) in detailsList" :key="index" class="property-form">
        <InputText
          v-if="!detail.original"
          v-model="detailsList[index].key"
          placeholder="Key"
          @keyup="checkForDuplicatesAndNewLineNeed()"
          @focusout="deleteIfEmpty(index)"
        />
        <div v-else>{{ detailsList[index].key }}</div>
        <InputText v-model="detailsList[index].value" placeholder="Value" @focusout="deleteIfEmpty(index)" />
        <div v-if="detail.error !== null" class="property-form-error">
          <span v-if="detail.error === 'dup'">Key cannot be duplicated</span>
          <span v-if="detail.error === 'empty'">Key cannot be empty</span>
        </div>
        <!-- <span>{{ detailsKey }}</span>
        <InputText v-model="details[detailsKey]" type="text"></InputText> -->
      </div>
    </div>
    <ren-submit @submit="submit" />
    <!-- <Button @click="submit">Submit</Button> -->
  </Dialog>
</template>

<script>
export default {
  name: "AssetProperties",
  emits: ["submit"],
  data() {
    return {
      initialAsset: null,
      dialog: false,
      detailsKeys: null,
      details: null,
      detailIndex: 0,
      detailsList: [],
    };
  },
  methods: {
    open(selectedAsset, detailsKeys) {
      this.detailsList = [];
      for (const [key, value] of Object.entries(selectedAsset.details)) {
        this.detailsList.push({ index: this.detailIndex, key: key, value: value, error: null, original: true });
        this.detailIndex += 1;
      }
      this.detailsList.sort((a, b) => a.key.localeCompare(b.key));
      this.detailsList.push({ index: this.detailIndex, key: "", value: "", error: null, original: false });
      this.detailIndex += 1;

      this.detailsKeys = detailsKeys;
      this.initialAsset = selectedAsset;
      this.details = selectedAsset.details;
      /*this.detailsKeys.forEach(
        (detailsKey) =>
          (this.details[detailsKey] = selectedAsset.details && selectedAsset.details[detailsKey] ? selectedAsset.details[detailsKey] : ""),
      );*/
      this.dialog = true;
    },
    deleteIfEmpty(index) {
      if (index === this.detailsList.length - 1) {
        return;
      }

      var detail = this.detailsList[index];
      if ((detail.key === null || detail.key.length === 0) && (detail.value === null || detail.value.length === 0)) {
        this.detailsList.splice(index, 1);
      }
    },
    checkForDuplicatesAndNewLineNeed() {
      this.checkForDuplicates();

      const last = this.detailsList[this.detailsList.length - 1];
      if (last.key !== null && last.key.length > 0) {
        this.detailsList.push({ index: this.detailIndex, key: "", value: "", error: null, original: false });
        this.detailIndex += 1;
      }
    },
    checkForDuplicates() {
      var found = false;
      this.detailsList.forEach((item) => (item.error = null));

      this.detailsList.forEach((itemA, index) => {
        this.detailsList.forEach((itemB) => {
          if (itemA.index !== itemB.index && itemA.key !== null && itemA.key.length > 0 && itemA.key === itemB.key) {
            itemA.error = "dup";
            itemB.error = "dup";
            found = true;
          }
        });
        if ((itemA.key === null || itemA.key.length === 0) && index !== this.detailsList.length - 1) {
          itemA.error = "empty";
        }
      });
      return found;
    },
    checkForDuplicatesAndRemoveEmpty() {
      if (this.checkForDuplicates()) {
        return false;
      }

      this.detailsList = this.detailsList.filter((item) => (item.key !== null && item.key.length > 0) || item.original);

      return true;
    },
    submit() {
      if (!this.checkForDuplicatesAndRemoveEmpty()) {
        return;
      }

      this.details = {};
      this.detailsList.forEach((item) => (this.details[item.key] = item.value));

      this.$emit("submit", this.initialAsset, this.details);
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
.property-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 1rem;
  margin-bottom: 1rem;
  margin-top: 1rem;
  & > input {
    max-width: 100%;
  }
  & > h3 {
    color: #495057;
  }
  & > div {
    display: flex;
    align-items: center;
  }
}
.property-form-error {
  color: red;
}
</style>
