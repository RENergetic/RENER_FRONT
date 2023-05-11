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
        <ren-input-wrapper v-if="modelValue" :text-label="null">
          <template #content>
            <!-- <span v-if="!selectedAsset">{{ $t("view.asset_not_selected") }}</span> -->
            <Button style="margin-left: 0.5rem" @click="importPanelDialog = true">{{ $t("view.upload_structure") }}</Button>
          </template>
        </ren-input-wrapper>
      </div>
    </template>
  </Card>
  <Dialog v-model:visible="importPanelDialog" :style="{ width: '50vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <Card>
      <template #header>
        {{ $t("view.choose_panel_file") }}
      </template>
      <template #content>
        <!-- with-credentials="true," -->
        <!-- :disabled="selectedModel == null" -->
        <ren-submit :cancel-button="true" @submit="fileSubmit" @cancel="onFileClear" />
        <FileUpload
          ref="FileUpload"
          name="template[]"
          :custom-upload="true"
          :multiple="false"
          :show-upload-button="false"
          :cancel-label="$t('view.button.clear')"
          :choose-label="$t('view.button.choose')"
          :auto="true"
          :show-cancel-button="false"
          accept="text/*, .json"
          :max-file-size="1000000"
          @upload="onUpload"
          @uploader="onFileUpload"
          @select="onSelect"
        >
          <!-- @upload="onFileUpload" -->
          <template #empty>
            <ren-input-text v-if="mPanelStructureText" v-model="mPanelStructureText" :text-label="null" :cols="50" :maxlength="10000" />
            <p v-else>{{ $t("view.file_drag_drop") }}</p>
          </template>
        </FileUpload>
      </template>
    </Card>
  </Dialog>
  <ren-submit :cancel-button="true" :disabled="v$.$invalid" @cancel="cancel" @submit="submit" />
</template>

<script>
//TODO: on owner select

import FileUpload from "primevue/fileupload";
import { useVuelidate } from "@vuelidate/core";
import { maxLength, required, minLength } from "@/plugins/validators.js"; //required,
import InfoIcon from "../../miscellaneous/InfoIcon.vue";
const ASSET_TAG = "{asset}";
export default {
  name: "InformationPanelForm",
  components: { InfoIcon, FileUpload },
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
      mPanelStructure: null,
      mPanelStructureText: null,
      labelWarning: null,
      importPanelDialog: false,
      hasFiles: false,
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
      // console.info(this.mModel);
      // console.info(t);
    },
  },
  async mounted() {},
  methods: {
    onSelect() {
      if (this.$refs.FileUpload !== undefined) this.hasFiles = this.$refs.FileUpload.files.length > 0;
      else this.hasFiles = false;
    },
    onFileClear() {
      this.mPanelStructure = null;
      this.mPanelStructureText = null;
    },
    async onFileUpload(evt) {
      console.info(evt.files);
      if (evt.files.length == 1) {
        this.mPanelStructure = await this.$ren.utils.readJSONFile(evt.files[0]);
        this.mPanelStructureText = JSON.stringify(this.mPanelStructure, null, "\t");
        console.info(this.mPanelStructure);
      }
      // await this._submit(event.files);
    },

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
