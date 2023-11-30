<template>
  <div class="field grid">
    <label for="ren-input" class="col-12 mb-2 md:col-2 md:mb-0 ren-label">
      <div v-if="$te(textLabel)">
        {{ $t(textLabel) }}
      </div>
      <div v-else>{{ textLabel }}</div>
      <InfoIcon v-if="textInfo" :show-icon="true">
        <template #content>
          <div v-if="$te(textInfo)">
            {{ $t(textInfo) }}
          </div>
          <div v-else>{{ textInfo }}</div>
        </template>
      </InfoIcon>
      <!-- {{ $t(textLabel) }}  -->
    </label>
    <div class="col-12 md:col-10"><InputText id="ren-input" v-model="mValue" :disabled="disabled" /></div>
    <span v-if="invalid">
      <span v-for="(error, index) of errors" id="name-error" :key="index">
        <small class="p-error">{{ error.$message }}</small>
      </span>
    </span>
  </div>
</template>

<script>
import InfoIcon from "@/components/miscellaneous/InfoIcon.vue";
export default {
  name: "RenInput",
  components: { InfoIcon },
  props: {
    invalid: { type: Boolean, default: false },
    //vuelidate errors
    errors: { type: Object, default: () => {} },
    textLabel: { type: String, default: null },
    textInfo: { type: String, default: null },
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
