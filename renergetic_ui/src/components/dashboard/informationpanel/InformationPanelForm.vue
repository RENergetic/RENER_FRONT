<template>
  <InfoIcon :show-icon="false"> <template #content> </template> </InfoIcon>
  <!-- {{ mModel }} -->
  <Card v-if="mModel">
    <template #content>
      <div class="ren">
        <!-- <div class="field grid"> -->
        <!-- <label for="panelLabel" class="col-fixed" style="width: 5rem">
            {{ $t("model.panel.label") }}
          </label>
          <div class="col">
            <InputText id="panelLabel" v-model="label" :aria-readonly="!edit" />
          </div>
        </div>
        <div class="field grid">
          <label for="panelName" class="col-fixed" style="width: 5rem">
            {{ $t("model.panel.name") }}
          </label>
          <div class="col">
            <InputText id="panelName" v-model="name" :aria-disabled="true" :aria-readonly="!edit" />
          </div>
        </div> -->
        <ren-input v-model="mModel.name" :text-label="'model.panel.name'" :invalid="v$.mModel.name.$invalid" :errors="v$.mModel.name.$silentErrors" />
        <ren-input
          v-model="mModel.label"
          :text-info="mModel.is_template ? $t('view.panel_label_info', ['{asset}']) : null"
          :text-label="'model.panel.label'"
          :invalid="v$.mModel.label.$invalid"
          :errors="v$.mModel.label.$silentErrors"
        />
        {{ labelWarning }}
      </div>
    </template>
  </Card>

  <ren-submit :cancel-button="true" :disabled="v$.$invalid" @cancel="cancel" @submit="submit" />
</template>

<script>
//TODO: on owner select
import { useVuelidate } from "@vuelidate/core";
import { maxLength, required, minLength } from "@/plugins/validators.js"; //required,
import InfoIcon from "../../miscellaneous/InfoIcon.vue";
const ASSET_TAG = "{asset}";
export default {
  name: "InformationPanelForm",
  components: { InfoIcon },
  props: {
    modelValue: {
      type: Object,
      default: () => ({ measurements: [] }),
    },
  },
  emits: ["update:modelValue", "cancel"],
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return {
      mModel: this.modelValue ? this.modelValue : { measurements: [] },
      labelWarning: null,
    };
  },
  validationConfig: {
    $lazy: true,
  },
  validations() {
    return {
      mModel: {
        name: { maxLength: maxLength(30), required: required, minLength: minLength(3) },
        label: { maxLength: maxLength(50), minLength: minLength(3) },
      },
    };
  },
  computed: {},
  watch: {
    "mModel.label": function (t) {
      this.labelWarning = null;
      if (this.mModel.is_template && t && !t.includes(ASSET_TAG)) {
        this.labelWarning = this.$t("view.panel_label_warning", [ASSET_TAG]);
        // this.mModel.label = this.mModel.label + " - ({asset})";
      }
      console.info(this.mModel);
      console.info(t);
    },
  },
  async mounted() {},
  methods: {
    submit() {
      if (this.mModel.label && !this.mModel.label.includes(ASSET_TAG) && this.mModel.is_template) {
        this.mModel.label = `${this.mModel.label} - (${ASSET_TAG})`;
      }
      this.$emit("update:modelValue", this.mModel);
    },
    cancel() {
      this.$emit("cancel", this.model);
    },
  },
};
</script>

<style scoped lang="scss"></style>
