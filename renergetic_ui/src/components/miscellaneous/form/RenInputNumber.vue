<template>
  <div class="field grid">
    <label v-if="textLabel != null" for="ren-input-number" class="col-12 mb-2 md:col-2 md:mb-0 ren-label"> {{ $t(textLabel) }} </label>
    <div class="col-12 md:col-10">
      <!-- :mode="inputMode" -->
      <InputNumber id="ren-input-number" v-model="mValue" :use-grouping="false" :show-buttons="showButtons" :min="min" :max="max" />
    </div>

    <span v-if="invalid">
      <span v-for="(error, index) of errors" id="name-error" :key="index">
        <small class="p-error">{{ error.$message }}</small>
      </span>
    </span>
  </div>
</template>

<script>
export default {
  name: "RenInputNumber",
  props: {
    invalid: { type: Boolean, default: false },
    //vuelidate errors
    errors: { type: Object, default: () => {} },
    textLabel: { type: String, default: null },
    modelValue: { type: [Number, String], default: null },
    disabled: { type: Boolean, default: false },
    min: { type: Number, default: null },
    max: { type: Number, default: null },
    onlyInteger: { type: Boolean, default: false },
    defaultValue: { type: Number, default: null },
    // mode="decimal"
  },
  emits: ["update:modelValue"],
  data() {
    return { mValue: this.modelValue };
  },
  computed: {
    // inputMode() {
    //   if (this.onlyInteger) {
    //     return "decimal";
    //   }
    //   else{
    //     return "decimal";
    //   }
    // },

    showButtons() {
      if (this.min != null && this.max != null) {
        return true;
      }
      return false;
    },
  },
  watch: {
    mValue: {
      handler() {
        this.$emit("update:modelValue", this.mValue);
      },
      // immediate: true,
    },
  },
  mounted() {
    if (this.mValue == null && this.defaultValue != null) {
      this.mValue = this.defaultValue;
    }
  },
};
</script>
<style></style>
