<template>
  <div v-if="inline" class="field grid">
    <div v-if="!editMode" class="flex">
      <label :for="mId" class="flex flex-1">
        {{ modelValue }}
      </label>
      <div class="flex flex-0" style="margin: auto; margin-left: 0.25rem">
        <i v-tooltip="$t('view.edit')" class="pi pi-pencil" @click="editMode = true" />
      </div>
    </div>
    <div v-else class="flex">
      <div class="flex flex-1">
        <slot :id="mId" name="content" />
        <span v-if="invalid">
          <span v-for="(error, index) of errors" :key="index">
            <small class="p-error">{{ error.$message }}</small>
          </span>
        </span>
      </div>
      <div class="flex flex-0" style="margin: auto; margin-left: 0.25rem">
        <i v-tooltip="$t('view.submit')" class="pi pi-check" @click="submit" />
      </div>
    </div>
  </div>
  <div v-else class="field grid">
    <label v-if="textLabel" :for="mId" class="col-12 mb-2 md:col-2 md:mb-0 ren-label">
      <div v-if="$te(textLabel)">
        {{ $t(textLabel) }}
      </div>
      <div v-else>{{ textLabel }}</div>
    </label>
    <div v-if="!textLabel" class="col-12 ren-inputwrapper" :style="wrapperStyle">
      <slot :id="mId" name="content" />
    </div>
    <div v-else class="col-12 md:col-10 ren-inputwrapper" :style="wrapperStyle">
      <slot :id="mId" name="content" />
    </div>
    <span v-if="invalid">
      <span v-for="(error, index) of errors" :key="index">
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
    inline: { type: Boolean, default: false },
    invalid: { type: Boolean, default: false },
    // //vuelidate errors
    errors: { type: Object, default: () => {} },
    textLabel: { type: String, default: null },
    wrapperStyle: { type: String, default: "" },
    modelValue: { type: [String, Number, Object], default: null },
    // disabled: { type: Boolean, default: false },
  },
  emits: ["update:modelValue", "submit"],
  data() {
    return { editMode: false };
  },
  methods: {
    submit() {
      this.$emit("submit", this.mValue);
      this.editMode = false;
    },
  },
};
</script>
<style></style>
