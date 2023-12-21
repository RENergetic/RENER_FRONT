<template>
  <div v-if="inline" class="field grid">
    <div v-if="!editMode" class="flex">
      <label class="flex flex-1">
        {{ mValue }}
        <InfoIcon v-if="textInfo" :show-icon="true">
          <template #content>
            <div v-if="$te(textInfo)">
              {{ $t(textInfo) }}
            </div>
            <div v-else>{{ textInfo }}</div>
          </template>
        </InfoIcon>
      </label>
      <div class="flex flex-0" style="margin: auto; margin-left: 0.25rem">
        <i v-tooltip="$t('view.edit')" class="pi pi-pencil" @click="editMode = true" />
      </div>
    </div>
    <div v-else class="flex">
      <div class="flex flex-1">
        <InputText id="ren-input" v-model="mValue" :disabled="disabled" />
        <span v-if="invalid">
          <span v-for="(error, index) of errors" id="name-error" :key="index">
            <small class="p-error">{{ error.$message }}</small>
          </span>
        </span>
      </div>
      <div class="flex flex-0" style="margin: auto; margin-left: 0.25rem">
        <i v-tooltip="$t('view.submit')" class="pi pi-check" @click="submit" />
        <i v-tooltip="$t('view.cancel')" class="pi pi-times" @click="cancel" />
      </div>
    </div>
  </div>
  <div v-else class="field grid">
    <label v-if="textLabel != null" for="ren-input" class="col-12 mb-2 md:col-2 md:mb-0 ren-label">
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
    <div v-if="textLabel != null" class="col-12 md:col-10"><InputText id="ren-input" v-model="mValue" :disabled="disabled" /></div>
    <div v-else class="col-12"><InputText id="ren-input" v-model="mValue" :disabled="disabled" /></div>
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
    inline: { type: Boolean, default: false },
    invalid: { type: Boolean, default: false },
    //vuelidate errors
    errors: { type: Object, default: () => {} },
    textLabel: { type: String, default: null },
    textInfo: { type: String, default: null },
    modelValue: { type: Object, default: null },
    disabled: { type: Boolean, default: false },
  },
  emits: ["update:modelValue", "submit"],
  data() {
    return { mValue: this.modelValue, editMode: false };
  },
  watch: {
    mValue: {
      handler() {
        if (!this.inline) this.$emit("update:modelValue", this.mValue);
      },
      // immediate: true,
    },
  },

  methods: {
    cancel() {
      this.mValue = this.modelValue;
      this.editMode = false;
    },
    submit() {
      this.$emit("submit", this.mValue);
      this.editMode = false;
    },
  },
};
</script>
<style></style>
