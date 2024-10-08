<!-- <template>
  <Dialog v-model:visible="dialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <Card>
      <template #title>{{ $t("view.add_asset_category") }}</template>
      <template #content>
        <div class="ren">
          <p v-if="asset == null">Asset doesn´t exist</p>
          <p v-else-if="asset.asset_category != null">The actual category is {{ asset.asset_category.name }}</p>
          <p v-else>This asset doesn´t have a category</p>
        </div>
        <ren-input-wrapper :text-label="$t('model.asset.asset_category')">
          <template #content>
            <Dropdown v-model="assetCategoryName" :placeholder="$t('view.select_asset_category')" :options="assetCategoriesNamesList" />
          </template>
        </ren-input-wrapper>
      </template>
      <template #footer>
        TODO : Dejas bonitos los botones
        <Button @click="updateAssetCategory(assetCategoryName)">Save</Button>
        <Button @click="deleteAssetCategory()">Delete</Button>
      </template>
    </Card>
  </Dialog>
</template>
<script>
export default {
  name: "AssetCategorySelection",
  data() {
    return {
      dialog: false,
      asset: null,
      assetId: null,
      assetCategory: null,
      assetCategoryName: null,
      assetCategoriesList: [],
      assetCategoriesNamesList: [],
      i: null,
      isEmpty: false,
    };
  },
  methods: {
    async open(selectedAsset) {
      this.dialog = true;
      this.assetCategoriesList = await this.$ren.managementApi.getAllCategories();
      this.assetCategoriesNamesList = this.assetCategoriesList.map((category) => category.name);
      if (selectedAsset != null) {
        this.assetId = selectedAsset.id;
        this.asset = selectedAsset;
        console.log(this.asset.asset_category);
        if (this.asset.asset_category != null) {
          console.log(this.asset.asset_category.name);
        } else {
          this.isEmpty = true;
          console.log("AssetCategory is null");
        }
      } else {
        this.asset = null;
        console.log("Asset without category assigned");
      }
    },
    async updateAssetCategory(nameCategory) {
      this.i = 0;
      this.assetCategory = this.assetCategoriesList[this.i];
      console.log(this.i + " : " + this.assetCategory.name + " : " + this.assetCategoriesList[this.i].name);
      while (this.assetCategoriesList[this.i].name != nameCategory && this.i < this.assetCategoriesList.length) {
        this.i++;
        this.assetCategory = this.assetCategoriesList[this.i];
      }
      if (this.assetCategory.name == nameCategory) {
        console.log(this.asset.id + " : " + this.assetCategory.name);
        await this.$ren.managementApi.updateCategoryFromAsset(this.asset.id, this.assetCategory);
      } else {
        console.error("The asset category has not been found");
      }
      this.dialog = false;
    },

    async deleteAssetCategory() {
      if (this.asset.asset_category != null) {
        await this.$ren.managementApi.deleteCategoryFromAsset(this.asset.id);
      }
      this.dialog = false;
    },
  },
};
</script>  -->
