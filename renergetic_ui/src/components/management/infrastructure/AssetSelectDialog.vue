<template>
  <Dialog v-model:visible="assetDialog" :style="{ minWidth: '25rem' }" :maximizable="true" :modal="true" :dismissable-mask="true" @filter="onFilter">
    <asset-select v-show="assetDialog" :current="current" @cancel="cancel" @submit="submit" />
  </Dialog>
</template>
<script>
import AssetSelect from "./AssetSelect.vue";
export default {
  name: "AssetSelectDialog",
  components: { AssetSelect },
  props: {
    current: { type: Object, default: () => null },
  },
  emits: ["submit", "cancel"],
  data() {
    return {
      assetDialog: false,
    };
  },
  watch: {
    assetDialog: {
      handler: function (newValue) {
        if (newValue) {
          //set initial state
          // this.filters = this.initFilter();
          // this.searchAsset();
        }
      },
      immediate: true,
    },
  },

  methods: {
    submit(evt) {
      this.$emit("submit", evt);
      this.assetDialog = false;
    },

    async open(current = null) {
      this.assetDialog = true;
      if (current != null) {
        this.selectedAsset = current;
        this.initialAsset = current;
      }
      // await this.searchAsset();
    },
    cancel() {
      this.$emit("cancel");
      this.assetDialog = false;
    },
  },
};
</script>

<style lang="scss">
input {
  width: 100%;
}
</style>
