<template>
  <InfoIcon :show-icon="false">
    <template #content>
      <!-- some info -->
    </template>
  </InfoIcon>

  <Card v-if="mModel">
    <!-- <template #title> </template> -->
    <template #content>
      <!-- {{ mModel }}  -->
      <div class="ren">
        <ren-input
          v-model="mModel.name"
          :text-info="'model.name_description'"
          :text-label="'model.measurement.name'"
          :invalid="v$.mModel.name.$invalid"
          :errors="v$.mModel.name.$silentErrors"
        />
        <ren-input
          v-model="mModel.label"
          :text-info="'model.label_description'"
          :text-label="'model.measurement.label'"
          :invalid="v$.mModel.label.$invalid"
          :errors="v$.mModel.label.$silentErrors"
        />
        <!-- {{ mUnits }} -->
        <ren-input-wrapper :text-label="'model.measurement.domain'" :invalid="v$.mModel.domain.$invalid" :errors="v$.mModel.domain.$silentErrors">
          <template #content>
            <Dropdown
              id="measurementDomain"
              v-model="mModel.domain"
              :options="domains"
              :option-label="(opt) => $t('enums.domain.' + opt)"
              :placeholder="$t('view.select_measurement_domain')"
            />
          </template>
        </ren-input-wrapper>
        <ren-input-wrapper
          :text-label="'model.measurement.physical_type'"
          :invalid="v$.mModel.physical_type.$invalid"
          :errors="v$.mModel.physical_type.$silentErrors"
        >
          <template #content>
            <Dropdown
              id="measurementType"
              v-model="mModel.physical_type"
              :options="physicalTypes"
              :option-label="(opt) => $t('enums.physical_type.' + opt)"
              :placeholder="$t('view.select_physical_type')"
              @change="typeChange"
            />
          </template>
        </ren-input-wrapper>
        <ren-input-wrapper
          v-if="mModel.physical_type"
          :text-label="'model.measurement.unit'"
          :invalid="v$.mModel.unit.$invalid"
          :errors="v$.mModel.unit.$silentErrors"
        >
          <template #content>
            <!-- {{ mModel.unit }} -->
            <Dropdown
              id="measurementUnit"
              v-model="mModel.unit"
              :options="mUnits"
              option-label="unit"
              option-value="unit"
              :placeholder="$t('view.select_measurement_unit')"
            />
          </template>
        </ren-input-wrapper>
        <ren-input-wrapper :text-label="'model.measurement.direction'">
          <template #content>
            <Dropdown
              id="measurementDirection"
              v-model="mModel.direction"
              show-clear
              :options="directions"
              :option-label="(opt) => $t('enums.measurement_direction.' + opt)"
              :placeholder="$t('view.select_direction')"
            />
          </template>
        </ren-input-wrapper>
        <ren-input
          v-model="mModel.sensor_name"
          :text-label="'model.measurement.sensor_name'"
          :invalid="v$.mModel.sensor_name.$invalid"
          :errors="v$.mModel.sensor_name.$silentErrors"
        />
        <ren-input-wrapper :text-label="'model.measurement.asset'">
          <template #content>
            <span v-if="assetLabel">
              <span @click="selectAsset">{{ assetLabel }}</span>
              <i class="pi pi-times" style="font-size: 1rem; color: rgba(250, 30, 30, 0.9)" @click="revokeAsset" />
            </span>
            <span v-else @click="selectAsset">{{ $t("view.select_asset") }}</span>
          </template>
        </ren-input-wrapper>
      </div>
    </template>
  </Card>
  <ren-submit :cancel-button="true" :disabled="v$.$invalid" @cancel="cancel" @submit="submit" />

  <!-- <Button :label="$t('view.button.submit')" @click="submit" />
  <Button :label="$t('view.button.cancel')" @click="cancel" /> -->
  <AssetSelectDialog ref="assetSelectDialog" :current="mModel.asset" @submit="onAssetSelect" />
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import InfoIcon from "../../../miscellaneous/InfoIcon.vue";
import AssetSelectDialog from "@/components/management/infrastructure/AssetSelectDialog.vue";

import { required, minLength, maxLength } from "@/plugins/validators.js"; //,requiredTr, maxLengthTr
import { MeasurementDomains, MeasurementDirection } from "@/plugins/model/Enums.js";

export default {
  name: "MeasurementForm",
  components: { InfoIcon, AssetSelectDialog },
  props: {
    modelValue: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["update:modelValue", "cancel", "update"],
  setup: () => ({ v$: useVuelidate() }),
  validationConfig: {
    $lazy: true,
  },
  data() {
    var m = null;
    var mUnits = null;
    if (this.modelValue != null) {
      m = this.modelValue;

      m.physical_type = this.modelValue.type != null ? this.modelValue.type.physical_name : null;
      m.unit = this.modelValue.type != null ? this.modelValue.type.unit : null;
      mUnits = this.$store.getters["view/measurementTypes"][m.physical_type];
      m.label = this.modelValue._label && this.modelValue._label != this.modelValue.name ? this.modelValue._label : this.modelValue.label;
    }

    return {
      domains: MeasurementDomains.keys(),
      mModel: m,
      directions: MeasurementDirection.keys(),
      mUnits: mUnits,
      physicalTypes: Object.keys(this.$store.getters["view/measurementTypes"]),
      editDialog: false,
      addDialog: false,
      measurementTypes: this.$store.getters["view/measurementTypes"],
    };
  },
  computed: {
    assetLabel: function () {
      if (this.mModel != null && this.mModel.asset != null) return this.mModel.asset.label ? this.mModel.asset.label : this.mModel.asset.name;
      return null;
    },
  },
  watch: {},
  validations() {
    return {
      mModel: {
        // grafana_id: {
        //   required: requiredTr("model.dashboard."),
        //   maxLength: maxLengthTr("model.dashboard.", null)(30),
        // },
        name: {
          required,
          minLength: minLength(2),
          maxLength: maxLength(100),
        },
        domain: { required },
        // type: { required },
        physical_type: { required },
        unit: { required },
        // direction: { required },
        sensor_name: { required },
        // url: {
        //   required,
        //   url,
        //   // uri: or(url, ipAddress),
        // },
        label: { minLength: minLength(3), maxLength: maxLength(100) },
      },
    };
  },
  methods: {
    typeChange(evt) {
      let v;
      try {
        v = evt.value.toLowerCase();
      } catch (Exception) {
        v = null;
      }
      this.mUnits = this.measurementTypes[v];
    },
    selectAsset() {
      this.$refs.assetSelectDialog.open();
    },

    onAssetSelect(selectedAsset) {
      this.mModel.asset = selectedAsset;
    },
    revokeAsset() {
      this.mModel.asset = null;
    },

    submit() {
      this.mModel.type = {
        id: this.mUnits.find((it) => it.unit == this.mModel.unit).id,
        unit: this.mModel.unit,
        physical_name: this.mModel.physical_type,
      };

      this.$emit("update:modelValue", this.mModel);
      this.$emit("update", this.mModel);
    },
    cancel() {
      this.$emit("update:modelValue", this.modelValue);
      this.$emit("cancel", this.mModel);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
