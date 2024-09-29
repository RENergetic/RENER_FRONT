<template>
  <TabView id="tile-panel" v-model:activeIndex="mActiveTab" class="ren flex flex-column" style="height: 100%">
    <TabPanel :header="$t('view.properties')">
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
          { label: $t('enums.tile_type.empty'), value: 'empty' },
          { label: $t('enums.tile_type.list'), value: 'list' },
          { label: $t('enums.tile_type.single'), value: 'single' },
          { label: $t('enums.tile_type.doughnut'), value: 'doughnut' },
          { label: $t('enums.tile_type.chart'), value: 'chart' },
          { label: $t('enums.tile_type.multi_knob'), value: 'multi_knob' },
          { label: $t('enums.tile_type.knob'), value: 'knob' },
          { label: $t('enums.tile_type.image'), value: 'image' },
          { label: $t('enums.tile_type.qrcode'), value: 'qrcode' },
        ]"
        :invalid="v$.mModel.type.$invalid"
        :errors="v$.mModel.type.$silentErrors"
      />
      <ren-input-wrapper :text-label="'model.information_panel.tile.props'">
        <template #content>
          <!-- <InfoIcon :floating="true">
            <template #content>
              <Button style="width: max-content" :label="$t('view.button.show_available_tile_icons')" @click="iconsDialog = true" />
              <Button :label="$t('view.button.show_available_tile_properties')" @click="propertiesDialog = true" />
            </template>
          </InfoIcon> -->

          <div class="flex flex-row">
            <ren-input v-model="propsJSON" :invalid="!validJSON" style="flex-grow: 1" />

            <Button
              v-if="validJSON"
              v-tooltip="$t('view.edit')"
              style="width: 2.357rem"
              icon="pi pi-pencil"
              class="p-button-rounded"
              @click="propertiesDialog = true"
            />
            <Button v-else v-tooltip="$t('view.edit')" style="width: 2.357rem" icon="pi pi-pencil" class="p-button-rounded disabled" />
          </div>
        </template>
      </ren-input-wrapper>
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
      <ren-input v-if="mModel.id" v-model="mModel.id" :disabled="true" :text-label="'model.information_panel.tile.id'" />
    </TabPanel>
    <TabPanel :header="$t('view.measurements')">
      <div class="grid ren flex">
        <div class="col-12 flex flex-column">
          <ul>
            <li v-for="(m, index) in mModel.measurements" :key="`${m.id}_${index}`">
              <div>
                <!-- <span v-if="m.aggregation_function">{{ m.id }} ({{ $t("enums.measurement_aggregation." + m.aggregation_function) }})</span>
              <span v-else>{{ m.id }} </span> -->
                <!-- <span>{{ m.id }} </span> -->

                <ren-input v-if="m.id" :model-value="$t('model.measurement.id') + ': ' + m.id" disabled :read-only="true" />
                <ren-input v-else :model-value="$t('model.measurement.temp_id') + ': ' + m.tempId" disabled :read-only="true" />
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
                <Button
                  v-tooltip="$t('view.delete')"
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-danger"
                  @click="deleteMeasurement(m, index)"
                />
                <Button
                  v-if="m.id != null"
                  v-tooltip="$t('view.show_details')"
                  icon="pi pi-cog"
                  class="p-button-rounded"
                  @click="showMeasurementDetails(m)"
                />
                <!-- $t('view.view_json') click more details -->
              </div>
            </li>
          </ul>
        </div>

        <div class="col-12 grid ren flex">
          <div class="col-12 flex flex-column">
            <Button :label="$t('view.button.add_measurement')" icon="pi pi-plus-circle" @click="addMeasurementDialog = true" />
          </div>
          <div class="col-12 flex flex-column">
            <Button :label="$t('view.button.add_measurement_template')" icon="pi pi-plus-circle" @click="addMeasurementTemplateDialog = true" />
          </div>
        </div>
      </div>
    </TabPanel>
  </TabView>
  <MeasurementDialog ref="mesurementDialog" :reload="true" />
  <Dialog v-model:visible="addMeasurementDialog" :style="{ width: '100vw', height: '100vh', maxHeight: '100%' }" :modal="true">
    <Card class="ren-page-content">
      <template #content>
        <MeasurementSelect :selected-measurements="mModel.measurements" @select="addMeasurement" />
      </template>
    </Card>
  </Dialog>
  <Dialog v-model:visible="addMeasurementTemplateDialog" :style="{ width: '100vw', height: '100vh', maxHeight: '100%' }" :modal="true">
    <Card class="ren-page-content">
      <template #content>
        <MeasurementTileForm @update="addMeasurementTemplate" @cancel="addMeasurementTemplateDialog = false" />
      </template>
    </Card>
  </Dialog>
  <Dialog v-model:visible="iconsDialog" :dismissable-mask="true" :style="{ maxWidth: '80vw', maxHeight: '100%' }" :modal="true">
    <Card class="ren-page-content" style="width: max-content">
      <template #content>
        <div>
          <ol>
            <li v-for="icon in Object.keys(icons)" :key="icon">{{ icon }} : <font-awesome-icon :icon="icons[icon]" /> ({{ icons[icon] }})</li>
          </ol>
        </div>
      </template>
    </Card>
  </Dialog>
  <Dialog v-model:visible="propertiesDialog" :dismissable-mask="true" :style="{ maxHeight: '100%' }" :modal="true">
    <Card class="ren-page-content" style="width: max-content; max-width: 40rem">
      <template #content>
        <Settings v-if="propertiesSchema" :schema="propertiesSchema" :settings="tileProperties" @update:settings="onPropertiesChange"></Settings>
        <Button :label="$t('view.button.close')" class="flex-grow-0 ren-button" style="width: 100%" @click="propertiesDialog = false" />
        <!-- <ul>
          <li v-for="p in tileProperties.filter((it) => !it.hidden)" :key="p.key">
            <ren-input v-model="p.key" :disabled="true" :text-label="`model.information_panel.tile.properties.${p.key}`" />

           
            {{ $t(`model.information_panel.tile.properties.${p.key}_description`) }} ({{ p.type ? p.type : "string" }})
          </li>
        </ul> -->
      </template>
    </Card>
  </Dialog>
  <Dialog v-model:visible="measurementDetailsDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <MeasurementDetails
      v-if="mMeasurement"
      :measurement="mMeasurement"
      :autosave="true"
      :model="mMeasurement.measurement_details"
      @update="onMeasurementDetailsUpdate"
    />
    <!--  -->
  </Dialog>
</template>

<script>
import { MeasurementAggregation } from "@/plugins/model/Enums.js";
export function cleanTileStructure(mTile, clearIDs = false) {
  if (clearIDs) delete mTile.id;
  if (!mTile.id && !mTile.tempId) {
    mTile.tempId = new Date().getTime() + Math.round(Math.random() * new Date().getTime());
  }
  if (mTile.measurements) {
    mTile.measurements = mTile.measurements
      .map((m) => {
        let obj;
        // if (m.id !== undefined && m.id != null && !clearIDs) {
        //   return { id: m.id, aggregation_function: m.aggregation_function };
        // } else {
        //if (isTemplate) {
        obj = {
          name: m.name === null ? undefined : m.name,
          domain: m.domain === null ? undefined : m.domain,
          direction: m.direction === null ? undefined : m.direction,
          sensor_name: m.sensor_name === null ? undefined : m.sensor_name,
          aggregation_function: m.aggregation_function === null ? undefined : m.aggregation_function,
        };
        if (!clearIDs) obj.id = m.id;
        if (m.type) {
          obj.type = { physical_name: m.type.physical_name, name: m.type.name, unit: m.type.unit };
          if (!clearIDs) obj.type.id = m.type.id;
        }
        if (m.asset) {
          obj.asset = { name: m.asset.name };
          if (!clearIDs) obj.asset.id = m.asset.id;
        }
        if (!obj.id) {
          obj.tempId = new Date().getTime() + Math.round(Math.random() * new Date().getTime());
        }

        return obj;
        // }
        //return null;
      })
      .filter((m) => m != null);
  }
}
import { useVuelidate } from "@vuelidate/core";
import { maxLength, required, minLength } from "@/plugins/validators.js";
import MeasurementDialog from "@/components/management/infrastructure/measurement/MeasurementDialog.vue";
import MeasurementSelect from "@/components/management/infrastructure/measurement/MeasurementSelect.vue";
import MeasurementDetails from "@/components/management/infrastructure/measurement/MeasurementDetails.vue";
import Settings from "@/components/miscellaneous/settings/Settings.vue";
import MeasurementTileForm from "./MeasurementTileForm.vue";
import icons from "./informationtile/components/icons.js";
// import tilePropertiesSchema from "./informationtile/components/properties.js";
import { getTileProperties } from "./informationtile/components/properties.js";

export default {
  name: "InformationPanelTileForm",
  components: { MeasurementDialog, MeasurementSelect, MeasurementTileForm, MeasurementDetails, Settings },
  props: {
    activeTab: { type: Number, default: 0 },
    modelValue: {
      type: Object,
      default: () => ({ measurements: [] }),
    },
  },
  emits: ["update:modelValue", "update:activeTab"],
  setup: () => ({ v$: useVuelidate() }),
  data() {
    let tileStructure = JSON.parse(JSON.stringify(this.modelValue));
    cleanTileStructure(tileStructure);
    return {
      // jsonMesurementDialog: false,
      // selectedMesurement: null,
      measurementDetailsDialog: false,
      mMeasurement: null,
      mActiveTab: this.activeTab,
      icons: icons,
      propertiesDialog: false,
      // tilePropertiesSchema: tilePropertiesSchema,
      tileProperties: tileStructure.props,
      aggregations: MeasurementAggregation.keys(),
      addMeasurementDialog: false,
      addMeasurementTemplateDialog: false,
      iconsDialog: false,
      mModel: tileStructure,
      // mPanelStructure: null,
      measurementsJSON: this.$ren.utils.toJSON(tileStructure.measurements, true),
      propsJSON: tileStructure.props != null ? this.$ren.utils.toJSON(tileStructure.props) : "{}",
      validJSON: true,
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
  computed: {
    propertiesSchema: function () {
      return getTileProperties(this.mModel.type);
    },
  },
  watch: {
    propsJSON: {
      handler: function (v) {
        try {
          if (v != null) {
            this.mModel.props = JSON.parse(v);
            this.tileProperties = this.mModel.props;
            this.validJSON = true;
          }
        } catch {
          this.validJSON = false;
        }
      },
      immediate: true,
    },
    mActiveTab: {
      handler: function (tab) {
        this.$emit("update:activeTab", tab);
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
        console.info("update tile");
        console.debug(mModel);
        this.$emit("update:modelValue", mModel);
      },
      deep: true,
    },
  },
  async mounted() {},
  methods: {
    onPropertiesChange(tileProperties) {
      this.tileProperties = tileProperties;
      this.propsJSON = this.$ren.utils.toJSON(tileProperties);
    },
    async showMeasurementDetails(measurement) {
      this.mMeasurement = measurement;
      await this.$ren.managementApi.getMeasurementProperties(measurement.id).then((details) => {
        this.mMeasurement.measurement_details = details ? details : {};
      });

      this.measurementDetailsDialog = true;
    },
    onMeasurementDetailsUpdate() {
      this.mMeasurement = null;
      this.measurementDetailsDialog = false;
    },
    async downloadMeasurementDetails(m) {
      if (m.id) {
        if (!m.name)
          await this.$ren.managementApi.getMeasurement(m.id).then((mm) => {
            m.name = mm.name;
            m.label = mm.label;
            m.tooltip = mm.label ? `${mm.label} (${mm.name})` : mm.name;
          });
        else {
          m.tooltip = m.label ? `${m.label} (${m.name})` : m.name;
        }
      } else {
        //template
        m.tooltip = m.name ? m.name : this.$t("view.measurement_template");
      }
    },
    showMeasurement(m) {
      this.$refs.mesurementDialog.show(m);
      // this.jsonMesurementDialog = true;
    },
    async deleteMeasurement(m, index) {
      if (m.id) {
        await this.downloadMeasurementDetails(m);
        await this.deleteConfirm({
          message: this.$t("view.delete_tile_measurement", { label: m.label ? m.label : m.name }),
          action: async () => {
            // this.mModel.measurements = this.mModel.measurements.filter((it) => it.id != m.id);
            this.mModel.measurements.splice(index, 1);
            this.$emit("update:modelValue", this.mModel);
          },
        });
      } else {
        // this.mModel.measurements = this.mModel.measurements.filter((it) => it.tempId != m.tempId);
        this.mModel.measurements.splice(index, 1);
        this.$emit("update:modelValue", this.mModel);
      }
    },
    functionChange() {
      this.$emit("update:modelValue", this.mModel);
    },
    addMeasurementTemplate(mt) {
      mt.aggregation_function = MeasurementAggregation.last;
      mt._inferred = false;
      this.mModel.measurements.push(mt);
      this.$emit("update:modelValue", this.mModel);
      this.addMeasurementTemplateDialog = false;
    },
    addMeasurement(m) {
      var exists = this.mModel.measurements.filter((it) => it.id == m.id).length > 0;
      if (!exists) {
        m.aggregation_function = MeasurementAggregation.last;
        m._inferred = false;
        this.mModel.measurements.push(m);
        this.$emit("update:modelValue", this.mModel);
      }
      this.addMeasurementDialog = false;
    },
  },
};
</script>

<style lang="scss">
#tile-panel .p-tabview-panels {
  flex-grow: 1;
  height: 100%;
  overflow: auto;
}
</style>
