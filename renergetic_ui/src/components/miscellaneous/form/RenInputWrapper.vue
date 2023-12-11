<template>
  <div class="field grid">
    <label v-if="textLabel" for="ren-input" class="col-12 mb-2 md:col-2 md:mb-0 ren-label">
      <div v-if="$te(textLabel)">
        {{ $t(textLabel) }}
      </div>
      <div v-else>{{ textLabel }}</div>
    </label>
    <div v-if="!textLabel" class="col-12 ren-inputwrapper" :style="wrapperStyle">
      <slot id="ren-input" name="content" />
    </div>
    <div v-else id="ren-input" class="col-12 md:col-10 ren-inputwrapper" :style="wrapperStyle">
      <slot name="content" />
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
  //ren-input-wrapper
  name: "RenInputWrapper",
  props: {
    invalid: { type: Boolean, default: false },
    // //vuelidate errors
    errors: { type: Object, default: () => {} },
    textLabel: { type: String, default: null },
    wrapperStyle: { type: String, default: "" },

    // modelValue: { type: Object, default: null },
    // disabled: { type: Boolean, default: false },
  },
  // emits: ["update:modelValue"],
  data() {
    // return { mValue: this.modelValue };
  },
  watch: {
    // mValue: {
    //   handler() {
    //     this.$emit("update:modelValue", this.mValue);
    //   },
    // },
  },
};
</script>
<style></style>
