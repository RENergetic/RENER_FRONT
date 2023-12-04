<template>
  <!-- <Card> -->
  <!-- <template v-if="header" #title> {{ $t("view.select_asset") }}</template> -->
  <!-- <template #content> -->
  <RenSpinner ref="spinner" :lock="true" style="margin: auto; width: 100%" class="flex flex-column">
    <template #content>
      <DataTable
        v-model:filters="filters"
        v-model:selection="selectedAsset"
        scroll-height="35rem"
        scrollable
        :value="assetList"
        :lazy="true"
        data-key="id"
        selection-mode="single"
        filter-display="row"
        :loading="isLoading"
        responsive-layout="scroll"
        :global-filter-fields="['name', 'label', 'type.name', 'category.label']"
        @row-dblclick="submit"
      >
        <Column field="name" :header="$t('model.asset.name')" :show-filter-menu="false">
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" class="p-column-filter" :placeholder="$t('view.search')" @input="filterCallback" />
          </template>
        </Column>
        <Column field="label" :header="$t('model.asset.label')" :show-filter-menu="false">
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" class="p-column-filter" :placeholder="$t('view.search')" @input="filterCallback" />
          </template>
        </Column>
        <Column field="type.label" :header="$t('model.asset.asset_type')" :show-filter-menu="false">
          <template #filter="{ filterModel, filterCallback }">
            <Dropdown
              v-model="filterModel.value"
              :options="$store.getters['view/assetTypes']"
              :placeholder="$t('view.select_asset_type')"
              @change="filterCallback"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value">
                  <div v-if="$te('model.asset.type.' + slotProps.value.name)">
                    {{ $t("model.asset.type." + slotProps.value.name) }}
                  </div>
                  <div v-else>{{ slotProps.value.label }}</div>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
              <template #option="slotProps">
                <div v-if="$te('model.asset.type.' + slotProps.option.name)">
                  {{ $t("model.asset.type." + slotProps.option.name) }}
                </div>
                <div v-else>{{ slotProps.option.label }}</div>
              </template>
            </Dropdown>
          </template>
        </Column>
        <Column field="category.label" :header="$t('model.asset.asset_category')" :show-filter-menu="false">
          <template #filter="{ filterModel, filterCallback }">
            <Dropdown
              v-model="filterModel.value"
              :options="$store.getters['view/assetCategories']"
              :placeholder="$t('view.select_asset_category')"
              @change="filterCallback"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value">
                  <div v-if="$te('model.asset.category.' + slotProps.value.name)">
                    {{ $t("model.asset.category." + slotProps.value.name) }}
                  </div>
                  <div v-else>{{ slotProps.value.label }}</div>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
              <template #option="slotProps">
                <div v-if="$te('model.asset.category.' + slotProps.option.name)">
                  {{ $t("model.asset.category." + slotProps.option.name) }}
                </div>
                <div v-else>{{ slotProps.option.label }}</div>
              </template>
            </Dropdown>
          </template>
        </Column>

        <!-- <Column field="geo_location" :header="$t('model.asset.geo_location')"> </Column> -->
        <!-- <template #header>
          <div class="flex justify-content-between">
            <Button type="button" icon="pi pi-filter" :label="$t('view.button.filter')" class="p-button-outlined" @click="searchAsset" />
            <Button type="button" icon="pi pi-filter-slash" :label="$t('view.button.clear_filter')" class="p-button-outlined" @click="clearFilter" />
          </div>
        </template> -->
        <template #footer>
          <RenPaginator v-model:offset="mOffset" :limit="limit" :current-rows="assetList.length" @update="searchAsset" />
        </template>
      </DataTable>
    </template>
  </RenSpinner>

  <ren-submit :style="'padding: 0.25rem 1rem'" :cancel-button="true" :disabled="!canSubmit" @cancel="cancel" @submit="submit" />

  <!-- </template>
  </Card> -->
</template>
<script>
const PAGE_SIZE = 20;

export default {
  name: "AssetSelect",
  props: {
    current: { type: Object, default: () => null },
    header: { type: Boolean, default: true },
  },
  emits: ["submit", "cancel"],
  data() {
    return {
      limit: PAGE_SIZE,
      mOffset: 0,
      isLoading: false,
      assetList: [],
      measurementDialog: false,
      filters: this.initFilter(),
      selectedAsset: this.current,
    };
  },
  computed: {
    canSubmit() {
      return !(this.assetList.length < 1 || !this.assetList.some((asset) => this.selectedAsset && asset.name === this.selectedAsset.name));
    },
  },
  watch: {
    filters: function () {
      this.searchAsset();
    },
  },
  mounted() {
    this.page = 0;
    this.filters = this.initFilter();
    this.searchAsset();
  },
  methods: {
    submit() {
      this.$emit("submit", this.selectedAsset);
      // this.$emit("update:modelValue", this.selectedAsset);
    },
    // next() {
    //   if (this.assetList.length === 0) return;
    //   this.page += 1;
    //   this.searchAsset();
    // },
    // previous() {
    //   this.page = Math.max(0, this.page - 1);
    //   this.searchAsset();
    // },
    clearFilter() {
      this.filters = this.initFilter();
    },
    async searchAsset() {
      //TODO: tomek will manage filtering feature with api
      let params = null;
      if (this.filters)
        params = {
          label: this.filters.label.value,
          name: this.filters.name.value,
          type: this.filters["type.label"] && this.filters["type.label"].value ? this.filters["type.label"].value.name : null,
          category: this.filters["category.label"] && this.filters["category.label"].value ? this.filters["category.label"].value.name : null,
        };
      this.$refs.spinner.run(async () => {
        await this.$ren.managementApi.listAsset(params, this.mOffset, this.limit).then((assetList) => {
          this.assetList = assetList;
        });
      });
    },
    onFilter(ev) {
      this.filters = ev.filters;
    },
    initFilter() {
      return {
        label: { value: null },
        name: { value: null },
        "type.label": { value: null },
        "category.label": { value: null },
      };
    },
    cancel() {
      this.$emit("cancel");
    },
    clear() {
      this.selectedAsset = null;
    },
  },
};
</script>
<style lang="scss"></style>
