<template>
  <Card>
    <template #title> {{ $t("view.asset_select") }}</template>
    <template #content>
      <RenSpinner ref="spinner" :lock="true" style="margin: auto; width: 100%" class="flex flex-column">
        <template #content>
          <DataTable
            v-model:filters="filters"
            v-model:selection="selectedAsset"
            :value="assetList"
            :lazy="true"
            data-key="id"
            selection-mode="single"
            filter-display="row"
            :loading="isLoading"
            responsive-layout="scroll"
            :global-filter-fields="['name', 'label', 'type.name', 'category.label']"
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
            <template #header>
              <div class="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" :label="$t('view.button.filter')" class="p-button-outlined" @click="searchAsset" />
                <Button
                  type="button"
                  icon="pi pi-filter-slash"
                  :label="$t('view.button.clear_filter')"
                  class="p-button-outlined"
                  @click="clearFilter"
                />
              </div>
            </template>
            <template #footer>
              <div class="flex justify-content-between">
                <Button
                  type="button"
                  icon="pi pi-chevron-circle-left"
                  :label="$t('view.button.previous')"
                  class="p-button-outlined"
                  @click="previous"
                />
                <span>{{ $t("view.current_page", { page: page }) }}</span>
                <Button
                  type="button"
                  icon="pi pi-chevron-circle-right"
                  :label="$t('view.button.next')"
                  class="p-button-outlined"
                  icon-pos="right"
                  @click="next"
                />
              </div>
            </template>
          </DataTable>
        </template>
      </RenSpinner>
      <ren-submit :cancel-button="true" :disabled="!canSubmit" @cancel="cancel" @submit="submit" />
      <!-- <div class="grid">
          <div class="col">
            <Button :label="$t('view.button.submit')" :disabled="!canSubmit" @click="submit" />
          </div>

          <div class="col">
            <Button :label="$t('view.button.cancel')" @click="cancel" />
          </div>
        </div> -->
    </template>
  </Card>
</template>
<script>
const PAGE_SIZE = 10;

export default {
  name: "AssetSelect",
  props: {
    current: { type: Object, default: () => null },
  },
  emits: ["submit", "cancel"],
  data() {
    return {
      page: 0,
      isLoading: false,
      assetList: [],
      measurementDialog: false,
      filters: this.initFilter(),
      selectedAsset: this.current,
      // initialAsset: this.current,
    };
  },
  computed: {
    canSubmit() {
      return !(this.assetList.length < 1 || !this.assetList.some((asset) => this.selectedAsset && asset.name === this.selectedAsset.name));
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
    next() {
      if (this.assetList.length === 0) return;
      this.page += 1;
      this.searchAsset();
    },
    previous() {
      this.page = Math.max(0, this.page - 1);
      this.searchAsset();
    },
    clearFilter() {
      this.filters = this.initFilter();
    },
    async searchAsset() {
      //TODO: filter not implemented on backend
      this.$refs.spinner.run(async () => {
        await this.$ren.managementApi.listAsset(undefined, this.page * PAGE_SIZE, PAGE_SIZE).then((assetList) => {
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
