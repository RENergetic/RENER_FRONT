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
  <Card>
    <template #title>{{ $t("view.hdr_pipelines") }} </template>
    <template #content>
      {{ $t("view.set_default_hdr_pipeline") }}
      <RenSpinner ref="spinner" :lock="true" style="width: 100%">
        <template #content>
          <ul>
            <li v-for="pipeline in hdrPipelineList" :key="pipeline.id">
              <span style="line-height: 2.5rem; font-size: 1.25rem">
                <span v-tooltip="`${pipeline.description} (version: ${pipeline.version})`"> {{ `${pipeline.name} (${pipeline.pipeline_id})` }}</span>
                <span>
                  <i v-if="!isHDRDefault(pipeline)" style="font-size: 1.5rem" class="pi pi-star" @click="setDefaultHDRPipeline(pipeline)" />
                  <i v-else style="font-size: 1.5rem" class="pi pi-star-fill" />
                </span>
              </span>
            </li>
          </ul>
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
      hdrPipelineList: [],
    };
  },
  computed: {},
  watch: {},
  updated() {},
  async mounted() {
    await this.loadData();
  },
  methods: {
    isHDRDefault: function (pipeline) {
      return (
        pipeline.properties &&
        pipeline.properties[this.HDR_KUBEFLOW_DEFAULT_PIPELINE] &&
        pipeline.properties[this.HDR_KUBEFLOW_DEFAULT_PIPELINE].value == "true"
      );
    },
    assetLabel(asset) {
      if (asset != null && asset != null) return asset.label ? asset.label : asset.name;
      return null;
    },
    selectAsset() {
      this.$refs.assetSelectDialog.open();
    },

    async loadData() {
      this.assetList = await this.$ren.managementApi.listByDetail("hdr_state", "true");
      this.hdrPipelineList = await this.$ren.kubeflowApi.listHDRPipelines();
    },
    async showMeasurements(asset) {
      this.measurementSelectDialog = true;
      await this.loadMeasurements(asset);
    },
    async setDefaultHDRPipeline(pipeline) {
      // var hdrEnabled =
      //   pipeline.properties && pipeline.properties[this.HDR_KUBEFLOW_PIPELINE] && pipeline.properties[this.HDR_KUBEFLOW_PIPELINE].value == "true";
      // if (!hdrEnabled) {
      //   await this.setHDRPipeline(pipeline, true);
      // }
      await this.$refs.spinner.run(async () => {
        let res = await this.$ren.kubeflowApi.setDefaultHDRPipeline(pipeline.pipeline_id);
        if (res && res.value == "true") {
          this.$emitter.emit("information", { message: this.$t("information.pipeline_property_changed") });
          this.hdrPipelineList = await this.$ren.kubeflowApi.listHDRPipelines();
        } else this.$emitter.emit("error", { message: this.$t("information.pipeline_property_not_changed") });
      });
    },
    async deleteAsset(asset) {
      await this.$ren.managementApi.deleteAssetDetail(asset.id, "hdr_state");
      // this.$refs.assetSelectDialog.close();
      this.assetList = await this.$ren.managementApi.listByDetail("hdr_state", "true");
    },
    async onAssetSelect(selectedAsset) {
      await this.$ren.managementApi.updateAssetDetail(selectedAsset.id, "hdr_state", "true");
      // this.$refs.assetSelectDialog.close();
      this.assetList = await this.$ren.managementApi.listByDetail("hdr_state", "true");
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
