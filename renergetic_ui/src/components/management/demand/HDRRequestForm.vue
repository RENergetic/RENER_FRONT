<template>
  <InfoIcon :show-icon="false">
    <template #content>
      <!-- some info -->
    </template>
  </InfoIcon>

  <Card v-if="mModel">
    <!-- <template #title> </template> -->
    <template #content>
      <!-- {{ mModel }} -->
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
            <Calendar
              v-model="mModel.date_from"
              :disabled="disabled"
              :min-date="minDate"
              :max-date="maxDate"
              :show-time="true"
              hour-format="24"
              step-minute="60"
            />
          </template>
        </ren-input-wrapper>
        <ren-input-wrapper
          :text-label="'model.hdrrequest.interval_length'"
          :invalid="v$.mModel.interval_length.$invalid"
          :errors="v$.mModel.interval_length.$silentErrors"
        >
          <template #content>
            <Slider v-model="mModel.interval_length" :disabled="disabled" class="settings-slider" :max="60 * 24" :step="60" :min="60" />
            <span>{{ mModel.interval_length }}[min] ({{ mModel.interval_length / 60 }}[h])</span>
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
              :disabled="disabled"
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
              :disabled="disabled"
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
          :disabled="disabled"
          :text-label="'model.hdrrequest.change_or_limit'"
          :options="[
            { label: $t('model.hdrrequest.max_value'), value: true },
            { label: $t('model.hdrrequest.delta_value'), value: false },
          ]"
        />
        <!-- {{ mModel.priority }} -->
        <ren-input-number
          v-if="mModel.physical_type"
          v-model="mModel.requestValue"
          :invalid="v$.mModel.requestValue.$invalid"
          :errors="v$.mModel.requestValue.$silentErrors"
          :disabled="disabled"
          :text-label="mModel.isLimit ? 'model.hdrrequest.max_value' : 'model.hdrrequest.delta_value'"
          :placeholder="mModel.isLimit ? $t('model.hdrrequest.max_value') : $t('model.hdrrequest.delta_value')"
        />
        <!-- <ren-input-wrapper
          v-if="mModel.physical_type"
          :text-label="mModel.isLimit ? 'model.hdrrequest.max_value' : 'model.hdrrequest.delta_value'"
          :invalid="v$.mModel.requestValue.$invalid"
          :errors="v$.mModel.requestValue.$silentErrors"
        >
          <template #content> 
            <InputNumber v-if="mModel.isLimit" v-model="mModel.requestValue" :disabled="disabled" :placeholder="$t('model.hdrrequest.max_value')" />
            <InputNumber
              v-else
              v-model="mModel.requestValue"
              :disabled="disabled"
              :use-grouping="false"
              :placeholder="$t('model.hdrrequest.delta_value')"
            /> 
          </template>
        </ren-input-wrapper> -->
      </div>
    </template>
  </Card>
  <ren-submit v-if="!disabled" :cancel-button="true" :disabled="v$.$invalid" @cancel="cancel" @submit="submit" />

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
    disabled: {
      type: Boolean,
      default: false,
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
      m.interval_length = m.date_from && m.date_to ? (m.date_to - m.date_from) / 60000 : 60;
      m.isLimit = m.max_value ? true : false;
      m.requestValue = m.max_value ? m.max_value : m.value_change;
      m.date_from = m.date_from ? new Date(m.date_from) : null;
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
      minDate: new Date(this.getRoundHour() + 3 * 3600000),
      maxDate: new Date(this.getRoundHour() + 7 * 24 * 3600000),
    };
  },
  computed: {
    assetLabel: function () {
      if (this.mModel != null && this.mModel.asset != null) return this.mModel.asset.label ? this.mModel.asset.label : this.mModel.asset.name;
      return null;
    },
  },
  watch: {},
  updated() {
    this.minDate = new Date(this.getRoundHour() + 3600000);
  },
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
    getRoundHour() {
      return Math.round(new Date().getTime() / 3600000) * 3600000;
    },
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
      let mModel = { ...this.mModel };
      mModel.value_type = {
        id: this.mUnits.find((it) => it.unit == this.mModel.unit).id,
        unit: this.mModel.unit,
        physical_name: this.mModel.physical_type,
      };
      mModel.date_from = new Date(this.mModel.date_from).getTime();
      mModel.date_to = mModel.date_from + this.mModel.interval_length * 60 * 1000;

      if (mModel.isLimit) {
        mModel.max_value = this.mModel.requestValue;
      } else {
        mModel.value_change = this.mModel.requestValue;
      }
      this.$emit("update:modelValue", mModel);
      this.$emit("update", mModel);
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
