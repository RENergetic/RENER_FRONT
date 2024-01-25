<template>
  <div class="ren">
    <TabView>
      <TabPanel :header="$t('view.properties')">
        <ren-input v-if="mModel.id" v-model="mModel.id" :disabled="true" :text-label="'model.information_panel.tile.id'" />
        <ren-input
          v-model="mModel.name"
          :text-info="'model.name_description'"
          :text-label="'model.information_panel.tile.name'"
          :invalid="v$.mModel.name.$invalid"
          :errors="v$.mModel.name.$silentErrors"
        />
        <ren-input
          v-model="mModel.label"
          :text-info="'model.label_description'"
          :text-label="'model.information_panel.tile.label'"
          :invalid="v$.mModel.label.$invalid"
          :errors="v$.mModel.label.$silentErrors"
        />
        <ren-switch
          v-model="mModel.type"
          :text-label="'model.information_panel.tile.type'"
          :options="[
            { label: $t('enums.tile_type.list'), value: 'list' },
            { label: $t('enums.tile_type.single'), value: 'single' },
            { label: $t('enums.tile_type.doughnut'), value: 'doughnut' },
            { label: $t('enums.tile_type.chart'), value: 'chart' },
            { label: $t('enums.tile_type.multi_knob'), value: 'multi_knob' },
            { label: $t('enums.tile_type.knob'), value: 'knob' },
          ]"
          :invalid="v$.mModel.type.$invalid"
          :errors="v$.mModel.type.$silentErrors"
        />
        <ren-input v-model="propsJSON" :text-label="'model.information_panel.tile.props'" />

        <ren-input-number
          v-model="mModel.layout.x"
          :min="0"
          :max="100"
          :only-integer="true"
          :default-value="0"
          :text-label="'model.information_panel.tile.x'"
        />
        <ren-input-number
          v-model="mModel.layout.y"
          :min="0"
          :max="100"
          :only-integer="true"
          :default-value="0"
          :text-label="'model.information_panel.tile.y'"
        />
        <ren-input-number
          v-model="mModel.layout.h"
          :min="1"
          :max="12"
          :only-integer="true"
          :default-value="3"
          :text-label="'model.information_panel.tile.h'"
        />
        <ren-input-number
          v-model="mModel.layout.w"
          :min="1"
          :max="12"
          :only-integer="true"
          :default-value="3"
          :text-label="'model.information_panel.tile.w'"
        />
      </TabPanel>
      <TabPanel :header="$t('view.measurements')">
        <Button :label="$t('view.button.add_measurement')" icon="pi pi-plus-circle" @click="addMeasurementDialog = true" />

        <ul>
          <li v-for="m in mModel.measurements" :key="m.id">
            <div>
              <!-- <span v-if="m.aggregation_function">{{ m.id }} ({{ $t("enums.measurement_aggregation." + m.aggregation_function) }})</span>
              <span v-else>{{ m.id }} </span> -->
              <!-- <span>{{ m.id }} </span> -->

              <ren-input :model-value="$t('model.measurement.id') + ': ' + m.id" disabled :read-only="true" />
              <span style="width: 15rem">
                <ren-input-wrapper
                  :text-label="null"
                  :inline="true"
                  :model-value="
                    $t('model.measurement.measurement_aggregation') + ': ' + $t('enums.measurement_aggregation.' + m.aggregation_function)
                  "
                >
                  <template #content>
                    <Dropdown
                      v-model="m.aggregation_function"
                      style="min-width: 12rem"
                      :options="aggregations"
                      :option-label="(opt) => $t(`enums.measurement_aggregation.${opt}`)"
                      :placeholder="$t('view.select_measurement_aggregation')"
                      @change="functionChange"
                    />
                  </template>
                </ren-input-wrapper>
              </span>
              <!-- @change="filterCallback()" -->
              <Button
                :key="m.tooltip"
                v-tooltip="m.tooltip"
                icon="pi pi-question-circle"
                class="p-button-rounded"
                @mouseover="downloadMeasurementDetails(m)"
                @click="showMeasurement(m)"
              />
              <Button v-tooltip="$t('view.delete')" icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="deleteMeasurement(m)" />

              <!-- $t('view.view_json') click more details -->
            </div>
          </li>
        </ul>
      </TabPanel>
    </TabView>
  </div>
  <!-- v-model:visible="jsonMesurementDialog" v-model="selectedMesurement" -->
  <MeasurementDialog ref="mesurementDialog" :reload="true" />
  <Dialog v-model:visible="addMeasurementDialog" :style="{ width: '100vw', height: '100vh', maxHeight: '100%' }" :modal="true" :maximized="true">
    <Card class="ren-page-content">
      <template #content>
        <MeasurementSelect @select="addMeasurement" />
      </template>
    </Card>
  </Dialog>
</template>

<script>
import { MeasurementAggregation } from "@/plugins/model/Enums.js";
export function cleanTileStructure(mTile) {
  if (mTile.measurements) {
    mTile.measurements = mTile.measurements
      .map((m) => {
        let obj;
        if (m.id !== undefined && m.id != null) {
          return { id: m.id, aggregation_function: m.aggregation_function };
        } else {
          //if (isTemplate) {
          obj = {
            name: m.name === null ? undefined : m.name,
            domain: m.domain === null ? undefined : m.domain,
            direction: m.direction === null ? undefined : m.direction,
            sensor_name: m.sensor_name === null ? undefined : m.sensor_name,
            aggregation_function: m.aggregation_function === null ? undefined : m.aggregation_function,
          };
          if (m.type) {
            obj.type = { id: m.type.id, physical_name: m.type.physical_name, name: m.type.name, unit: m.type.unit };
          }
          if (m.asset) {
            obj.asset = { id: m.asset.id, name: m.asset.name };
          }
          return obj;
        }
        //return null;
      })
      .filter((m) => m != null);
  }
}
import { useVuelidate } from "@vuelidate/core";
import { maxLength, required, minLength } from "@/plugins/validators.js";
import MeasurementDialog from "@/components/management/infrastructure/measurement/MeasurementDialog.vue";
import MeasurementSelect from "@/components/management/infrastructure/measurement/MeasurementSelect.vue";
export default {
  name: "InformationPanelTileForm",
  components: { MeasurementDialog, MeasurementSelect },
  props: {
    modelValue: {
      type: Object,
      default: () => ({ measurements: [] }),
    },
  },
  emits: ["update:modelValue"],
  setup: () => ({ v$: useVuelidate() }),
  data() {
    let tileStructure = this.modelValue;
    cleanTileStructure(tileStructure);
    return {
      // jsonMesurementDialog: false,
      // selectedMesurement: null,
      aggregations: MeasurementAggregation.keys(),
      addMeasurementDialog: false,
      mModel: tileStructure,
      // mPanelStructure: null,
      measurementsJSON: JSON.stringify(tileStructure.measurements, null, "\t"),
      propsJSON: tileStructure.props != null ? JSON.stringify(tileStructure.props, null, "\t") : "{}",
    };
  },
  validationConfig: {
    $lazy: true,
  },
  validations() {
    return {
      mModel: {
        name: { maxLength: maxLength(40), required: required, minLength: minLength(2) },
        label: { maxLength: maxLength(80), minLength: minLength(2) },
        type: { required: required },
      },
    };
  },
  watch: {
    propsJSON: {
      handler: function (v) {
        if (v != null) this.mModel.props = JSON.parse(v);
      },
      immediate: true,
    },
    measurementsJSON: {
      handler: function (v) {
        if (v != null) this.mModel.measurements = JSON.parse(v);
      },
      immediate: true,
    },
    mModel: {
      handler: function (mModel) {
        // console.info(mModel);
        this.$emit("update:modelValue", mModel);
      },
      deep: true,
      immediate: true,
    },
  },
  async mounted() {},
  methods: {
    async downloadMeasurementDetails(m) {
      if (!m.name)
        await this.$ren.managementApi.getMeasurement(m.id).then((mm) => {
          m.name = mm.name;
          m.label = mm.label;
          m.tooltip = mm.label ? `${mm.label} (${mm.name})` : mm.name;
        });
      else {
        m.tooltip = m.label ? `${m.label} (${m.name})` : m.name;
      }
      // this.tooltip = m.name;
    },
    showMeasurement(m) {
      this.$refs.mesurementDialog.show(m);
      // this.jsonMesurementDialog = true;
    },
    async deleteMeasurement(m) {
      await this.downloadMeasurementDetails(m);
      await this.deleteConfirm({
        message: this.$t("view.delete_tile_measurement", { label: m.label ? m.label : m.name }),
        action: async () => {
          this.mModel.measurements = this.mModel.measurements.filter((it) => it.id != m.id);
          this.$emit("update:modelValue", this.mModel);
        },
      });
    },
    functionChange() {
      this.$emit("update:modelValue", this.mModel);
    },
    async addMeasurement(m) {
      var exists = this.mModel.measurements.filter((it) => it.id == m.id).length > 0;
      if (!exists) {
        m.aggregation_function = MeasurementAggregation.last;
        this.mModel.measurements.push(m);
        this.$emit("update:modelValue", this.mModel);
      }
      this.addMeasurementDialog = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
