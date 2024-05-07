<template>
  <InfoIcon :show-icon="false">
    <template #content><!-- some info --></template>
  </InfoIcon>

  <Card>
    <template #title>{{ $t("view.hdr_asset_list") }} </template>
    <template #content>
      <RenSpinner ref="spinner" :lock="true" style="width: 100%">
        <template #content>
          <ul>
            <li v-for="asset in assetList" :key="asset.id">
              <span style="line-height: 2.5rem; font-size: 1.25rem">
                {{ assetLabel(asset) + ` (${asset.id})` }}
                <!-- <ren-input :model-value="assetLabel(asset) + ` (${asset.id})`" disabled :read-only="true" /> -->

                <!-- @change="filterCallback()" -->
                <!-- <Button
                  v-tooltip="$t('view.show_measurements')"
                  icon="pi pi-chart"
                  class="p-button-rounded p-button-danger"
                  @click="showMeasurements(asset)"
                /> -->

                <!-- $t('view.view_json') click more details -->
                <Button v-tooltip="$t('view.delete')" icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="deleteAsset(asset)" />
              </span>
            </li>
          </ul>
          <Button icon="pi pi-plus-circle" :label="$t('view.button.add')" @click="selectAsset" />
        </template>
      </RenSpinner>
    </template>
  </Card>
  <!-- <ren-submit :cancel-button="true" @cancel="cancel" @submit="submit" /> -->

  <!-- <Button :label="$t('view.button.submit')" @click="submit" />
  <Button :label="$t('view.button.cancel')" @click="cancel" /> -->
  <AssetSelectDialog ref="assetSelectDialog" @submit="onAssetSelect" />
  <!-- <Dialog v-model:visible="measurementSelectDialog" :style="{ width: '50vw' }" :maximizable="false" :modal="true" :dismissable-mask="true">
    <ul>
      <li v-for="m in measurementList" :key="m.id">{{ m.name }}:{{ m.measurement_details }}</li>
    </ul>
  </Dialog> -->
</template>

<script>
import InfoIcon from "@/components/miscellaneous/InfoIcon.vue";
import AssetSelectDialog from "@/components/management/infrastructure/AssetSelectDialog.vue";

export default {
  name: "HDRSettings",
  components: { InfoIcon, AssetSelectDialog },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["cancel", "update"],

  data() {
    return {
      assetList: [],
      // measurementList: [],
      // measurementSelectDialog: false,
    };
  },
  computed: {},
  watch: {},
  updated() {},
  async mounted() {
    await this.loadAssets();
  },
  methods: {
    assetLabel(asset) {
      if (asset != null && asset != null) return asset.label ? asset.label : asset.name;
      return null;
    },
    selectAsset() {
      this.$refs.assetSelectDialog.open();
    },

    async loadAssets() {
      this.assetList = await this.$ren.managementApi.listByDetail("hdr_state", "true");
    },
    async showMeasurements(asset) {
      this.measurementSelectDialog = true;
      await this.loadMeasurements(asset);
    },
    // async loadMeasurements(asset) {
    //   let offset = 0;
    //   let limit = 100;

    //   let params = { asset_name: asset.name };
    //   await this.$refs.spinner.run(async () => {
    //     await this.$ren.managementApi.listMeasurement({ params: params, offset: offset, limit: limit }).then((data) => {
    //       for (let m of data) {
    //         this.$ren.utils.setMeasurementLabel(m);
    //       }
    //       // console.error(this.mSelectedMeasurements);
    //       let d = {}
    //       for (let m of data) {

    //         m._key = `${m.name}_${m.type.id}_${m.domain}_${m.direction}_${m.sensor_name}`
    //         if( d[m._key]===undefined){
    //            d[m._key]={measurements:[],"hdr_state":false}
    //         }

    //       }

    //       this.measurementList = data;
    //     });
    //   });
    // },
    async deleteAsset(asset) {
      await this.$ren.managementApi.deleteAssetDetail(asset.id, "hdr_state");
      // this.$refs.assetSelectDialog.close();
      await this.loadAssets();
    },
    async onAssetSelect(selectedAsset) {
      await this.$ren.managementApi.updateAssetDetail(selectedAsset.id, "hdr_state", "true");
      // this.$refs.assetSelectDialog.close();
      await this.loadAssets();
    },
    submit() {},
    cancel() {
      this.$emit("cancel", this.mModel);
    },
    // deleteAssetDetail
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
