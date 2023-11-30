<template>
  <InfoIcon :show-icon="false">
    <template #content>
      <!-- some info -->
    </template>
  </InfoIcon>

  <Card v-if="mModel">
    <!-- <template #title> </template> -->
    <template #content>
      {{ mModel }}
      <div class="ren">
        <!-- <ren-input
          v-model="mModel.label"
          :text-label="'model.label.name'"
          :invalid="v$.mModel.label.$invalid"
          :errors="v$.mModel.label.$silentErrors"
        /> -->
        <ren-input-wrapper
          :text-label="'model.hdrrequest.date_from'"
          :invalid="v$.mModel.date_from.$invalid"
          :errors="v$.mModel.date_from.$silentErrors"
        >
          <template #content>
            <Calendar v-model="mModel.date_from" :show-time="true" hour-format="24" step-minute="60" />
          </template>
        </ren-input-wrapper>
        <ren-input-wrapper
          :text-label="'model.hdrrequest.interval_length'"
          :invalid="v$.mModel.interval_length.$invalid"
          :errors="v$.mModel.interval_length.$silentErrors"
        >
          <template #content>
            <Slider v-model="mModel.interval_length" class="settings-slider" :max="60 * 12" :step="30" :min="60" />
            <span>{{ mModel.interval_length }}</span>
          </template>
        </ren-input-wrapper>

        <ren-input-wrapper
          :text-label="'model.hdrrequest.physical_type'"
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
          :text-label="'model.hdrrequest.unit'"
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
              :placeholder="$t('model.hdrrequest.unit')"
            />
          </template>
        </ren-input-wrapper>
        <!-- //max or change -->
        <ren-switch
          v-model="mModel.isLimit"
          :text-label="'model.hdrrequest.change_or_limit'"
          :options="[
            { label: $t('model.hdrrequest.max_value'), value: true },
            { label: $t('model.hdrrequest.delta_value'), value: false },
          ]"
        />
        <ren-input-wrapper
          v-if="mModel.physical_type"
          :text-label="mModel.isLimit ? 'model.hdrrequest.max_value' : 'model.hdrrequest.delta_value'"
          :invalid="v$.mModel.requestValue.$invalid"
          :errors="v$.mModel.requestValue.$silentErrors"
        >
          <template #content>
            <!-- {{ mModel.unit }} -->
            <InputNumber v-if="mModel.isLimit" v-model="mModel.requestValue" :placeholder="$t('model.hdrrequest.max_value')" />
            <InputNumber v-else v-model="mModel.requestValue" :use-grouping="false" :placeholder="$t('model.hdrrequest.delta_value')" />
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
import InfoIcon from "@/components/miscellaneous/InfoIcon.vue";
import AssetSelectDialog from "@/components/management/infrastructure/AssetSelectDialog.vue";

import { required /*minValue, maxValue , minLength, maxLength */ } from "@/plugins/validators.js"; //,requiredTr, maxLengthTr
import { MeasurementDomains, MeasurementDirection } from "@/plugins/model/Enums.js";

export default {
  name: "HDRRequestForm",
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
      m.physical_type = m.value_type != null ? m.value_type.physical_name : null;
      m.unit = m.value_type != null ? m.value_type.unit : null;
      if (m.physical_type) mUnits = this.$store.getters["view/measurementTypes"][m.physical_type];
      m.interval_length = m.date_from && m.date_to ? m.date_from - m.date_to : 60;
      m.isLimit = m.max_value ? true : false;
      m.requestValue = m.max_value ? m.max_value : m.value_change;
    }
    //  date_from interval_length physical_type unit requestValue
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
        // label: {
        //   required,
        //   minLength: minLength(2),
        //   maxLength: maxLength(100),
        // },
        date_from: { required },
        interval_length: { required },
        physical_type: { required },
        unit: { required },
        requestValue: { required },
        //  date_from interval_length physical_type unit requestValue
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
    submit() {
      this.mModel.type = {
        id: this.mUnits.find((it) => it.unit == this.mModel.unit).id,
        unit: this.mModel.unit,
        physical_name: this.mModel.physical_type,
      };
      this.mModel = this.mModel.date_from + this.mModel.interval_length;
      if (this.mModel.isLimit) {
        this.mModel.max_value = this.mModel.requestValue;
      } else {
        this.mModel.value_change = this.mModel.requestValue;
      }
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
