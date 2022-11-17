<template>
  <Dialog
    v-model:visible="dialog"
    :style="{ width: '75vw' }"
    :maximizable="true"
    :modal="true"
    :dismissable-mask="true"
  >
    <Card>
      <template #title> {{ $t("view.manage_asset_connection") }} </template>
      <template #content>TODO - view connected assets <Button @click="addDialog = true" /> </template>
    </Card>
  </Dialog>
  <Dialog
    v-model:visible="addDialog"
    :style="{ width: '75vw' }"
    :maximizable="true"
    :modal="true"
    :dismissable-mask="true"
  >
    todo choose connection type and asset
    <Button @click="selectAsset" />
    <Button @click="submitAssetConnection" />
  </Dialog>
  <AssetSelect ref="assetSelectDialog" @select="onAssetSelect" />
</template>

<script>
import AssetSelect from "./AssetSelect.vue";

export default {
  name: "AssetConnectionManagement",
  components: { AssetSelect },
  props: {},
  data() {
    return {
      dialog: false,
      addDialog: false,
      selectedAsset: null,
      selectedAssetConnection: null, //-> todo make Enum of all possiblities
    };
  },
  computed: {},
  watch: {},
  async created() {
    this.assetList = await this.$ren.managementApi.listAsset();
    if (this.assetList != null && this.assetList.length > 0) {
      this.columns = Object.keys(this.assetList[0]);
    }
  },
  methods: {
    open(selectedAsset) {
      this.dialog = true;
      this.selectedAsset = selectedAsset;
    },
    selectAsset() {
      this.selectedAsset = null;
      this.selectedAssetConnection = null;
      this.$refs.assetSelectDialog.open();
    },
    onAssetSelect(selectedAsset) {
      this.selectedAsset = selectedAsset;
    },
    deleteAssetConnection(assetConnection) {
      console.error(assetConnection);
      //tODO: rest integeation tomek
    },
    submitAssetConnection() {
      //tODO: rest integeation tomek
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
