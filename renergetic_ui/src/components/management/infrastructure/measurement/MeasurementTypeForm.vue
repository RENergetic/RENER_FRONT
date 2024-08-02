<template>
  <!-- <InfoIcon :show-icon="false">
    <template #content>
      
    </template>
  </InfoIcon> -->

  <Card v-if="mModel">
    <!-- <template #title> </template> -->
    <template #content>
      <div class="ren">
        <ren-input
          v-model="mModel.name"
          :text-info="'model.name_description'"
          :text-label="'model.measurement_type.name'"
          :invalid="v$.mModel.name.$invalid"
          :errors="v$.mModel.name.$silentErrors"
        />

        <ren-input
          v-model="mModel.label"
          :text-info="'model.label_description'"
          :text-label="'model.measurement_type.label'"
          :invalid="v$.mModel.label.$invalid"
          :errors="v$.mModel.label.$silentErrors"
        />
        <ren-input
          v-model="mModel.physical_name"
          :text-label="'model.measurement_type.physical_name'"
          :invalid="v$.mModel.physical_name.$invalid"
          :errors="v$.mModel.physical_name.$silentErrors"
        />
        <ren-input
          v-model="mModel.unit"
          :text-label="'model.measurement_type.unit'"
          :invalid="v$.mModel.unit.$invalid"
          :errors="v$.mModel.unit.$silentErrors"
        />
        <ren-input
          v-model="mModel.base_unit"
          :invalid="v$.mModel.base_unit.$invalid"
          :errors="v$.mModel.base_unit.$silentErrors"
          :text-label="'model.measurement_type.base_unit'"
        />

        <ren-input-number
          v-model="mModel.factor"
          :invalid="v$.mModel.factor.$invalid"
          :errors="v$.mModel.factor.$silentErrors"
          :text-label="'model.measurement_type.factor'"
        />

        <!-- Measurement default color,Description,    Grafana support.  -->
      </div>
    </template>
  </Card>
  <ren-submit :cancel-button="true" :disabled="v$.$invalid" @cancel="cancel" @submit="submit" />
</template>

<script>
import { useVuelidate } from "@vuelidate/core";

import { required, minLength, maxLength } from "@/plugins/validators.js"; //,requiredTr, maxLengthTr
import { MeasurementDomains, MeasurementDirection } from "@/plugins/model/Enums.js";

export default {
  name: "MeasurementTypeForm",
  components: {},
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
    return {
      domains: MeasurementDomains.keys(),
      mModel: {},
      directions: MeasurementDirection.keys(),
    };
  },
  computed: {},
  watch: {},
  validations() {
    return {
      mModel: {
        name: {
          required,
          minLength: minLength(2),
          maxLength: maxLength(100),
        },
        // type: { required },
        physical_name: { required },
        unit: { required },
        base_unit: { required },
        factor: { required },
        label: { minLength: minLength(3), maxLength: maxLength(100) },
      },
    };
  },
  methods: {
    submit() {
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
