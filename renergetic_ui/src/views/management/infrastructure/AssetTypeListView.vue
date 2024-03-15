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
        console.warn("TODO: inform user update the update");
        console.warn(newType);
      });
      await this.loadTypes();
    },
    async deleteType(assetType) {
      await this.$refs.spinner.run(async () => {
        let result = await this.$ren.managementApi.deleteAssetType(assetType);
        console.warn("TODO: inform user update the update");
        console.warn(result);
      });
      await this.loadTypes();
    },
  },
};
</script>

<style scoped></style>
