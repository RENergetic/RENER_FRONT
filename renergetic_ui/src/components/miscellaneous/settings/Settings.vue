<template>
  <div class="p-fluid formgrid grid">
    <!-- {{ mModel }} -->
    <div v-for="s in schema" :key="s" :class="getClass(s)">
      <label v-if="s.type != 'Submit' && s.description" v-tooltip.top="{ value: s.description, class: '' }" :for="s.key" class="col-12">
        {{ s.label }}
      </label>
      <label v-else-if="s.type != 'Submit'" :for="s.key" class="col-12">{{ s.label }}</label>

      <!-- <ToggleButton
        v-model="mModel['key']"
        :on-label="s.label.true"
        :off-label="s.label.false"
        on-icon="pi pi-check"
        off-icon="pi pi-times"
      /> -->
      <div class="col-12">
        <!-- {{ s.ext.mode }} -->
        <SelectButton
          v-if="s.type == Boolean"
          :id="s.key"
          v-model="mModel[s.key]"
          v-tooltip="s.description"
          option-label="name"
          option-value="value"
          :options="[
            { name: s.ext.true, value: true },
            { name: s.ext.false, value: false },
          ]"
        />
        <div v-else-if="s.type == Number && s.mode == 'slider'">
          <Slider v-model="mModel[s.key]" v-tooltip="s.description" :max="s.ext && s.ext.max ? s.ext.max : 24" />
          <span>{{ mModel[s.key] }} {{ s.ext ? s.ext.unit : "" }}</span>
        </div>
        <InputNumber
          v-else-if="s.type == Number"
          :id="s.key"
          v-model="mModel[s.key]"
          v-tooltip="s.description"
          :min-fraction-digits="0"
          :max-fraction-digits="5"
          :mode="s.ext.mode"
          :use-grouping="false"
        />

        <div v-else-if="s.type == 'list'">
          <ListBox
            :id="s.key"
            v-model="mModel[s.key]"
            v-tooltip="s.description"
            :options="s.ext.options"
            :option-value="s.ext.optionValue"
            :option-label="s.ext.optionLabel"
          />
        </div>

        <div v-else-if="s.type == Array">
          <SelectButton
            :id="s.key"
            v-model="mModel[s.key]"
            v-tooltip="s.description"
            :options="s.ext.options"
            :option-value="s.ext.optionValue"
            :option-label="s.ext.optionLabel"
          />
        </div>
        <div v-else-if="s.type == 'Color'">
          <ColorPicker v-model="mModel[s.key]" v-tooltip="s.description" />
        </div>

        <div v-else-if="s.type == 'Submit'">
          <Button :id="s.key" v-tooltip="s.description" :label="s.label" @click="s.ext.click" />
        </div>
        <InputText v-else :id="s.key" v-model="mModel[s.key]" v-tooltip="s.description" />
      </div>
    </div>
  </div>
</template>

<script>
import SelectButton from "primevue/selectbutton";
import Slider from "primevue/slider";
import InputNumber from "primevue/inputnumber";
import ListBox from "primevue/listbox";
import ColorPicker from "primevue/colorpicker";
export default {
  name: "Settings",
  components: {
    Slider,
    SelectButton,
    InputNumber,
    ListBox,
    ColorPicker,
    // ToggleButton
  },
  props: {
    columns: { type: Number, default: 12 },
    settings: {
      type: Object,
      default: () => ({}),
    },
    schema: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["update:settings"],
  data() {
    return { mModel: this.settings };
  },
  watch: {
    mModel: {
      handler: function (newVal) {
        // console.debug(newVal);
        console.info("settings change");
        this.$emit("update:settings", newVal);
      },
      deep: true,
    },
  },

  async created() {},
  methods: {
    getClass(setting) {
      let columns; //= setting.col ? setting.col : this.col;
      switch (setting.type) {
        case Array:
          columns = Math.min(12, Math.round(1.5 * (setting.col ? setting.col : this.columns)));
          break;
        default:
          columns = setting.col ? setting.col : this.columns;
          break;
      }
      console.info(columns);
      // s.type == Number && s.mode == 'slider'
      return `field grid col-${columns}`;
    },
    toggle(event) {
      this.$refs.menu.toggle(event);
    },
  },
};
</script>

<style lang="scss">
.p-buttonset {
  flex-wrap: wrap;
  flex-direction: row;
  .p-button {
    flex: initial !important;
    max-width: 20rem;
  }
}
.p-fluid {
  .p-buttonset {
    .p-button {
      width: auto !important;
    }
  }
}
</style>
