<template>
  <DataTable
    :value="assetList"
    :lazy="true"
    data-key="id"
    :filters="filters"
    filter-display="row"
    :loading="isLoading"
    responsive-layout="scroll"
    :global-filter-fields="['name', 'label', 'type.name', 'category.label']"
    @filter="onFilter"
  >
    <Column field="name" :header="$t('model.asset.name')" :show-filter-menu="false">
      <template #filter="{ filterModel, filterCallback }">
        <InputText
          v-model="filterModel.value"
          type="text"
          class="p-column-filter"
          :placeholder="$t('view.search')"
          @input="filterCallback()"
        />
      </template>
    </Column>
    <Column field="label" :header="$t('model.asset.label')" :show-filter-menu="false">
      <template #filter="{ filterModel, filterCallback }">
        <InputText
          v-model="filterModel.value"
          type="text"
          class="p-column-filter"
          :placeholder="$t('view.search')"
          @input="filterCallback()"
        />
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
        <span v-if="slotProps.data.child && slotProps.data.child.length > 0" @click="viewChildren(slotProps.data)">
          {{ $t("view.view_asset_children") }}
        </span>
        <span v-else class="disabled">
          {{ $t("view.no_asset_children") }}
        </span>
      </template>
    </Column>

    <Column field="parent" :header="$t('model.asset.parent')">
      <template #body="slotProps">
        <span v-if="slotProps.data.parent" @click="setParent(slotProps.data)"> {{ slotProps.data.parent.label }} </span>
        <span v-else class="disabled" @click="setParent(slotProps.data)">
          {{ $t("view.no_parent") }}
        </span>
      </template>
    </Column>
    <Column field="measurements" :header="$t('model.asset.measurements')">
      <template #body="slotProps">
        <span
          v-if="slotProps.data.measurements && slotProps.data.measurements.length > 0"
          @click="viewMeasurements(slotProps.data)"
        >
          {{ $t("view.view_asset_measurements") }}
        </span>
        <span v-else class="disabled">
          {{ $t("view.no_asset_measurements") }}
        </span>
      </template>
    </Column>
    <Column name="asset_connections" :header="$t('model.asset.asset_connections')">
      <template #body="slotProps">
        <span @click="manageAssetConnections(slotProps.data)">
          {{ $t("view.manage_asset_connections") }}
        </span>
      </template></Column
    >
    <Column name="edit" :header="$t('view.properties')">
      <template #body
        >popup - edit key-value asset_details - list of possible keys :
        {{ $store.getters["view/assetDetailsKeys"] }}
      </template></Column
    >
    <Column name="edit" :header="$t('view.edit')">
      <template #body>TODO: edit other asset properties here</template></Column
    >
    <!-- <Column field="geo_location" :header="$t('model.asset.geo_location')"> </Column> -->
    <template #header>
      <div class="flex justify-content-between">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          :label="$t('view.button.filter')"
          class="p-button-outlined"
          @click="reload"
        />
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
          icon="pi pi-filter-slash"
          :label="$t('view.button.previous')"
          class="p-button-outlined"
          @click="previous"
        />

        <Button
          type="button"
          icon="pi pi-filter-slash"
          :label="$t('view.button.next')"
          class="p-button-outlined"
          @click="next"
        />
      </div>
    </template>
  </DataTable>
  <Button :label="$t('view.button.add')" @click="assetAdd = true" />
  <Dialog
    v-model:visible="assetAdd"
    :style="{ width: '75vw' }"
    :maximizable="true"
    :modal="true"
    :dismissable-mask="true"
  >
    <AssetForm @update:model-value="onCreate($event, 0)" @cancel="assetAdd = false"> </AssetForm>
  </Dialog>
  <AssetSelect ref="assetSelectDialog" @select="onParentChange" />
  <AssetConnectionManagement ref="assetConnectionManagementDialog" />

  <Dialog
    v-model:visible="childDialog"
    :style="{ width: '75vw' }"
    :maximizable="true"
    :modal="true"
    :dismissable-mask="true"
  >
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
  <Dialog
    v-model:visible="measurementDialog"
    :style="{ width: '75vw' }"
    :maximizable="true"
    :modal="true"
    :dismissable-mask="true"
  >
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
        <measurement-select
          ref="measurementSelectDialog"
          :asset-id="selectedRow.id"
          @select="onMeasurementSelect"
        ></measurement-select>
      </template>
    </Card>
  </Dialog>
</template>

<script>
import AssetForm from "./AssetForm.vue";
import AssetSelect from "./AssetSelect.vue";
import MeasurementSelect from "./MeasurementSelect.vue";
import AssetConnectionManagement from "./AssetConnectionManagement.vue";

const PAGE_SIZE = 10;
export default {
  name: "AssetList",
  components: { AssetForm, AssetSelect, MeasurementSelect, AssetConnectionManagement },
  props: {},
  data() {
    return {
      page: 0,
      isLoading: false,
      assetAdd: false,
      assetList: [],
      columns: [],
      selectedRow: null,
      childDialog: false,
      measurementDialog: false,
      filters: this.initFilter(),
    };
  },
  computed: {},
  async created() {
    this.assetList = await this.$ren.managementApi.listAsset();
    if (this.assetList != null && this.assetList.length > 0) {
      this.columns = Object.keys(this.assetList[0]);
    }
  },
  methods: {
    onFilter(ev) {
      this.filters = ev.filters;
    },
    setParent(row) {
      console.info(row);
      this.selectedRow = row;
      this.$refs.assetSelectDialog.open(row.parent);
    },
    manageAssetConnections(row) {
      this.$refs.assetConnectionManagementDialog.open(row);
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

    onParentChange(parent) {
      //tODO: integrate -TOMEK
      this.selectedRow.parent = { name: parent.name, id: parent.id, label: parent.label };
      //TODO: catch error
      this.$ren.managementApi.updateAsset({ ...this.selectedRow });
    },
    addMeasurement() {
      this.$refs.measurementSelectDialog.open();
    },
    onMeasurementSelect(measurement) {
      this.selectedRow.measurements.push(measurement);
    },
    async onCreate(o) {
      console.error("AQUI HA LLEGADO");
      console.log(o);
      await this.$ren.managementApi.addAsset(o).then((assetId) => {
        console.info("add asset:" + assetId);
        // o.id = assetId;
        // this.assetList.push(o);
      });
      this.reload();
    },

    async reload() {
      //TODO: tomek will manage filtering feature with api
      console.info(this.filters);
      let params = {
        label: this.filters.label.value,
        name: this.filters.name.value,
        type: this.filters["type.label"] ? this.filters["type.label"].value.name : null,
        category: this.filters["category.label"] ? this.filters["category.label"].value.name : null,
      };

      console.info(params);
      this.assetList = await this.$ren.managementApi.listAsset(params, PAGE_SIZE * this.page, PAGE_SIZE);
    },
    next() {
      if (this.assetList.length === 0) return;
      this.page += 1;
    },
    previous() {
      this.page = Math.max(0, this.page - 1);
    },
    clearFilter() {
      this.filters = this.initFilter();
    },

    initFilter() {
      return {
        label: { value: null },
        name: { value: null },
        "type.label": { value: null },
        "category.label": { value: null },
      };
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
