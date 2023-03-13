<template>
  <Dialog
    v-model:visible="dialog"
    :style="{ width: '75vw' }"
    :maximizable="true"
    :modal="true"
    :dismissable-mask="true"
  >
    <Card>
      <template #title> {{ $t("view.manage_asset_connections") }}</template>
      <template #content>
        <Spinner v-if="loading"></Spinner>
        <span v-if="!loading && connectedAssets.length === 0">{{ $t("view.no_connections_found") }}</span>
        <div v-if="!loading && connectedAssets.length > 0">
          <DataTable :value="connectedAssets" :lazy="true" data-key="id">
            <Column field="name" :header="$t('model.asset.name')" :show-filter-menu="false"></Column>
            <Column field="label" :header="$t('model.asset.label')" :show-filter-menu="false"></Column>
            <Column
              field="connection_type"
              :header="$t('model.asset.connection_type')"
              :show-filter-menu="false"
            ></Column>
          </DataTable>
        </div>
      </template>
      <template #footer>
        <Button @click="addDialog = true">{{ $t("view.button.add_connection") }}</Button>
      </template>
    </Card>
  </Dialog>
  <Dialog
    v-model:visible="addDialog"
    :style="{ width: '75vw' }"
    :maximizable="true"
    :modal="true"
    :dismissable-mask="true"
  >
    <Card>
      <template #title>{{ $t("view.add_asset") }}</template>
      <template #content>
        <div class="add-asset-connection-form">
          <div class="select-asset-input">
            <span v-if="!selectedAsset">No Asset Selected</span>
            <span v-if="selectedAsset">{{ selectedAsset.label }}</span>
            <Button v-if="!selectedAsset" @click="selectAsset">{{ $t("view.select_asset") }}</Button>
            <Button v-if="selectedAsset" @click="selectAsset">{{ $t("view.change_asset") }}</Button>
          </div>
          <Dropdown
            style="height: fit-content"
            v-model="selectedAssetConnection"
            :placeholder="$t('view.connection_type')"
            :options="Object.entries(connectionTypes).map((entry) => entry[1])"
          ></Dropdown>
        </div>
      </template>
      <template #footer>
        <Button @click="submitAssetConnection()">Submit</Button>
      </template>
    </Card>
  </Dialog>
  <AssetSelect ref="assetSelectDialog" @select="onAssetSelect" />
</template>

<script>
import AssetSelect from "./AssetSelect.vue";
import { AssetConnectionType } from "@/plugins/model/Enums.js";
import Spinner from "@/components/miscellaneous/Spinner";
import Dropdown from "primevue/dropdown";

export default {
  name: "AssetConnectionManagement",
  components: { AssetSelect, Spinner, Dropdown },
  props: { asset: { type: Object, default: () => null } },
  data() {
    return {
      dialog: false,
      addDialog: false,
      selectedAsset: null,
      selectedAssetConnection: null,
      connectionTypes: AssetConnectionType,
      loading: true,
      connectedAssets: [],
      initialAsset: null,
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
    async open(selectedAsset) {
      this.dialog = true;
      this.initialAsset = selectedAsset;
      await this.reload();
    },
    async reload() {
      this.loading = true;
      this.connectedAssets = await this.$ren.managementApi.listConnectedAssets(this.initialAsset.id, 0, 200);
      this.loading = false;
    },
    selectAsset() {
      this.selectedAsset = null;
      this.selectedAssetConnection = null;
      this.$refs.assetSelectDialog.open(this.initialAsset);
    },
    onAssetSelect(selectedAsset) {
      this.selectedAsset = selectedAsset;
    },
    deleteAssetConnection(selectedAsset) {
      this.$ren.managementApi.deleteAssetConnection(this.initialAsset.id, selectedAsset.id);
    },
    async submitAssetConnection() {
      await this.$ren.managementApi.submitAssetConnection(
        this.initialAsset.id,
        this.selectedAsset.id,
        this.selectedAssetConnection,
      );
      this.addDialog = false;
      await this.reload();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.select-asset-input {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: max-content;
}
.add-asset-connection-form {
  display: flex;
  flex-direction: row;
  gap: 5rem;
}
</style>
