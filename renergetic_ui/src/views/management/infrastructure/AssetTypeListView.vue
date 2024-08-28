<template>
  <Card class="ren-page-content">
    <template #content>
      <RenSpinner ref="spinner" :lock="true" style="min-width: 100%">
        <!--  max-width: 80vw -->
        <template #content>
          <!--   {{ typeList }}  -->
          <AssetTypeList v-if="typeList" :type-list="typeList" @reload="loadTypes" @update="onTypeUpdate" @create="createType" @delete="deleteType" />
        </template>
      </RenSpinner>
    </template>
  </Card>
</template>

<script>
import AssetTypeList from "@/components/management/infrastructure/asset/AssetTypeList.vue";

export default {
  name: "AssetTypeListView",
  components: { AssetTypeList },
  data() {
    return {
      typeList: [],
    };
  },
  mounted() {
    this.loadTypes();
  },
  methods: {
    async loadTypes() {
      await this.$refs.spinner.run(async () => {
        this.typeList = await this.$ren.managementApi.listAssetTypes();
      });
    },
    async onTypeUpdate() {
      await this.loadTypes();
    },
    async createType(assetType) {
      await this.$refs.spinner.run(async () => {
        let newType = await this.$ren.managementApi.addAssetType(assetType);
        this.$emitter.emit("information", {
          message: this.$t("information.new_asset_type", { name: newType.name, label: newType.label ? newType.label : newType.name }),
        });
      });
      await this.loadTypes();
    },
    async deleteType(assetType) {
      await this.$refs.spinner.run(async () => {
        let result = await this.$ren.managementApi.deleteAssetType(assetType);
        console.warn(result); //check what's in the result
        this.$emitter.emit("information", {
          message: this.$t("information.asset_type_delete"),
        });
      });
      await this.loadTypes();
    },
  },
};
</script>

<style scoped></style>
