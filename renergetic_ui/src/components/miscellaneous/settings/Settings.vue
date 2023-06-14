<template>
  <div class="p-fluid formgrid grid">
    <!-- {{ mModel }} -->
    <div v-for="s in schema" :key="s" :class="getClass(s)">
      <label
        v-if="labels && s.type != 'Submit' && s.description && s.type != 'Header'"
        v-tooltip.top="{ value: s.description, class: '' }"
        :for="s.key"
        class="col-12"
      >
        {{ s.label }}
      </label>
      <label v-else-if="labels && s.type != 'Submit' && s.type != 'Header'" :for="s.key" class="col-12">{{ s.label }}</label>

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
          <Slider v-model="mModel[s.key]" v-tooltip="s.description" class="settings-slider" :max="s.ext && s.ext.max ? s.ext.max : 24" />
          <span>{{ s.ext && s.ext.valueTemplate ? s.ext.valueTemplate(mModel[s.key]) : mModel[s.key] }} {{ s.ext ? s.ext.unit : "" }}</span>
        </div>
        <InputNumber
          v-else-if="s.type == Number"
          :id="s.key"
          v-model="mModel[s.key]"
          v-tooltip="s.description"
          :min-fraction-digits="0"
          :max-fraction-digits="5"
          :mode="s.ext && s.ext.mode ? s.ext.mode : 'decimal'"
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
        <div v-else-if="s.type == 'Datetime'">
          <Calendar :id="s.key" v-model="mModel[s.key]" v-tooltip="s.description" show-time hour-format="24" />
        </div>

        <div v-else-if="s.type == 'Submit'">
          <Button :id="s.key" v-tooltip="s.description" :label="s.label" @click="s.ext.click" />
        </div>
        <div v-else-if="s.type == 'Header'">
          <h2 :id="s.key" v-tooltip="s.description">{{ s.label }}</h2>
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
import Calendar from "primevue/calendar";
export default {
  name: "Settings",
  components: {
    Slider,
    SelectButton,
    InputNumber,
    ListBox,
    ColorPicker,
    Calendar,
    // ToggleButton
  },
  props: {
    labels: { type: Boolean, default: true },
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
    let mModel = this.settings;
    for (let s of this.schema) {
      if ((mModel[s.key] == null || mModel[s.key] === undefined) && s.defaultValue != null && s.defaultValue !== undefined) {
        mModel[s.key] = s.defaultValue;
      }
    }

    return { mModel: mModel };
  },
  watch: {
    mModel: {
      handler: function (newVal) {
        console.debug(newVal);
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
      // console.info(columns);
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
.settings-slider {
  margin-bottom: 0.35rem;
}
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
