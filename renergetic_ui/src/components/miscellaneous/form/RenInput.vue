<template>
  <div v-if="inline" class="field grid" style="border: red">
    <div v-if="!editMode" class="flex">
      <label class="flex flex-1" :for="mId">
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
        <InputText :id="mId" v-model="mValue" :disabled="disabled" :style="inputStyle" @update:model-value="onInput($event)" />
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
  <div v-else class="field grid" style="border: red">
    <label v-if="textLabel != null" :for="mId" class="col-12 mb-2 md:col-2 md:mb-0 ren-label">
      <span v-if="$te(textLabel)">
        {{ $t(textLabel) }}
      </span>
      <span v-else>{{ textLabel }}</span>

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

    <div v-if="textLabel != null && !readOnly" class="col-12 md:col-10">
      <InputText :id="mId" v-model="mValue" :disabled="disabled" :style="inputStyle" @update:model-value="onInput($event)" />

      <i v-if="showClear && !disabled" v-tooltip="$t('view.clear')" class="pi pi-times" @click="clearInput" />
    </div>
    <div v-else-if="!readOnly" class="col-12">
      <InputText :id="mId" v-model="mValue" :disabled="disabled" :style="inputStyle" @update:model-value="onInput($event)" />
      <i v-if="showClear && !disabled" v-tooltip="$t('view.clear')" class="pi pi-times" @click="clearInput" />
    </div>
    <div v-else-if="textLabel != null && readOnly" class="col-12 md:col-10">
      <InputText :id="mId" v-model="mValue" :disabled="disabled" :style="inputStyle" />
      <i v-if="showClear && !disabled" v-tooltip="$t('view.clear')" class="pi pi-times" @click="clearInput" />
    </div>
    <div v-else class="col-12">
      <InputText :id="mId" v-model="mValue" :disabled="disabled" :style="inputStyle" />
      <i v-if="showClear && !disabled" v-tooltip="$t('view.clear')" class="pi pi-times" @click="clearInput" />
    </div>
    <span v-if="invalid">
      <span v-for="(error, index) of errors" id="name-error" :key="index">
        <small class="p-error">{{ error.$message }}</small>
      </span>
    </span>
  </div>
</template>

<script>
// import InfoIcon from "@/components/miscellaneous/InfoIcon.vue";
export default {
  name: "RenInput",
  // components: { InfoIcon },
  props: {
    inline: { type: Boolean, default: false },
    invalid: { type: Boolean, default: false },
    //vuelidate errors
    errors: { type: Object, default: () => {} },
    textLabel: { type: String, default: null },
    textInfo: { type: String, default: null },
    modelValue: { type: [String, Number], default: null }, //Object,
    disabled: { type: Boolean, default: false },
    readOnly: { type: Boolean, default: false },
    showClear: { type: Boolean, default: false },
  },
  emits: ["update:modelValue", "submit"],
  data() {
    return {
      mValue: this.modelValue,
      editMode: false,
    };
  },
  computed: {
    inputStyle() {
      if (this.invalid && !this.errors) {
        return "border: solid rgba(255,30,30,0.85) 0.2rem";
      }
      return "";
    },
  },
  watch: {
    // mValue: {
    //   handler() {
    //     if (!this.inline) this.$emit("update:modelValue", this.mValue);
    //   },
    //   // immediate: true,
    // },
    modelValue: {
      handler(v) {
        this.mValue = v;
      },
    },
  },
  methods: {
    clearInput() {
      this.mValue = null;
      this.$emit("update:modelValue", null);
    },
    focus() {
      try {
        document.getElementById(this.mId).focus();
      } catch {
        console.warn(`Focus issue with ren-input ${this.mId}`);
      }
    },
    onInput(evt) {
      if (!this.inline) this.$emit("update:modelValue", evt);
    },
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
