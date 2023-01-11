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
          <h3>{{ $t("view.connected_assets") }}</h3>
          <DataTable :value="connectedAssets" :lazy="true" data-key="id">
            <Column field="name" :header="$t('model.asset.name')" :show-filter-menu="false"></Column>
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
    <Dropdown
      v-model="selectedAssetConnection"
      :options="allAssets"
      optionLabel="name"
      :placeholder="$t('view.select_asset')"
    >
    </Dropdown>
    <Button></Button>
  </Dialog>
  <AssetSelect ref="assetSelectDialog" @select="onAssetSelect" />
</template>

<script>
import AssetSelect from "./AssetSelect.vue";
import { AssetConnectionType } from "@/plugins/model/Enums.js";
import Dropdown from "primevue/dropdown";
import Spinner from "@/components/miscellaneous/Spinner";

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
      allAssets: [],
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
      this.loading = true;
      this.dialog = true;
      this.selectedAsset = selectedAsset;
      this.connectedAssets = await this.$ren.managementApi.listConnectedAssets(this.selectedAsset.id, 0, 200);
      this.allAssets = await this.$ren.managementApi.listAsset(undefined, 0, 1000);
      this.loading = false;
    },
    selectAsset() {
      this.selectedAsset = null;
      this.selectedAssetConnection = null;
      this.$refs.assetSelectDialog.open();
    },
    onAssetSelect(selectedAsset) {
      this.selectedAsset = selectedAsset;
    },
    deleteAssetConnection() {
      this.$ren.managementApi.unconnectAsset(this.asset.id, this.selectedAsset.id, this.selectedAssetConnection);
      //tODO: rest integeation tomek
    },
    submitAssetConnection() {
      this.$ren.managementApi.connectAsset(this.asset.id, this.selectedAsset.id, this.selectedAssetConnection);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
