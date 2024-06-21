<template>
  <InfoIcon :show-icon="false"> <template #content> </template> </InfoIcon>
  <div class="flex flex-column ren" style="height: 100%">
    <div v-if="mModel" id="panelForm" class="flex-grow-1">
      <!-- <ScrollPanel style="width: 100%; height: 85vh"> -->
      <Accordion :active-index="0" style="max-height: 85%">
        <AccordionTab :header="$t('view.information_panel_form')">
          <ren-input
            v-model="mModel.name"
            :text-info="'model.name_description'"
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
        <AccordionTab :key="mModel.props" :header="$t('view.information_panel_props')">
          <!-- {{ mModel.props }} -->
          <Settings :schema="schema" :settings="mModel.props"></Settings>
          <BasicFilterSettings :settings="mModel.props" :submit-button="false" />
        </AccordionTab>
        <!-- {{ modelValue }} -->

        <AccordionTab v-if="panelStructure && panelStructure.tiles != null" :header="$t('model.information_panel.tiles')" @click="() => alert('')">
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
              @uploader="onFileUpload"
              @select="onSelect"
            >
              <!-- @upload="onUpload" -->
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
                  :option-label="(opt) => $t(`model.panel_templates.${opt.name}`)"
                  :option-value="'template'"
                  :options="panelTemplates"
                  @change="onTemplateSelect"
                />
              </template>
            </ren-input-wrapper>
          </AccordionTab>
        </Accordion>
      </template>
    </ren-input-wrapper>
    <ren-switch
      v-if="!mModel.is_template"
      :key="inferMeasurements"
      v-model="inferMeasurements"
      :text-label="'view.infer_measurements'"
      :options="[
        { label: $t('view.infer_measurements'), value: 'refill' },
        { label: $t('view.no_infer_measurements'), value: 'default' },
        { label: $t('view.ignore_measurements_ids'), value: 'override' },
      ]"
    />
    <ren-submit v-if="submittedPanelJSON != null" :cancel-button="true" @submit="fileSubmit" @cancel="onFileClear" />
  </Dialog>
</template>

<script>
import { cleanTileStructure } from "./InformationPanelTileForm.vue";
import panelTemplates from "@/plugins/model/information_panel_templates";
export function getCleanPanelStructure(panel, clearIDs = false /*, isTemplate*/) {
  // console.error(panel);
  let mPanel = JSON.parse(JSON.stringify(panel));
  if (mPanel.name !== undefined) delete mPanel.name;
  if (mPanel.id !== undefined) delete mPanel.id;
  // console.info(mPanel);
  for (let tile of mPanel.tiles) {
    cleanTileStructure(tile, clearIDs);
  }
  return mPanel;
  // return JSON.stringify(mPanel, null, "\t");
}
import FileUpload from "primevue/fileupload";

import InformationPanelTilesWrapper from "./InformationPanelTilesWrapper.vue";
import { panelSchema } from "@/plugins/model/settings.js";
// var schema = JSON.parse(JSON.stringify(panelSchema));
// schema.push({
//   label: this.$t("settings.panel_override_mode"),
//   description: this.$t("settings.panel_override_mode_description"),
//   ext: {
//     true: this.$t("settings.enabled"),
//     false: this.$t("settings.disabled"),
//   },
//   type: Boolean,
//   key: "overrideMode",
// });
import { useVuelidate } from "@vuelidate/core";
import { maxLength, required, minLength, minValue, maxValue } from "@/plugins/validators.js";
import InfoIcon from "../../miscellaneous/InfoIcon.vue";
import Settings from "@/components/miscellaneous/settings/Settings.vue";
import BasicFilterSettings from "@/components/miscellaneous/settings/BasicFilterSettings.vue";

const ASSET_TAG = "{asset}";
export default {
  name: "InformationPanelForm",
  components: { InfoIcon, FileUpload, InformationPanelTilesWrapper, Settings, BasicFilterSettings },
  props: {
    modelValue: {
      type: Object,
      default: () => ({ tiles: [], props: {} }),
    },
  },
  emits: ["update:modelValue", "cancel"],
  setup: () => ({ v$: useVuelidate() }),
  data() {
    let mModel = this.modelValue ? this.modelValue : { tiles: [], props: {} };
    mModel.props = mModel.props ? mModel.props : {};
    let panelStructure = getCleanPanelStructure(mModel, false);
    return {
      schema: panelSchema,
      inferMeasurements: "default",
      mModel: mModel,
      addMode: this.modelValue == null || this.modelValue.name == null,
      panelTemplates: panelTemplates,
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
        console.error(s);
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
    // mModel: {
    //   handler: function () {
    //     this;
    //   },
    //   deep: true,
    // },
  },
  async mounted() {},
  methods: {
    onTemplateSelect() {
      this.inferMeasurements = "refill";
    },
    updateModel(submittedPanel) {
      if (submittedPanel.label) this.mModel.label = submittedPanel.label;
      if (submittedPanel.props) this.mModel.props = { ...this.mModel.props, ...submittedPanel.props };
    },
    submitStructure() {
      let submittedPanel = JSON.parse(this.mPanelStructureJSON);
      this.panelStructure = getCleanPanelStructure(submittedPanel, this.inferMeasurements == "override");
      this.updateModel(this.panelStructure);
      this.refreshTiles = !this.refreshTiles;
    },
    onSelect() {
      //on file select
      if (this.$refs.FileUpload !== undefined) this.hasFiles = this.$refs.FileUpload.files.length > 0;
      else this.hasFiles = false;
    },
    onFileClear() {
      this.panelStructure = getCleanPanelStructure(this.mModel, false);
      this.submittedPanelJSON = null;
    },
    async fileSubmit() {
      let submittedPanel = JSON.parse(this.submittedPanelJSON);
      switch (this.inferMeasurements) {
        case "override":
          this.panelStructure = await this.infer(submittedPanel, true);
          break;
        case "refill":
          this.panelStructure = await this.infer(submittedPanel, false);
          break;
        default:
          this.panelStructure = getCleanPanelStructure(submittedPanel);
      }
      // if (this.inferMeasurements=='refill' ) {
      //   this.panelStructure = await this.infer(submittedPanel);
      // } else {
      //   this.panelStructure = getCleanPanelStructure(submittedPanel);
      // }
      this.updateModel(this.panelStructure);
      this.refreshTiles = !this.refreshTiles;
      this.importPanelDialog = false;
    },
    async onFileUpload(evt) {
      if (evt.files.length == 1) {
        let submittedPanel = await this.$ren.utils.readJSONFile(evt.files[0]);
        if (submittedPanel.name !== undefined) {
          delete submittedPanel.name;
        }
        if (submittedPanel.id !== undefined) {
          delete submittedPanel.id;
        }
        // console.error(submittedPanel);
        submittedPanel = getCleanPanelStructure(submittedPanel, false);
        this.updateModel(submittedPanel);

        this.submittedPanelJSON = JSON.stringify(submittedPanel, null, "\t");
      }
      // await this._submit(event.files);
    },
    onUpload() {},

    async infer(panel, overrideMeasurements) {
      if (!this.mModel.is_template) {
        let mPanel = getCleanPanelStructure(panel, overrideMeasurements);
        return await this.$ren.dashboardApi.inferMeasurements(mPanel).then((inferredPanel) => {
          return getCleanPanelStructure(inferredPanel, false);
        });
      }
      return getCleanPanelStructure(panel, false);
    },
    submit() {
      if (this.mModel.label && !this.mModel.label.includes(ASSET_TAG) && this.mModel.is_template) {
        this.mModel.label = `${this.mModel.label} - (${ASSET_TAG})`;
      }
      this.panelStructure.name = this.mModel.name;
      this.panelStructure.is_template = this.mModel.is_template == null ? false : this.mModel.is_template;
      this.panelStructure.props = { ...this.panelStructure.props, ...this.mModel.props };
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
#panelForm > .p-accordion .p-accordion-content {
  max-height: 70vh;
  overflow: auto;
}
</style>
