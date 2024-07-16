<template>
  <div v-if="useAlpha" style="flex-grow: 1; width: 100%; flex-direction: column">
    <ColorPicker :id="'_color'" v-model="mColor" :disabled="disabled" :class="colorPickerClass" @update:model-value="colorChange" />
  </div>
  <div v-else style="flex-grow: 0.5">
    <!-- <ColorPicker :id="'_color'" v-model="mColor" :disabled="disabled" @update:model-value="colorChange" /> -->
    <ColorPicker :id="'_color'" v-model="mColor" :disabled="disabled" :class="colorPickerClass" @update:model-value="colorChange" />
  </div>
  <div v-if="useAlpha" class="flex flex-row" style="flex-grow: 1">
    <InputText :id="color" :key="mValue" v-model="mValue" style="height: 100%" :disabled="disabled" @update:model-value="colorInputChange" />
    <InputNumber
      v-if="useAlpha"
      :id="'_alpha'"
      :model-value="mAlpha"
      style="width: 10rem; margin-left: 0.5rem; height: 100%"
      :max="1.0"
      :min="0.0"
      show-buttons
      :step="0.01"
      :disabled="disabled"
      @update:model-value="alphaChange"
    />
    <i class="pi pi-times" style="font-size: 1.5rem; align-items: center; display: flex" @click="clear"></i>
  </div>
  <div v-else style="flex-grow: 0.5; display: flex">
    <InputText :id="color" :key="mValue" v-model="mValue" style="height: 100%" :disabled="disabled" @update:model-value="colorInputChange" />
    <i class="pi pi-times" style="font-size: 1.5rem; align-items: center; display: flex" @click="clear"></i>
  </div>
</template>

<script>
//TODO: placeholder
import ColorPicker from "primevue/colorpicker";
export default {
  name: "RenColorPicker",
  components: {
    ColorPicker,
  },
  props: {
    modelValue: { type: Object, default: null },
    useAlpha: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    placeholder: { type: String, default: null },
  },
  emits: ["update:modelValue", "change"],
  data() {
    let c;
    let mAlpha = 1.0;
    if (this.modelValue && this.modelValue.length > 7) {
      c = this.modelValue.substring(0, 7);
      let alphaHex = this.modelValue.substring(7, Math.min(9, this.modelValue.length));
      mAlpha = parseInt(alphaHex, 16) / 255.0;
    } else {
      c = this.modelValue;
    }
    return { mValue: this.modelValue, mColor: c ? c : "#ffffff", hexAlpha: "FF", mAlpha: mAlpha };
  },
  computed: {
    colorPickerClass: function () {
      return this.mValue ? "" : "disabled";
    },
  },
  watch: {
    mValue: {
      handler() {
        this.$emit("update:modelValue", this.mValue);
        this.$emit("change", this.mValue);
      },
      // immediate: true,
    },
  },
  methods: {
    clear() {
      this.mValue = null;
      this.hexAlpha = "FF";
      this.mAlpha = 1.0;
      this.mColor = "#ffffff";
    },
    _componentToHex(c) {
      var hex = (Math.round(c * 255) % 256).toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    },
    colorInputChange(v) {
      if (v && v[0] != "#") v = "#" + v;
      if (v.length > 9) {
        v = v.substring(0, 9);
      }

      if (v && v.length > 7) {
        this.mColor = v.substring(0, 7);
        let alphaHex = v.substring(7, v.length);
        this.mAlpha = parseInt(alphaHex, 16) / 255.0;
      } else {
        this.mColor = v;
      }
      this.mValue = v;
    },
    colorChange(v) {
      if (v && v[0] != "#") this.mColor = "#" + v;
      if (v && v.length > 7) this.mColor = v;
      else {
        this.mValue = this.mColor + this.hexAlpha;
      }
    },
    alphaChange(v) {
      if (this.mAlpha == v) {
        return;
      }
      this.mAlpha = v;
      if (v != null && v !== undefined) {
        this.hexAlpha = this._componentToHex(v);
        this.mValue = this.mColor + this.hexAlpha;
      } else {
        this.hexAlpha = this._componentToHex(1.0);
        this.mValue = this.mColor + this.hexAlpha;
      }
    },
  },
};
</script>
