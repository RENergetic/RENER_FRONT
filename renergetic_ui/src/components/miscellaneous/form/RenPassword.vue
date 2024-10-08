<template>
  <div class="field grid">
    <label :for="mId" class="col-12 mb-2 md:col-2 md:mb-0 ren-label"> {{ $t(textLabel) }} </label>
    <div class="col-12 md:col-10"><Password :id="mId" v-model="mValue" :disabled="disabled" /></div>
    <span v-if="invalid">
      <span v-for="(error, index) of errors" :key="index">
        <small class="p-error">{{ error.$message }}</small>
      </span>
    </span>
  </div>
</template>

<script>
export default {
  name: "RenPassword",
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
