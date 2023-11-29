<template>
  <div class="ren">
    <TabView>
      <TabPanel :header="$t('view.properties')">
        <ren-input v-if="mModel.id" v-model="mModel.id" :disabled="true" :text-label="'model.information_panel.tile.id'" />
        <ren-input
          v-model="mModel.name"
          :text-label="'model.information_panel.tile.name'"
          :invalid="v$.mModel.name.$invalid"
          :errors="v$.mModel.name.$silentErrors"
        />
        <ren-input
          v-model="mModel.label"
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
        <ren-input-wrapper :text-label="null">
          <template #content>
            <Textarea v-model="measurementsJSON" style="width: 100%" :maxlength="10000" rows="15" :cols="80"></Textarea>
          </template>
        </ren-input-wrapper>
      </TabPanel>
    </TabView>
  </div>
</template>

<script>
export function cleanTileStructure(mTile) {
  // let mTile = JSON.parse(JSON.stringify(tile));
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
export default {
  name: "InformationPanelTileForm",
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
        console.info(mModel);
        this.$emit("update:modelValue", mModel);
      },
      deep: true,
      immediate: true,
    },
  },
  async mounted() {},
  methods: {
    // async infer( ) {
    //     return await this.$ren.dashboardApi.inferTileMeasurements(this.mModel).then((inferredTile) => {
    //       return cleanTileStructure(inferredPanel);
    //     });
    //   }
    //   return getCleanPanelStructure(panel);
    // },
  },
};
</script>

<style lang="scss" scoped></style>
