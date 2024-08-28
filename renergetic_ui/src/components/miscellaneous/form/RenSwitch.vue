<template>
  <div class="field grid">
    <label v-if="textLabel" :for="mId" class="col-12 mb-2 md:col-2 md:mb-0 ren-label"> {{ $t(textLabel) }} </label>
    <div class="col-12 md:col-10 ren-inputwrapper">
      <SelectButton :id="mId" v-model="mValue" :disabled="disabled" option-label="label" option-value="value" :options="mOptions" />
    </div>
    <span v-if="invalid">
      <span v-for="(error, index) of errors" :key="index">
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
    options: {
      type: Array,
      default: null,
    },
    modelValue: { type: [String, Object, Number, Boolean], default: null },
    disabled: { type: Boolean, default: false },
  },
  emits: ["update:modelValue"],
  data() {
    let mOptions = this.options;
    if (mOptions == null) {
      mOptions = [
        { label: this.$t("view.button.yes"), value: true },
        { label: this.$t("view.button.no"), value: false },
      ];
    }
    return { mValue: this.modelValue, mOptions: mOptions };
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
