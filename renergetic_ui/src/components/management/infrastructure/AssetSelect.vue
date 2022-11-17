<template>
  <div>
    <Dialog
      v-model:visible="assetDialog"
      :style="{ minWidth: '25rem' }"
      :maximizable="true"
      :modal="true"
      :dismissable-mask="true"
    >
      <Card>
        <template #title> {{ $t("view.asset_select") }} </template>
        <template #content>
          <div class="flex flex-column">
            <div v-if="initialAsset">selected: {{ initialAsset }}</div>

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
                <template #filter="{ filterModel }">
                  <InputText
                    v-model="filterModel.value"
                    type="text"
                    class="p-column-filter"
                    :placeholder="$t('view.search')"
                  />
                </template>
              </Column>
              <Column field="label" :header="$t('model.asset.label')" :show-filter-menu="false">
                <template #filter="{ filterModel }">
                  <InputText
                    v-model="filterModel.value"
                    type="text"
                    class="p-column-filter"
                    :placeholder="$t('view.search')"
                  />
                </template>
              </Column>
              <Column field="type.label" :header="$t('model.asset.type')" :show-filter-menu="false">
                <template #filter="{ filterModel }">
                  <Dropdown
                    v-model="filterModel.value"
                    :options="assetTypes"
                    :placeholder="$t('view.select_asset_type')"
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
                <template #filter="{ filterModel }">
                  <Dropdown
                    v-model="filterModel.value"
                    :options="assetCategories"
                    :placeholder="$t('view.select_asset_category')"
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
                  <Button
                    type="button"
                    icon="pi pi-filter-slash"
                    :label="$t('button.filter')"
                    class="p-button-outlined"
                    @click="searchAsset"
                  />
                  <Button
                    type="button"
                    icon="pi pi-filter-slash"
                    :label="$t('button.clear_filter')"
                    class="p-button-outlined"
                    @click="clearFilter"
                  />
                </div>
              </template>
              <template #footer>
                <div class="flex justify-content-between">
                  <Button
                    type="button"
                    icon="pi pi-filter-slash"
                    :label="$t('button.previous')"
                    class="p-button-outlined"
                    @click="previous"
                  />

                  <Button
                    type="button"
                    icon="pi pi-filter-slash"
                    :label="$t('button.next')"
                    class="p-button-outlined"
                    @click="next"
                  />
                </div>
              </template>
            </DataTable>
          </div>

          <div class="grid">
            <div class="col">
              <Button
                :label="$t('view.button.submit')"
                :disabled="assetList.length < 1 || !assetList.some((asset) => asset.name === selectedAsset.name)"
                @click="submit"
              />
            </div>

            <div class="col">
              <Button :label="$t('view.button.cancel')" @click="cancel" />
            </div>
          </div>
        </template>
      </Card>
    </Dialog>
  </div>
</template>
<script>
//TODO: get this from API/TOMEK
const assetTypes = [
  {
    name: "building",
    label: "Building",
  },
  {
    name: "pv",
    label: "PV",
  },
];
//TODO: get this from API/TOMEK

const PAGE_SIZE = 10;
const assetCategories = [
  {
    name: "building",
    label: "Building",
  },
  {
    name: "dormitory",
    label: "Dormitory",
  },
];
export default {
  name: "AssetSelect",
  components: {},
  props: {
    current: { type: Object, default: () => null },
  },
  emits: ["select"],
  data() {
    return {
      page: 0,
      assetTypes: assetTypes,
      assetCategories: assetCategories,
      isLoading: false,
      assetList: [],
      measurementDialog: false,
      filters: this.initFilter(),
      selectedAsset: this.current,
      initialAsset: this.current,
      assetDialog: false,
    };
  },
  watch: {
    assetDialog: {
      handler: function (newValue) {
        if (newValue) {
          //set initial state
          this.filters = this.initFilter();
        }
      },
      immediate: true,
    },
  },
  methods: {
    submit() {
      this.$emit("select", this.selectedAsset);
      // this.$emit("update:modelValue", this.selectedAsset);
      this.assetDialog = false;
    },
    next() {
      if (this.assetList.lenth == 0) return;
      this.page += 1;
    },
    previous() {
      this.page = Math.max(0, this.page - 1);
    },
    clearFilter() {
      this.filters = this.initFilter();
    },
    async searchAsset() {
      //TODO: tomek will manage filtering feature with api
      console.info(this.filter);
      console.info(this.page + " " + PAGE_SIZE);
      let q = ""; //event.query.trim();
      if (this.category != undefined) {
        this.filters = { category: this.category };
      }
      if (q.length > 0)
        await this.$ren.managementApi.searchAsset(q, this.filters).then((assetList) => {
          this.assetList = assetList;
        });
      else {
        await this.$ren.managementApi.listAsset().then((assetList) => {
          this.assetList = assetList;
        });
      }
    },
    async open(current = null) {
      this.assetDialog = true;
      if (current != null) {
        this.selectedAsset = current;
        this.initialAsset = current;
        this.searchAsset();
      }
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
      this.assetDialog = false;
    },
    clear() {
      this.selectedAsset = null;
    },
  },
};
</script>

<style lang="scss">
input {
  width: 100%;
}
</style>
