<template>
  <Card>
    <template #title> {{ $t("view.manage_asset_connections") }}</template>
    <template #content>
      <RenSpinner ref="spinner" :lock="true" style="margin: auto; width: 100%" class="flex flex-column">
        <!-- <Spinner v-if="loading"></Spinner> -->
        <template #content>
          <span v-if="connectedAssets.length === 0">{{ $t("view.no_connections_found") }}</span>
          <!-- <div v-if="!loading && connectedAssets.length > 0"> -->
          <DataTable :value="connectedAssets" :lazy="true" data-key="id">
            <Column field="name" :header="$t('model.asset.name')" :show-filter-menu="false"></Column>
            <Column field="label" :header="$t('model.asset.label')" :show-filter-menu="false"></Column>
            <Column field="connection_type" :header="$t('model.asset.connection_type')" :show-filter-menu="false"></Column>
            <Column :exportable="false" style="min-width: 8rem">
              <template #body="conn">
                <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="deleteConnection(conn.data)" />
              </template>
            </Column>
          </DataTable>
        </template>
      </RenSpinner>
    </template>
    <template #footer>
      <Button @click="addDialog = true">{{ $t("view.button.add_connection") }}</Button>
    </template>
  </Card>

  <Dialog v-model:visible="addDialog" :style="{ width: '30rem' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <Card>
      <template #title>{{ $t("view.add_asset_connection") }}</template>
      <template #content>
        <div class="ren">
          <ren-input-wrapper
            :text-label="'model.asset_connection.connected_asset'"
            :invalid="v$.selectedAsset.$invalid"
            :errors="v$.selectedAsset.$silentErrors"
          >
            <template #content>
              <!-- <ren-input-wrapper>
                <template #content>
                  <span v-if="selectedAsset">{{ selectedAsset.label ? selectedAsset.label : selectedAsset.name }}</span>
                </template>
              </ren-input-wrapper> -->
              <!-- <ren-input-wrapper>
                <template #content> -->
              <Button v-if="!selectedAsset" @click="selectAsset">{{ $t("view.select_asset") }}</Button>
              <Button v-else @click="selectAsset">{{
                $t("view.change_asset", { asset: selectedAsset.label ? selectedAsset.label : selectedAsset.name })
              }}</Button>
              <!-- </template>
              </ren-input-wrapper> -->
            </template>
          </ren-input-wrapper>
          <ren-switch v-model="twoDirection" :text-label="'model.asset_connection.bi_directional'" />

          <ren-input-wrapper
            :text-label="'model.asset_connection.connection_type'"
            :invalid="v$.connectionType.$invalid"
            :errors="v$.connectionType.$silentErrors"
          >
            <template #content>
              <Dropdown v-model="connectionType" option-label="label" :placeholder="$t('view.connection_type')" :options="connectionTypes" />
            </template>
          </ren-input-wrapper>
        </div>
      </template>
      <template #footer>
        <div style="margin-bottom: 0.5rem">
          <div v-if="!v$.$invalid && !twoDirection">
            {{ asset.name }} <i class="pi pi-arrow-right" style="font-size: 1rem" /> {{ connectionType.label }}
            <i class="pi pi-arrow-right" style="font-size: 1rem" /> {{ selectedAsset.name }}
          </div>
          <div v-else-if="!v$.$invalid && twoDirection">
            {{ asset.name }} <i class="pi pi-arrow-right" style="font-size: 1rem" /> {{ connectionType.label }}
            <i class="pi pi-arrow-right" style="font-size: 1rem" /> {{ selectedAsset.name }}
            <br />
            {{ selectedAsset.name }} <i class="pi pi-arrow-right" style="font-size: 1rem" /> {{ connectionType.label }}
            <i class="pi pi-arrow-right" style="font-size: 1rem" /> {{ asset.name }}
          </div>
        </div>
        <ren-submit :disabled="v$.$invalid" @submit="submitAssetConnection" />
      </template>
    </Card>
  </Dialog>
  <AssetSelectDialog ref="assetSelectDialog" @submit="onAssetSelect" />
</template>

<script>
//TODO: prevent adding duplicates on the UI side and backend
import { useVuelidate } from "@vuelidate/core";
import { required } from "@/plugins/validators.js";
import AssetSelectDialog from "./AssetSelectDialog.vue";
import { AssetConnectionType } from "@/plugins/model/Enums.js";
export default {
  name: "AssetConnectionManagement",
  components: { AssetSelectDialog },
  props: { asset: { type: Object, required: true } },
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return {
      addDialog: false,
      twoDirection: false,
      selectedAsset: null,
      connectionType: null,
      connectionTypes: Object.entries(AssetConnectionType).map((entry) => {
        return { name: entry[1], label: this.$t(`enums.asset_connection.${entry[1]}`) };
      }),
      connectedAssets: [],
    };
  },

  validationConfig: {
    $lazy: true,
  },
  validations() {
    return {
      connectionType: { required: required },
      selectedAsset: { required: required },
    };
  },
  computed: {},
  watch: {},
  async mounted() {
    this.reload();
  },
  methods: {
    // async open(selectedAsset) {
    //   this.dialog = true;
    //   this.initialAsset = selectedAsset;
    //   await this.reload();
    // },
    async reload() {
      this.$refs.spinner.run(async () => {
        this.connectedAssets = await this.$ren.managementApi.listConnectedAssets(this.asset.id, 0, 200);
      });
    },
    selectAsset() {
      this.selectedAsset = null;
      this.connectionType = null;
      this.$refs.assetSelectDialog.open(this.asset);
    },
    onAssetSelect(selectedAsset) {
      this.selectedAsset = selectedAsset;
    },
    async deleteConnection(conn) {
      //TODO: confirm dialog, TODO: delete by connection type ?, can two assets can have more than 1 connection (different type)?
      console.info(`connection type: ${conn.type.id}, connected asset : ${conn.id}:${conn.name}(${conn.label ? conn.label : "no label"}) `);

      this.$refs.spinner.run(async () => {
        await this.$ren.managementApi.deleteAssetConnection(this.asset.id, conn.id);
        this.connectedAssets = await this.$ren.managementApi.listConnectedAssets(this.asset.id, 0, 200);
      });
    },
    async submitAssetConnection() {
      await this.$ren.managementApi.submitAssetConnection(this.asset.id, this.selectedAsset.id, this.connectionType.name, this.twoDirection);
      this.addDialog = false;
      await this.reload();
    },
  },
};
</script>

<style scoped lang="scss">
// .select-asset-input {
//   display: flex;
//   flex-direction: column;
//   gap: 1rem;
//   width: max-content;
// }
// .add-asset-connection-form {
//   display: flex;
//   flex-direction: row;
//   gap: 5rem;
// }
</style>
