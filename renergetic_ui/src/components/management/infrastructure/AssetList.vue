<template>
  <InfoIcon :show-icon="false">
    <template #content>
      <!-- some info -->
    </template>
  </InfoIcon>

  <DataTable :value="assetList">
    <!-- <Column v-for="col of columns" :key="col" :field="col" :header="$t('model.asset.' + col)"></Column> -->
    <Column field="name" :header="$t('model.asset.name')"> </Column>
    <Column field="label" :header="$t('model.asset.label')"> </Column>
    <Column field="asset_type" :header="$t('model.asset.asset_type')"> </Column>
    <Column field="child" :header="$t('model.asset.child')">
      <template #body="slotProps">
        <span v-if="slotProps.data.child && slotProps.data.child.length > 0" @click="viewChildren(slotProps)">
          {{ $t("view.view_asset_children") }}
        </span>
        <span v-else class="disabled">
          {{ $t("view.no_asset_children") }}
        </span>
      </template>
    </Column>

    <Column field="parent" :header="$t('model.asset.parent')">
      <template #body="slotProps">
        <span v-if="slotProps.data.parent" @click="setParent(slotProps)">
          {{ slotProps.data.parent.label }}
        </span>
        <span v-else class="disabled" @click="setParent(slotProps)">
          {{ $t("view.no_parent") }}
        </span>
      </template>
    </Column>
    <Column field="measurements" :header="$t('model.asset.measurements')">
      <template #body="slotProps">
        <span
          v-if="slotProps.data.measurements && slotProps.data.measurements.length > 0"
          @click="viewMeasurements(slotProps)"
        >
          {{ $t("view.view_asset_measurements") }}
        </span>
        <span v-else class="disabled">
          {{ $t("view.no_asset_measurements") }}
        </span>
      </template>
    </Column>
    <Column field="roles" :header="$t('model.asset.roles')"> <template #body>TODO:</template></Column>
    <Column name="edit" :header="$t('view.edit')"> <template #body>TODO:</template></Column>
    <!-- <Column field="geo_location" :header="$t('model.asset.geo_location')"> </Column> -->
  </DataTable>
  <Button :label="$t('view.button.add')" @click="assetAdd = true" />
  <Dialog
    v-model:visible="assetAdd"
    :style="{ width: '75vw' }"
    :maximizable="true"
    :modal="true"
    :dismissable-mask="true"
  >
    <AssetForm @update:model-value="onCreate($event, 0)"></AssetForm>
  </Dialog>
  <AssetSelect ref="assetSelectDialog" @change="onParentChange" />
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
        <DataTable v-if="selectedRow" :value="selectedRow.data.child">
          <!-- <Column v-for="col of columns" :key="col" :field="col" :header="$t('model.asset.' + col)"></Column> -->
          <Column field="name" :header="$t('model.asset.name')"> </Column>
          <Column field="label" :header="$t('model.asset.label')"> </Column>
          <Column field="asset_type" :header="$t('model.measurement.asset_type')"> </Column>
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
        <!-- {{ selectedRow.data.measurements }}  -->
        <DataTable v-if="selectedRow" :value="selectedRow.data.measurements">
          <!-- <Column v-for="col of columns" :key="col" :field="col" :header="$t('model.asset.' + col)"></Column> -->
          <Column field="name" :header="$t('model.measurement.name')"> </Column>
          <Column field="label" :header="$t('model.measurement.label')"> </Column>
          <Column field="measurement_type" :header="$t('model.measurement.measurement_type')"> </Column>
        </DataTable>
        <span v-else>
          {{ $t("view.no_asset_measurements") }}
        </span>

        <Button :label="$t('view.button.add_measurement')" @click="addMeasurement" />
        <measurement-select
          ref="measurementSelectDialog"
          :asset-id="selectedRow.data.id"
          @select="onMeasurementSelect"
        ></measurement-select>
      </template>
    </Card>
  </Dialog>
</template>

<script>
import InfoIcon from "@/components/miscellaneous/InfoIcon.vue";
import AssetForm from "./AssetForm.vue";
import AssetSelect from "./AssetSelect.vue";
import MeasurementSelect from "./MeasurementSelect.vue";

export default {
  name: "AssetList",
  components: { InfoIcon, AssetForm, AssetSelect, MeasurementSelect },
  props: {},
  data() {
    return {
      assetAdd: false,
      assetList: [],
      columns: [],
      selectedRow: null,
      childDialog: false,
      measurementDialog: false,
    };
  },
  computed: {},
  watch: {},
  async created() {
    this.assetList = await this.$ren.managementApi.listAsset();
    if (this.assetList != null && this.assetList.length > 0) {
      this.columns = Object.keys(this.assetList[0]);
    }
  },
  methods: {
    setParent(row) {
      console.info(row.data);
      this.selectedRow = row;
      this.$refs.assetSelectDialog.open(row.data.parent);
    },
    viewChildren(row) {
      console.info(row.data);
      this.selectedRow = row;
      this.childDialog = true;
    },

    viewMeasurements(row) {
      console.info(row.data);
      this.selectedRow = row;
      this.measurementDialog = true;
    },

    onParentChange(parent) {
      this.selectedRow.data.parent = parent;
    },
    addMeasurement() {
      this.$refs.measurementSelectDialog.open();
    },
    onMeasurementSelect(measurement) {
      this.selectedRow.data.measurements.push(measurement);
    },
    async onCreate(o) {
      await this.$ren.managementApi.addAsset(o).then((assetId) => {
        console.info("add asset:" + assetId);
        o.id = assetId;
        this.assetList.push(o);
      });
    },
    // async loadData() {
    //   await this.$ren.measurementApi.measurements(this.objects).then((data) => {
    //     this.data = data;
    //   });
    // },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
