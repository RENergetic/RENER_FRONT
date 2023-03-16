<template>
  <DataTable
    :value="assetList"
    :lazy="true"
    data-key="id"
    :filters="mFilters"
    filter-display="row"
    :loading="isLoading"
    responsive-layout="scroll"
    :global-filter-fields="['name', 'label', 'type.name', 'category.label']"
    @filter="onFilter"
  >
    <Column field="name" :header="$t('model.asset.name')" :show-filter-menu="false">
      <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" type="text" class="p-column-filter" :placeholder="$t('view.search')" @input="filterCallback()" />
      </template>
    </Column>
    <Column field="label" :header="$t('model.asset.label')" :show-filter-menu="false">
      <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" type="text" class="p-column-filter" :placeholder="$t('view.search')" @input="filterCallback()" />
      </template>
    </Column>
    <Column field="type.label" :header="$t('model.asset.asset_type')" :show-filter-menu="false">
      <template #filter="{ filterModel, filterCallback }">
        <Dropdown
          v-model="filterModel.value"
          :options="$store.getters['view/assetTypes']"
          :placeholder="$t('view.select_asset_type')"
          @change="filterCallback()"
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
    <Column field="asset_category.label" :header="$t('model.asset.asset_category')" :show-filter-menu="false">
      <template #filter="{ filterModel, filterCallback }">
        <Dropdown
          v-if="filterModel"
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
    <Column field="child" :header="$t('model.asset.child')">
      <template #body="slotProps">
        <span v-if="slotProps.data.child && slotProps.data.child.length > 0" class="ren-pointer" @click="viewChildren(slotProps.data)">
          {{ $t("view.view_asset_children") }}
        </span>
        <span v-else class="disabled">
          {{ $t("view.no_asset_children") }}
        </span>
      </template>
    </Column>

    <Column field="parent" :header="$t('model.asset.parent')">
      <template #body="slotProps">
        <span v-if="slotProps.data.parent" class="ren-pointer" @click="setParent(slotProps.data)">
          {{ slotProps.data.parent.label }}
        </span>
        <span v-else class="disabled ren-pointer" @click="setParent(slotProps.data)">
          {{ $t("view.no_parent") }}
        </span>
      </template>
    </Column>
    <Column field="measurements" :header="$t('model.asset.measurements')">
      <template #body="slotProps">
        <span
          v-if="slotProps.data.measurements && slotProps.data.measurements.length > 0"
          class="ren-pointer"
          @click="viewMeasurements(slotProps.data)"
        >
          {{ $t("view.view_asset_measurements") }}
        </span>
        <span v-else class="ren-pointer disabled" @click="viewMeasurements(slotProps.data)">
          {{ $t("view.no_asset_measurements") }}
        </span>
      </template>
    </Column>
    <Column name="asset_connections" :header="$t('model.asset.asset_connections')">
      <template #body="slotProps">
        <span class="ren-pointer" @click="manageAssetConnections(slotProps.data)">
          {{ $t("view.manage_asset_connections") }}
        </span>
      </template></Column
    >
    <Column name="edit" :header="$t('view.properties')">
      <template #body="slotProps">
        <span class="ren-pointer" @click="manageAssetProperties(slotProps.data, $store.getters['view/assetDetailsKeys'])"> Manage properties </span>
      </template>
    </Column>
    <Column name="edit" :header="$t('view.edit')">
      <template #body="slotProps">
        <span class="ren-pointer" @click="editAsset(slotProps.data)"> Edit Asset </span>
      </template>
    </Column>
    <!-- <Column field="geo_location" :header="$t('model.asset.geo_location')"> </Column> -->
    <template #header>
      <div class="flex justify-content-between">
        <Button type="button" icon="pi pi-filter-slash" :label="$t('view.button.filter')" class="p-button-outlined" @click="reload" />
        <Button type="button" icon="pi pi-filter-slash" :label="$t('view.button.clear_filter')" class="p-button-outlined" @click="clearFilter" />
      </div>
    </template>
    <template #footer>
      <div class="flex justify-content-between">
        <Button type="button" icon="pi pi-chevron-circle-left" :label="$t('view.button.previous')" class="p-button-outlined" @click="previous" />
        <span>{{ $t("view.current_page", { page: mPage }) }}</span>
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
  <Button :label="$t('view.button.add')" @click="assetAdd = true" />
  <Dialog v-model:visible="assetAdd" :style="{ width: '50vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <AssetForm @update:model-value="onCreate($event, 0)" @cancel="assetAdd = false"> </AssetForm>
  </Dialog>
  <AssetSelectDialog ref="assetSelectDialog" @select="onParentChange" />
  <AssetConnectionManagementDialog ref="assetConnectionManagementDialog" />
  <AssetProperties ref="assetPropertiesDialog" @submit="updateDetails" />
  <AssetEdit ref="assetEditDialog" @submit="updateAsset" />

  <Dialog v-model:visible="childDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <Card>
      <template #title> {{ $t("model.asset.child") }} </template>
      <template #content>
        <DataTable v-if="selectedRow" :value="selectedRow.child">
          <!-- <Column v-for="col of columns" :key="col" :field="col" :header="$t('model.asset.' + col)"></Column> -->
          <Column field="name" :header="$t('model.asset.name')"> </Column>
          <Column field="label" :header="$t('model.asset.label')"> </Column>
          <Column field="type" :header="$t('model.asset.asset_type')"> </Column>
        </DataTable>
        <span v-else>
          {{ $t("view.asset_child_empty") }}
        </span>
      </template>
    </Card>
  </Dialog>
  <Dialog v-model:visible="measurementDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <Card>
      <template #title> {{ $t("model.asset.measurements") }} </template>
      <template #content>
        <!-- {{ selectedRow.measurements }} -->
        <DataTable v-if="selectedRow" :value="selectedRow.measurements">
          <!-- <Column v-for="col of columns" :key="col" :field="col" :header="$t('model.asset.' + col)"></Column> -->
          <!-- TODO: field=direction? -->
          <Column field="name" :header="$t('model.measurement.name')"> </Column>
          <Column field="label" :header="$t('model.measurement.label')"> </Column>
          <Column field="location_name" :header="$t('model.measurement.location_name')"> </Column>
          <Column field="type" :header="$t('model.measurement.measurement_type')">
            <template #body="slotProps">
              <span v-if="slotProps.data.type">
                {{ slotProps.data.type.label }}: {{ slotProps.data.type.unit }}
                <!-- TODO icon: metric_type:electricity -->
              </span>
              <span v-else>
                {{ $t("view.measurement_type_not_defined") }}
              </span>
            </template>
          </Column>
          <Column field="measurement_details" :header="$t('model.measurement.details')">
            TODO: details
            <!-- <template #body="slotProps">
            "measurement_details": { "color": "#4CAF50" }
            </template> -->
          </Column>
        </DataTable>
        <span v-else>
          {{ $t("view.no_asset_measurements") }}
        </span>

        <Button :label="$t('view.button.add_measurement')" @click="addMeasurement" />
        <measurement-select ref="measurementSelectDialog" :asset-id="selectedRow.id" @select="onMeasurementSelect"></measurement-select>
      </template>
    </Card>
  </Dialog>
</template>

<script>
import AssetForm from "./AssetForm.vue";
import AssetSelectDialog from "./AssetSelectDialog.vue";
import MeasurementSelect from "./MeasurementSelect.vue";
import AssetConnectionManagementDialog from "./AssetConnectionManagementDialog.vue";
import AssetProperties from "@/components/management/infrastructure/AssetProperties.vue";
import AssetEdit from "@/components/management/infrastructure/AssetEdit.vue";

function initFilter() {
  return {
    label: { value: null },
    name: { value: null },
    "type.label": { value: null },
    "category.label": { value: null },
  };
}
export default {
  name: "AssetList",
  components: {
    AssetEdit,
    AssetProperties,
    AssetForm,
    AssetSelectDialog,
    MeasurementSelect,
    AssetConnectionManagementDialog,
  },

  props: {
    assetList: { type: Array, default: () => [] },
    filters: { type: Array, default: () => initFilter() },
    page: { type: Number, default: 0 },
  },
  emits: ["update:filters", "reload", "update:page"],
  data() {
    return {
      mPage: this.page,
      assetAdd: false,
      mFilters: this.filters ? this.filters : initFilter(),
      selectedRow: null,
      childDialog: false,
      measurementDialog: false,
    };
  },
  computed: {
    columns() {
      if (this.assetList != null && this.assetList.length > 0) {
        return Object.keys(this.assetList[0]);
      }
      return [];
    },
  },
  methods: {
    onFilter(ev) {
      this.mFilters = ev.filters;
      this.$emit("update:filters", ev.filters);
    },
    setParent(row) {
      console.info(row);
      this.selectedRow = row;
      this.$refs.assetSelectDialog.open(row.parent);
    },
    manageAssetConnections(row) {
      this.$refs.assetConnectionManagementDialog.open(row);
    },
    manageAssetProperties(row, detailsKeys) {
      this.$refs.assetPropertiesDialog.open(row, detailsKeys);
    },
    editAsset(row) {
      this.$refs.assetEditDialog.open(row);
    },
    viewChildren(row) {
      console.info(row);
      this.selectedRow = row;
      this.childDialog = true;
    },
    viewMeasurements(row) {
      console.info(row);
      this.selectedRow = row;
      this.measurementDialog = true;
    },

    async onParentChange(parent) {
      await this.$ren.managementApi.setParent(this.selectedRow, parent.id);
      this.$emit("reload");
    },
    addMeasurement() {
      this.$refs.measurementSelectDialog.open();
    },
    async updateDetails(asset, details) {
      for (const [key, value] of Object.entries(details)) {
        if (value === "") {
          continue;
        }
        if (asset.details[key] === null || asset.details[key] === undefined) {
          await this.$ren.managementApi.addAssetDetail(asset.id, key, value);
        } else {
          await this.$ren.managementApi.updateAssetDetail(asset.id, key, value);
        }
      }
      await this.reload();
    },
    async updateAsset(asset) {
      await this.$ren.managementApi.updateAsset(asset);
      await this.reload();
    },
    onMeasurementSelect(measurement) {
      this.selectedRow.measurements.push(measurement);
    },
    async onCreate(o) {
      console.log(o);
      await this.$ren.managementApi.addAsset(o).then((assetId) => {
        console.info("add asset:" + assetId);
        // o.id = assetId;
        // this.assetList.push(o);
      });
      await this.reload();
    },

    async reload() {
      this.$emit("reload");
    },
    async next() {
      if (this.assetList.length === 0) return;
      this.mPage += 1;
      this.$emit("update:page", this.mPage);
    },
    async previous() {
      this.mPage = Math.max(0, this.mPage - 1);
      this.$emit("update:page", this.mPage);
    },
    clearFilter() {
      this.mFilters = initFilter();
      this.$emit("update:filters", this.mFilters);
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
