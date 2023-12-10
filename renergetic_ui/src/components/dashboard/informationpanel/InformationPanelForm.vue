<template>
  <InfoIcon :show-icon="false"> <template #content> </template> </InfoIcon>
  <div class="flex flex-column ren" style="height: 100%">
    <div v-if="mModel" id="panelForm" class="flex-grow-1">
      <!-- <ScrollPanel style="width: 100%; height: 85vh"> -->
      <Accordion :active-index="0" style="max-height: 85%">
        <AccordionTab :header="$t('view.information_panel_form')">
          <ren-input
            v-model="mModel.name"
            :text-label="'model.information_panel.name'"
            :invalid="v$.mModel.name.$invalid"
            :errors="v$.mModel.name.$silentErrors"
          />
          <!-- :key="mModel ? mModel.label : ''" -->
          <ren-input
            v-model="mModel.label"
            :text-info="mModel.is_template ? $t('view.panel_label_info', ['{asset}']) : null"
            :text-label="'model.information_panel.label'"
            :invalid="v$.mModel.label.$invalid"
            :errors="v$.mModel.label.$silentErrors"
          />
          {{ labelWarning }}
          <ren-switch v-if="addMode" v-model="mModel.is_template" :text-label="'model.information_panel.is_template_new_panel'" />
          <!-- {{ mModel.priority }} -->
          <ren-input-number
            v-model="mModel.priority"
            :min="0"
            :max="1024"
            :only-integer="true"
            :text-label="'model.information_panel.priority'"
            :invalid="v$.mModel.priority.$invalid"
            :errors="v$.mModel.priority.$silentErrors"
          />
        </AccordionTab>
        <!-- {{ modelValue }} -->

        <AccordionTab v-if="panelStructure && panelStructure.tiles != null" :header="$t('model.information_panel.tiles')">
          <InformationPanelTilesWrapper v-if="panelStructure" :key="refreshTiles" v-model="panelStructure" :is-template="mModel.is_template" />
        </AccordionTab>
        <AccordionTab :header="$t('model.information_panel.structure')">
          <ren-input-wrapper v-if="mPanelStructureJSON" :text-label="null">
            <template #content>
              <Textarea v-model="mPanelStructureJSON" style="width: 100%" :maxlength="20000" rows="15" :cols="80"></Textarea>
            </template>
          </ren-input-wrapper>
          <ren-input-wrapper v-if="modelValue" :text-label="null">
            <template #content>
              <!-- <span v-if="!selectedAsset">{{ $t("view.asset_not_selected") }}</span> -->
              <div>
                <Button style="margin-left: 0.5rem" @click="importPanelDialog = true">
                  {{ $t("view.information_panel_submit_file_structure") }}
                </Button>
                <Button style="margin-left: 0.5rem" @click="submitStructure">
                  {{ $t("view.information_panel_submit_structure") }}
                </Button>
              </div>
              <!-- <span v-if="submittedPanelJSON">{{ $t("view.file_submitted") }}</span> -->
            </template>
          </ren-input-wrapper>
        </AccordionTab>
      </Accordion>
      <!-- </ScrollPanel> -->
    </div>
    <div class="flex-grow-0">
      <ren-submit :cancel-button="true" :disabled="v$.$invalid" @cancel="cancel" @submit="submit" />
    </div>
  </div>
  <Dialog v-model:visible="importPanelDialog" :style="{ width: '60vw', height: '80vh' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <ren-input-wrapper :text-label="null">
      <template #content>
        <Accordion :active-index="0">
          <AccordionTab :header="$t('view.fileupload')">
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
                <!-- <ren-input-text v-if="submittedPanel" v-model="submittedPanel" :text-label="null" :cols="50" :maxlength="10000" /> -->
                <ren-input-wrapper v-if="submittedPanelJSON" :text-label="null">
                  <template #content>
                    <Textarea v-model="submittedPanelJSON" style="width: 100%" :maxlength="20000" rows="15" :cols="80"></Textarea>
                  </template>
                </ren-input-wrapper>
                <p v-if="!submittedPanelJSON">{{ $t("view.file_drag_drop") }}</p>
              </template>
            </FileUpload>
          </AccordionTab>
          <AccordionTab :header="$t('view.panel_templates')">
            <ren-input-wrapper>
              <template #content>
                <Listbox
                  id="panelDefaultTemplates"
                  v-model="submittedPanelJSON"
                  :option-label="(opt) => $t(`view.panel_templates.${opt.label}`)"
                  :options="[{ label: kpi, template: {} }]"
                />
              </template>
            </ren-input-wrapper>
          </AccordionTab>
        </Accordion>
      </template>
    </ren-input-wrapper>
    <ren-switch
      v-if="!mModel.is_template"
      v-model="inferMeasurements"
      :text-label="'view.infer_measurements'"
      :options="[
        { label: $t('view.infer_measurements'), value: true },
        { label: $t('view.no_infer_measurements'), value: false },
      ]"
    />
    <ren-submit v-if="submittedPanelJSON != null" :cancel-button="true" @submit="fileSubmit" @cancel="onFileClear" />
  </Dialog>
</template>

<script>
import { cleanTileStructure } from "./InformationPanelTileForm.vue";
function getCleanPanelStructure(panel /*, isTemplate*/) {
  let mPanel = JSON.parse(JSON.stringify(panel));
  if (mPanel.name !== undefined) delete mPanel.name;
  if (mPanel.id !== undefined) delete mPanel.id;
  // console.info(mPanel);
  for (let tile of mPanel.tiles) {
    cleanTileStructure(tile);
  }
  return mPanel;
  // return JSON.stringify(mPanel, null, "\t");
}
import FileUpload from "primevue/fileupload";

import InformationPanelTilesWrapper from "./InformationPanelTilesWrapper.vue";
import { useVuelidate } from "@vuelidate/core";
import { maxLength, required, minLength, minValue, maxValue } from "@/plugins/validators.js";
import InfoIcon from "../../miscellaneous/InfoIcon.vue";
const ASSET_TAG = "{asset}";
export default {
  name: "InformationPanelForm",
  components: { InfoIcon, FileUpload, InformationPanelTilesWrapper },
  props: {
    modelValue: {
      type: Object,
      default: () => ({ tiles: [] }),
    },
  },
  emits: ["update:modelValue", "cancel"],
  setup: () => ({ v$: useVuelidate() }),
  data() {
    let mModel = this.modelValue ? this.modelValue : { tiles: [] };
    let panelStructure = getCleanPanelStructure(mModel);
    return {
      inferMeasurements: false,
      mModel: mModel,
      addMode: this.modelValue == null || this.modelValue.name == null,
      // mPanelStructure: null,
      mPanelStructureJSON: JSON.stringify(panelStructure, null, "\t"),
      panelStructure: panelStructure,
      labelWarning: null,
      importPanelDialog: false,
      hasFiles: false,
      submittedPanelJSON: null,
      refreshTiles: false,
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
        priority: { minValue: minValue(0), maxValue: maxValue(1024) },
      },
    };
  },
  watch: {
    panelStructure: {
      handler: function (s) {
        console.info(s);
        if (s != null) {
          this.mPanelStructureJSON = JSON.stringify(s, null, "\t");
        } else {
          this.mPanelStructureJSON = "";
        }
      },
      deep: true,
      immediate: true,
    },
    "mModel.label": function (t) {
      if (this.mModel.is_template && t && !t.includes(ASSET_TAG)) {
        this.labelWarning = this.$t("view.panel_label_warning", [ASSET_TAG]);
      } else if (this.labelWarning != null) {
        this.labelWarning = null;
      }
    },
    "mModel.is_template": function (isTemplate) {
      this.refreshTiles = !this.refreshTiles;
      if (isTemplate && this.mModel.label && !this.mModel.label.includes(ASSET_TAG)) {
        this.labelWarning = this.$t("view.panel_label_warning", [ASSET_TAG]);
      } else if (this.labelWarning != null) {
        this.labelWarning = null;
      }
    },
  },
  async mounted() {},
  methods: {
    submitStructure() {
      let submittedPanel = JSON.parse(this.mPanelStructureJSON);
      this.panelStructure = getCleanPanelStructure(submittedPanel);
      this.refreshTiles = !this.refreshTiles;
    },
    onSelect() {
      if (this.$refs.FileUpload !== undefined) this.hasFiles = this.$refs.FileUpload.files.length > 0;
      else this.hasFiles = false;
    },
    onFileClear() {
      this.panelStructure = getCleanPanelStructure(this.mModel);
      this.submittedPanelJSON = null;
    },
    async fileSubmit() {
      let submittedPanel = JSON.parse(this.submittedPanelJSON);
      if (this.inferMeasurements) {
        this.panelStructure = await this.infer(submittedPanel);
      } else {
        this.panelStructure = getCleanPanelStructure(submittedPanel);
      }
      this.refreshTiles = !this.refreshTiles;
      this.importPanelDialog = false;
    },
    async onFileUpload(evt) {
      // this.submittedPanel = null;
      // console.info(evt.files);
      if (evt.files.length == 1) {
        let submittedPanel = await this.$ren.utils.readJSONFile(evt.files[0]);
        if (submittedPanel.name !== undefined) {
          delete submittedPanel.name;
        }
        if (submittedPanel.id !== undefined) {
          delete submittedPanel.id;
        }
        console.error(submittedPanel);
        submittedPanel = getCleanPanelStructure(submittedPanel);
        this.submittedPanelJSON = JSON.stringify(submittedPanel, null, "\t");
      }
      // await this._submit(event.files);
    },

    async infer(panel) {
      if (!this.mModel.is_template) {
        return await this.$ren.dashboardApi.inferMeasurements(panel).then((inferredPanel) => {
          return getCleanPanelStructure(inferredPanel);
        });
      }
      return getCleanPanelStructure(panel);

      // let panel = JSON.parse(this.mPanelStructureText);
      // panel.name = this.mModel.name;
      // panel.id = this.mModel.id;
      // panel.label = this.mModel.label ? this.mModel.label : this.panel.label;
      // this.mModel = panel;
      // this.$emit("update:modelValue", this.mModel);
    },
    submit() {
      if (this.mModel.label && !this.mModel.label.includes(ASSET_TAG) && this.mModel.is_template) {
        this.mModel.label = `${this.mModel.label} - (${ASSET_TAG})`;
      }

      // let panel = JSON.parse(this.mPanelStructureText);

      this.panelStructure.name = this.mModel.name;
      this.panelStructure.id = this.mModel.id;
      this.panelStructure.label = this.mModel.label ? this.mModel.label : this.panelStructure.label;
      this.mModel = this.panelStructure;
      this.$emit("update:modelValue", this.mModel);
    },
    cancel() {
      this.$emit("cancel", this.model);
    },
  },
};
</script>

<style lang="scss" scoped>
#panelForm {
  .p-dialog-content,
  .p-accordion-content {
    padding-bottom: 0 !important;
  }
}
.p-dialog {
  max-height: 99%;
}
</style>
<style lang="scss">
#panelForm {
  .p-dialog-content,
  .p-accordion-content {
    padding-bottom: 0 !important;
    // padding-top: 0 !important;
  }
}
#panelForm > .p-accordion > .p-accordion-tab {
  max-height: 70vh;
  overflow: auto;
}
</style>
