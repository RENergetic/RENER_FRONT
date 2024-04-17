<template>
  <div class="p-fluid formgrid grid">
    <div v-for="s in schema" :key="s" :class="getClass(s)">
      <label
        v-if="labels && lowerCase(s.type) != 'submit' && s.description && lowerCase(s.type) != 'header'"
        v-tooltip.top="{ value: s.description, class: '' }"
        :for="s.key"
        class="col-12"
      >
        {{ s.label }}
      </label>
      <label v-else-if="labels && lowerCase(s.type) != 'submit' && lowerCase(s.type) != 'header'" :for="s.key" class="col-12">{{ s.label }}</label>

      <!-- <ToggleButton
        v-model="mModel['key']"
        :on-label="s.label.true"
        :off-label="s.label.false"
        on-icon="pi pi-check"
        off-icon="pi pi-times"
      /> -->
      <div class="col-12">
        <SelectButton
          v-if="s.type == Boolean || lowerCase(s.type) == 'boolean'"
          :id="s.key"
          v-model="mModel[s.key]"
          v-tooltip="s.description"
          :disabled="disabled"
          option-label="name"
          option-value="value"
          :options="[
            { name: s.ext.true, value: true },
            { name: s.ext.false, value: false },
          ]"
        />
        <div v-else-if="s.type == Number && lowerCase(s.mode) == 'slider'">
          <Slider
            v-model="mModel[s.key]"
            v-tooltip="s.description"
            :disabled="disabled"
            class="settings-slider"
            :max="s.ext && s.ext.max ? s.ext.max : 24"
          />
          <span>{{ s.ext && s.ext.valueTemplate ? s.ext.valueTemplate(mModel[s.key]) : mModel[s.key] }} {{ s.ext ? s.ext.unit : "" }}</span>
        </div>
        <InputNumber
          v-else-if="s.type == Number || lowerCase(s.type) == 'number'"
          :id="s.key"
          v-model="mModel[s.key]"
          v-tooltip="s.description"
          :placeholder="`${s.placeholder ? s.placeholder : $t('settings.number_placeholder')}`"
          :disabled="disabled"
          :min-fraction-digits="0"
          :max-fraction-digits="5"
          :mode="s.ext && s.ext.mode ? s.ext.mode : 'decimal'"
          :use-grouping="false"
        />

        <div v-else-if="lowerCase(s.type) == 'list'">
          <ListBox
            :id="s.key"
            v-model="mModel[s.key]"
            v-tooltip="s.description"
            :disabled="disabled"
            :placeholder="s.placeholder"
            :options="s.ext.options"
            :option-value="s.ext.optionValue"
            :option-label="s.ext.optionLabel"
          />
        </div>

        <div v-else-if="s.type == Array || lowerCase(s.type) == 'array'">
          <SelectButton
            :id="s.key"
            v-model="mModel[s.key]"
            v-tooltip="s.description"
            :disabled="disabled"
            :options="s.ext.options"
            :option-value="s.ext.optionValue"
            :option-label="s.ext.optionLabel"
          />
        </div>
        <div v-else-if="lowerCase(s.type) == 'color'" class="grid">
          <div class="col-12 xl:col-3">
            <ColorPicker :id="s.key + '_color'" v-model="mModel[s.key]" v-tooltip="s.description" :disabled="disabled" @change="colorChange(s.key)" />
          </div>
          <div class="col-12 xl:col-6">
            <InputText
              :id="s.key"
              v-model="mModel[s.key]"
              v-tooltip="s.description"
              :placeholder="s.placeholder"
              :disabled="disabled"
              @change="colorChange(s.key)"
            />
          </div>
        </div>
        <div v-else-if="lowerCase(s.type) == 'datetime'">
          <!-- <Calendar :id="s.key" v-model="mModel[s.key]" v-tooltip="s.description" :disabled="disabled" :show-time="true" hour-format="24" /> -->
          <UnixCalendar :id="s.key" v-model="mModel[s.key]" :description="s.description" :disabled="disabled" />
        </div>

        <div v-else-if="lowerCase(s.type) == 'submit'">
          <Button v-if="!disabled" :id="s.key" v-tooltip="s.description" :label="s.label" @click="s.ext.click" />
        </div>
        <div v-else-if="lowerCase(s.type) == 'header'">
          <h2 :id="s.key" v-tooltip="s.description">{{ s.label }}</h2>
        </div>
        <InputText v-else :id="s.key" v-model="mModel[s.key]" v-tooltip="s.description" :placeholder="s.placeholder" :disabled="disabled" />
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
// import Calendar from "primevue/calendar";
import UnixCalendar from "./UnixCalendar.vue";
export default {
  name: "Settings",
  components: {
    Slider,
    UnixCalendar,
    SelectButton,
    InputNumber,
    ListBox,
    ColorPicker,
    // Calendar,
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
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:settings"],
  data() {
    let mModel = this.settings;
    // console.info(Object.keys(this.schema).length);
    if (Object.keys(this.schema).length > 0)
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
        console.debug("settings change");
        this.$emit("update:settings", newVal);
      },
      deep: true,
    },
  },

  async created() {},
  methods: {
    lowerCase(s) {
      if (s) {
        return (s + "").toLowerCase();
      } else return null;
    },
    colorChange(k) {
      // console.info(this.mModel[k]);
      if (this.mModel[k] && this.mModel[k].length == 6) this.mModel[k] = "#" + this.mModel[k];
    },
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
.p-colorpicker {
  width: 100%;
  min-height: 3rem;
  min-width: 5rem;
  padding: 0;
  input {
    height: 100%;
    margin: 0;
    padding: 0;
    position: absolute;
  }
}
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
