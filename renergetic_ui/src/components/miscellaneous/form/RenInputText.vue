<template>
  <div class="field grid">
    <label for="ren-input-text" class="col-12 mb-2 md:col-2 md:mb-0"> {{ $t(textLabel) }} </label>
    <div class="col-12 md:col-10">
      <Textarea id="ren-input-text" v-model="mValue" :maxlength="maxlength" :disabled="disabled" auto-resize rows="5" cols="30"></Textarea>
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
  name: "RenInput",
  props: {
    invalid: { type: Boolean, default: false },
    //vuelidate errors
    errors: { type: Object, default: () => {} },
    textLabel: { type: String, default: null },
    modelValue: { type: Object, default: null },
    disabled: { type: Boolean, default: false },
    maxlength: { type: Number, default: 250 },
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
