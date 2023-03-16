<template>
  <Dialog
    v-model:visible="dialog"
    :style="{ width: '75vw' }"
    :maximizable="true"
    :modal="true"
    :dismissable-mask="true"
  >
    <AssetConnectionManagement :asset="asset" />
  </Dialog>
</template>

<script>
import AssetConnectionManagement from "./AssetConnectionManagement.vue";
export default {
  name: "AssetConnectionManagementDialog",
  components: { AssetConnectionManagement },
  // props: { asset: { type: Object, default: () => null } },
  data() {
    return {
      dialog: false,
      asset: null,
    };
  },
  methods: {
    async open(selectedAsset) {
      this.dialog = true;
      this.asset = selectedAsset;
    },
  },
};
</script>
<style scoped lang="scss"></style>
