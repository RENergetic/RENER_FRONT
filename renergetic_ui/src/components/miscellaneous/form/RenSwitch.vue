<template>
  <div class="field grid">
    <label v-if="textLabel" for="ren-input" class="col-12 mb-2 md:col-2 md:mb-0"> {{ $t(textLabel) }} </label>
    <div class="col-12 md:col-10">
      <SelectButton
        id="ren-input"
        v-model="mValue"
        :disabled="disabled"
        option-label="label"
        option-value="value"
        :options="[
          { label: $t('view.button.yes'), value: true },
          { label: $t('view.button.no'), value: false },
        ]"
      />
    </div>
    <span v-if="invalid">
      <span v-for="(error, index) of errors" id="name-error" :key="index">
        <small class="p-error">{{ error.$message }}</small>
      </span>
    </span>
  </div>
</template>

<script>
import SelectButton from "primevue/selectbutton";
export default {
  name: "RenSwitch",
  components: { SelectButton },
  props: {
    invalid: { type: Boolean, default: false },
    //vuelidate errors
    errors: { type: Object, default: () => {} },
    textLabel: { type: String, default: null },
    modelValue: { type: Object, default: null },
    disabled: { type: Boolean, default: false },
  },
  emits: ["update:modelValue"],
  data() {
    return { mValue: this.modelValue };
  },
  watch: {
    mValue: {
      handler() {
        this.$emit("update:modelValue", this.mValue);
      },
      // immediate: true,
    },
  },
};
</script>
<style></style>
