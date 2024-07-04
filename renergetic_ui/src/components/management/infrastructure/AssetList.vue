<template>
  <!-- TODO: unslect row event responsive-layout="scroll"-->
  <DataTable
    class="asset-list"
    :value="assetList"
    :lazy="true"
    data-key="id"
    :filters="mFilters"
    :filter-display="hiddenFilters ? null : 'row'"
    :global-filter-fields="['name', 'label', 'type.name', 'category.label']"
    selection-mode="single"
    :meta-key-selection="false"
    :selection="selectedRow"
    @filter="onFilter"
    @row-unselect="$emit('onSelect', null)"
    @update:selection="onSelect"
  >
    <Column field="id" :header="$t('model.asset.id')" :show-filter-menu="false"></Column>
    <Column name="edit" :hidden="basic">
      <template #body="slotProps">
        <Button
          v-if="slotProps.data.measurements && slotProps.data.measurements.length > 0"
          v-tooltip="$t('view.view_asset_measurements')"
          icon="pi  pi-chart-line"
          class="p-button-rounded p-button-info"
          @click="viewMeasurements(slotProps.data)"
        />
        <Button
          v-else
          v-tooltip="$t('view.no_asset_measurements')"
          icon="pi  pi-chart-line"
          class="p-button-rounded p-button-info disabled"
          @click="viewMeasurements(slotProps.data)"
        />

        <Button
          v-tooltip="$t('view.manage_asset_connections')"
          icon="pi pi-share-alt"
          class="p-button-rounded"
          @click="manageConnections(slotProps.data)"
        />
        <Button v-tooltip="$t('view.properties')" icon="pi  pi-sliders-h" class="p-button-rounded" @click="manageAssetProperties(slotProps.data)" />
        <Button
          v-if="
            (slotProps.data.type !== undefined || slotProps.data.type !== null) &&
            (slotProps.data.type.name === 'pv_virtual_asset_group' || slotProps.data.type.name === 'virtual_asset_group')
          "
          v-tooltip="$t('view.edit')"
          icon="pi pi-copy"
          class="p-button-rounded"
          @click="manageAssetAggregrationProperties(slotProps.data)"
        />
        <Button v-tooltip="$t('view.edit')" icon="pi pi-pencil" class="p-button-rounded" @click="editAsset(slotProps.data)" />
        <Button
          v-tooltip="$t('view.delete') + hasMeasurementsTooltip(slotProps.data)"
          :disabled="slotProps.data.type.name == 'user' || (slotProps.data.measurements && slotProps.data.measurements.length > 0)"
          icon="pi pi-trash"
          class="p-button-rounded p-button-danger"
          @click="deleteAsset(slotProps.data)"
        />
      </template>
    </Column>
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
              <div v-if="$te('model.asset.types.' + slotProps.value.name)">
                {{ $t("model.asset.types." + slotProps.value.name) }}
              </div>
              <div v-else>{{ slotProps.value.label }}</div>
            </div>
            <span v-else>
              {{ slotProps.placeholder }}
            </span>
          </template>
          <template #option="slotProps">
            <div v-if="$te('model.asset.types.' + slotProps.option.name)">
              {{ $t("model.asset.types." + slotProps.option.name) }}
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
          @change="filterCallback()"
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
      <template #body="slotProps">
        <span v-if="slotProps.data.asset_category" @click="manageAssetCategories(slotProps.data)">
          {{ slotProps.data.asset_category.name }}
        </span>
        <span v-else class="disabled" @click="manageAssetCategories(slotProps.data)">
          {{ $t("view.asset_category") }}
        </span>
      </template>
    </Column>
    <Column field="child" :header="$t('model.asset.child')" :hidden="basic">
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
        <span v-if="slotProps.data.parent" class="ren-pointer">
          <span @click="setParent(slotProps.data)"> {{ slotProps.data.parent.label }}</span>
          <i class="pi pi-times" style="font-size: 1rem; color: rgba(250, 30, 30, 0.9)" @click="revokeParent(slotProps.data)" />
        </span>
        <span v-else class="disabled ren-pointer" @click="setParent(slotProps.data)">
          {{ $t("view.no_parent") }}
        </span>
      </template>
    </Column>
    <!-- <Column field="measurements" :header="$t('model.asset.measurements')" :hidden="basic">
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
    </Column> -->
    <!-- <Column field="geo_location" :header="$t('model.asset.geo_location')"> </Column> -->
    <template #header>
      <div v-if="!hiddenFilters" class="flex justify-content-between">
        <Button
          type="button"
          style="position: sticky; left: 0.5rem"
          icon="pi pi-filter-slash"
          :label="$t('view.button.clear_filter')"
          class="p-button-outlined"
          @click="clearFilter"
        />
      </div>
    </template>
  </DataTable>
  <ren-paginator v-model:offset="mOffset" style="left: 0" sticky :current-rows="assetList.length" @update="reloadAssets" />

  <Toolbar v-if="!basic" class="ren-toolbar ren-sticky">
    <template #end>
      <Button :label="$t('view.button.add')" icon="pi pi-plus-circle" @click="assetAdd = true" />

      <Button style="margin-left: 0.5rem" icon="pi pi-list" :label="$t('view.button.manage_asset_types')" @click="manageTypes" />
      <Button style="margin-left: 0.5rem" icon="pi pi-list" :label="$t('view.button.manage_asset_categories')" @click="manageCategories" />
    </template>
  </Toolbar>

  <Dialog v-model:visible="assetAdd" :style="{ width: '50vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <AssetForm @update:model-value="onCreate($event, 0)" @cancel="assetAdd = false"> </AssetForm>
  </Dialog>
  <AssetSelectDialog ref="assetSelectDialog" @submit="onParentChange" />
  <AssetConnectionManagementDialog ref="assetConnectionManagementDialog" />
  <AssetCategorySelection ref="assetCategorySelection" />
  <AssetProperties ref="assetPropertiesDialog" @submit="updateDetails" />
  <AssetAggregationProperties ref="assetAggregationPropertiesDialog" />
  <AssetEdit ref="assetEditDialog" @submit="updateAsset" />

  <Dialog v-model:visible="childDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <Card>
      <template #title> {{ $t("model.asset.child") }} </template>
      <template #content>
        <DataTable v-if="selectedAsset" :value="selectedAsset.child">
          <!-- <Column v-for="col of columns" :key="col" :field="col" :header="$t('model.asset.' + col)"></Column> -->
          <Column field="name" :header="$t('model.asset.name')" />
          <Column field="label" :header="$t('model.asset.label')" />
          <Column field="type" :header="$t('model.asset.asset_type')">
            <template #body="slotProps">
              <span v-if="slotProps.data.type">
                {{ objectLabel(slotProps.data.type, "model.asset.types") }}
              </span>
              <span v-else>{{ $t("view.na") }}</span>
            </template>
          </Column>
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
        <!-- {{ selectedAsset.measurements }} -->
        <DataTable v-if="selectedAsset" :value="selectedAsset.measurements">
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
          <Column name="revoke_measurement">
            <template #body="slotProps">
              <Button
                v-tooltip="$t('view.revoke')"
                icon="pi pi-times"
                class="p-button-rounded p-button-danger"
                @click="revokeMeasurement(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>
        <span v-else>
          {{ $t("view.no_asset_measurements") }}
        </span>
        <Button :label="$t('view.button.add_measurement')" @click="addMeasurement" />

        <measurement-select ref="measurementSelectDialog" :asset-id="selectedAsset.id" @select="onMeasurementSelect"></measurement-select>
      </template>
    </Card>
  </Dialog>
</template>

<script>
import AssetForm from "./AssetForm.vue";
import AssetSelectDialog from "./AssetSelectDialog.vue";
import MeasurementSelect from "./MeasurementSelect.vue";
import AssetConnectionManagementDialog from "./AssetConnectionManagementDialog.vue";
import AssetCategorySelection from "./AssetCategorySelection.vue";
import AssetProperties from "@/components/management/infrastructure/AssetProperties.vue";
import AssetAggregationProperties from "@/components/management/infrastructure/AssetAggregationProperties.vue";
import AssetEdit from "@/components/management/infrastructure/AssetEdit.vue";
import { DeferredFunction } from "@/plugins/renergetic/utils.js";
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
    AssetAggregationProperties,
    AssetForm,
    AssetSelectDialog,
    MeasurementSelect,
    AssetConnectionManagementDialog,
    AssetCategorySelection,
  },
  props: {
    assetList: { type: Array, default: () => [] },
    filters: { type: Array, default: () => initFilter() },
    // page: { type: Number, default: 0 },
    offset: { type: Number, default: 0 },
    hiddenFilters: { type: Boolean, default: false },
    basic: { type: Boolean, default: false },
  },
  emits: ["update:filters", "reload", "onSelect"],
  data() {
    return {
      mOffset: this.offset,
      assetAdd: false,
      mFilters: this.filters ? this.filters : initFilter(),
      // selectedRow: null,
      childDialog: false,
      measurementDialog: false,
      deferredEmitFilter: null,
      selectedAsset: null,
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
  created() {
    this.deferredEmitFilter = new DeferredFunction(this._emitFilter);
  },
  methods: {
    _emitFilter() {
      // console.info("emitFilter: " + new Date());
      this.$emit("update:filters", this.mFilters);
    },
    onFilter(ev) {
      this.mFilters = ev.filters;
      this.deferredEmitFilter.run();
    },
    hasMeasurementsTooltip(asset) {
      if (asset.measurements && asset.measurements.length > 0) {
        return ` (${this.$t("view.asset_has_assigned_measurements")})`;
      }
      return "";
    },
    setParent(row) {
      console.info(row);
      this.selectedAsset = row;
      this.$refs.assetSelectDialog.open(row.parent);
    },
    manageConnections(row) {
      this.$refs.assetConnectionManagementDialog.open(row);
    },
    manageAssetProperties(row) {
      let detailsKeys = this.$store.getters["view/assetDetailsKeys"];
      this.$refs.assetPropertiesDialog.open(row, detailsKeys);
    },
    manageAssetAggregrationProperties(row) {
      this.$refs.assetAggregationPropertiesDialog.open(row);
    },
    ////
    manageAssetCategories(row) {
      this.$refs.assetCategorySelection.open(row);
    },
    ////
    editAsset(row) {
      this.$refs.assetEditDialog.open(row);
    },
    viewChildren(row) {
      console.info(row);
      this.selectedAsset = row;
      this.childDialog = true;
    },
    viewMeasurements(row) {
      console.info(row);
      this.selectedAsset = row;
      this.measurementDialog = true;
    },

    async onParentChange(parent) {
      await this.$ren.managementApi.assignParent(this.selectedAsset, parent.id);
      this.$emit("reload");
    },

    async revokeParent(asset) {
      this.$confirm.require({
        message: this.$t("view.asset_parent_revoke_confirm", {
          label: asset.label ? asset.label : asset.name,
        }),
        header: this.$t("view.asset_parent_revoke"),
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          this.$ren.managementApi.revokeParent(asset).then(() => {
            this.$emitter.emit("information", { message: this.$t("information.asset_parent_revoked") });
            this.reload();
          });
        },
        reject: () => this.$confirm.close(),
      });
    },
    addMeasurement() {
      this.$refs.measurementSelectDialog.open();
    },
    manageCategories() {
      this.$router.push({ name: "AssetCategoryList" });
    },

    manageTypes() {
      this.$router.push({ name: "AssetTypeList" });
    },

    revokeMeasurement(measurement) {
      let asset = this.selectedAsset;
      let label = measurement.label ? measurement.label : measurement.name;
      this.$confirm.require({
        message: this.$t("view.asset_measurement_revoke_confirm", {
          label: label,
        }),
        header: this.$t("view.asset_measurement_revoke"),
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          this.$ren.managementApi.revokeAssetMeasurement(asset.id, measurement.id).then((measurement) => {
            this.$emitter.emit("information", { message: this.$t("information.measurement_revoked") });
            console.info(measurement);
            // this.selectedAsset.measurements.remove(measurement); tODo: remove from the list measurement
            this.reload();
          });
        },
        reject: () => {
          this.$confirm.close();
        },
      });
    },
    onMeasurementSelect(measurement) {
      let asset = this.selectedAsset;
      let label = measurement.label ? measurement.label : measurement.name;
      this.$confirm.require({
        message: this.$t("view.asset_measurement_assign_confirm", {
          label: label,
        }),
        header: this.$t("view.asset_measurement_assign"),
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          this.$ren.managementApi.assignAssetMeasurement(asset.id, measurement.id).then((res) => {
            if (res) {
              this.$emitter.emit("information", { message: this.$t("information.measurement_assigned") });
              this.selectedAsset.measurements.push(measurement);
              this.reload();
            }
          });
        },
        reject: () => {
          this.$confirm.close();
        },
      });
    },
    async updateDetails(asset, details) {
      for (const [key, value] of Object.entries(details)) {
        console.log(key + " " + value);
        if (value === null || value.length === 0) {
          await this.$ren.managementApi.deleteAssetDetail(asset.id, key);
        } else if (asset.details[key] === null || asset.details[key] === undefined) {
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

    async onCreate(o) {
      await this.$ren.managementApi.addAsset(o).then((assetId) => {
        console.debug("add asset:" + assetId);
        this.addAsset = false;
        // o.id = assetId;
        // this.assetList.push(o);
      });
      await this.reload();
    },

    async reloadAssets(evt) {
      this.$emit("reload", evt);
    },
    async reload() {
      this.$emit("reload");
    },

    clearFilter() {
      this.mFilters = initFilter();
      this.$emit("update:filters", this.mFilters);
    },
    deleteAsset(asset) {
      let label = asset.label ? asset.label : asset.name;
      this.$confirm.require({
        message: this.$t("view.asset_delete_confirm", {
          label: label,
        }),
        header: this.$t("view.asset_delete"),
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          this.$ren.managementApi.deleteAsset(asset.id).then(() => {
            this.$emitter.emit("information", { message: this.$t("information.asset_deleted") });
          });
          this.reload();
        },
        reject: () => {
          this.$confirm.close();
        },
      });
    },
    onSelect(evt) {
      if (this.selectedRow == null || (evt != null && evt.id != this.selectedRow.id)) {
        this.selectedRow = evt;
      } else {
        this.selectedRow = null;
      }
      this.$emit("onSelect", this.selectedRow);
    },
  },
};
</script>
<style lang="scss">
.asset-list .p-datatable-tbody td {
  padding: 0.5rem 0.5rem !important;
  max-width: 15rem;
}
.asset-list .p-datatable-tbody button {
  margin: 0.25rem 0.25rem;
}
.asset-list .p-datatable-tbody td:first-child {
  padding-left: 0.75rem !important;
}
.asset-list .p-datatable-tbody td:last-child {
  padding-right: 0.75rem !important;
}
</style>
