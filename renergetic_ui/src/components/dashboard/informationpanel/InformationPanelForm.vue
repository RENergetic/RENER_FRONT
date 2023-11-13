<template>
  <InfoIcon :show-icon="false"> <template #content> </template> </InfoIcon>
  <!-- {{ mModel }} -->
  <!-- addmode: {{ addMode }} todo: -->
  <!-- <Card v-if="mModel">
    <template #content> -->
  <div v-if="mModel" id="panelForm" class="ren">
    <Accordion :active-index="0">
      <AccordionTab :header="$t('model.panel.name')">
        <ren-input v-model="mModel.name" :text-label="'model.panel.name'" :invalid="v$.mModel.name.$invalid" :errors="v$.mModel.name.$silentErrors" />

        <ren-input
          :key="mModel ? mModel.label : ''"
          v-model="mModel.label"
          :text-info="mModel.is_template ? $t('view.panel_label_info', ['{asset}']) : null"
          :text-label="'model.panel.label'"
          :invalid="v$.mModel.label.$invalid"
          :errors="v$.mModel.label.$silentErrors"
        />

        {{ labelWarning }}
        <ren-switch v-if="addMode" v-model="mModel.is_template" :text-label="'model.panel.is_template_new_panel'" />
        <!-- {{ mModel.priority }} -->
        <ren-input-number
          v-model="mModel.priority"
          :min="0"
          :max="1024"
          :only-integer="true"
          :text-label="'model.panel.priority'"
          :invalid="v$.mModel.priority.$invalid"
          :errors="v$.mModel.priority.$silentErrors"
        />
      </AccordionTab>
      <!-- {{ modelValue }} -->

      <AccordionTab :header="$t('model.panel.structure')">
        <ren-input-wrapper v-if="mPanelStructureText" :text-label="null">
          <template #content>
            <Textarea v-model="mPanelStructureText" style="width: 100%" :maxlength="20000" rows="15" :cols="80"></Textarea>
          </template>
        </ren-input-wrapper>
        <ren-input-wrapper v-if="modelValue" :text-label="null">
          <template #content>
            <!-- <span v-if="!selectedAsset">{{ $t("view.asset_not_selected") }}</span> -->
            <Button style="margin-left: 0.5rem" @click="importPanelDialog = true">{{ $t("view.upload_structure") }}</Button>
            <span v-if="submittedPanel">{{ $t("view.file_submitted") }}</span>
          </template>
        </ren-input-wrapper>
      </AccordionTab>
    </Accordion>
  </div>
  <!-- </template>
  </Card> -->
  <Dialog v-model:visible="importPanelDialog" :style="{ width: '50vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <Card>
      <template #header> </template>
      <template #content>
        <Accordion>
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
                <ren-input-wrapper v-if="submittedPanel" :text-label="null">
                  <template #content>
                    <Textarea v-model="submittedPanel" style="width: 100%" :maxlength="20000" rows="15" :cols="80"></Textarea>
                  </template>
                </ren-input-wrapper>
                <p v-if="!submittedPanel">{{ $t("view.file_drag_drop") }}</p>
              </template>
            </FileUpload>
          </AccordionTab>
          <AccordionTab :header="$t('view.panel_templates')">
            <ren-input-wrapper>
              <template #content>
                <Listbox
                  id="panelDefaultTemplates"
                  v-model="submittedPanel"
                  :option-label="(opt) => $t(`view.panel_templates.${opt.label}`)"
                  :options="[{ label: kpi, template: {} }]"
                />
              </template>
            </ren-input-wrapper>
          </AccordionTab>
        </Accordion>

        <ren-switch
          v-if="!mModel.is_template"
          v-model="inferMeasurements"
          :options="[
            { label: $t('view.infer_measurements'), value: true },
            { label: $t('view.no_infer_measurements'), value: false },
          ]"
        />
        <ren-submit v-if="submittedPanel != null" :cancel-button="true" @submit="fileSubmit" @cancel="onFileClear" />
      </template>
    </Card>
  </Dialog>
  <ren-submit :cancel-button="true" :disabled="v$.$invalid" @cancel="cancel" @submit="submit" />
</template>

<script>
//TODO: on owner select
function getStructureText(panel, isTemplate) {
  let mPanel = JSON.parse(JSON.stringify(panel));
  if (mPanel.name !== undefined) delete mPanel.name;
  if (mPanel.id !== undefined) delete mPanel.id;
  console.info(isTemplate);
  for (let tile of mPanel.tiles) {
    if (tile.measurements) {
      tile.measurements = tile.measurements
        .map((m) => {
          let obj;
          if (m.id !== undefined && m.id != null) {
            return { id: m.id, aggregation_function: m.aggregation_function };
          } else if (isTemplate) {
            obj = {
              name: m.name,
              domain: m.domain,
              direction: m.direction,
              sensor_name: m.sensor_name,
              aggregation_function: m.aggregation_function,
            };
            if (m.type) {
              obj.type = { id: m.type.id, physical_name: m.type.physical_name, unit: m.type.unit };
            }
            if (m.asset) {
              obj.asset = { id: m.asset.id };
            }
            return obj;
          }
          return null;
        })
        .filter((m) => m != null);
    }
  }
  return JSON.stringify(mPanel, null, "\t");
}
import FileUpload from "primevue/fileupload";
import { useVuelidate } from "@vuelidate/core";
import { maxLength, required, minLength, minValue, maxValue } from "@/plugins/validators.js";
import InfoIcon from "../../miscellaneous/InfoIcon.vue";
const ASSET_TAG = "{asset}";
export default {
  name: "InformationPanelForm",
  components: { InfoIcon, FileUpload },
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
    return {
      inferMeasurements: false,
      mModel: mModel,
      addMode: this.modelValue == null || this.modelValue.name == null,
      // mPanelStructure: null,
      mPanelStructureText: getStructureText(mModel, mModel.is_template),
      labelWarning: null,
      importPanelDialog: false,
      hasFiles: false,
      submittedPanel: null,
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
  computed: {},
  watch: {
    "mModel.label": function (t) {
      if (this.mModel.is_template && t && !t.includes(ASSET_TAG)) {
        this.labelWarning = this.$t("view.panel_label_warning", [ASSET_TAG]);
        // this.mModel.label = this.mModel.label + " - ({asset})";
      }
      if (this.labelWarning != null) {
        this.labelWarning = null;
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
      // this.mPanelStructure = null;
      this.mPanelStructureText = getStructureText(this.mModel, this.mModel.is_template);

      this.submittedPanel = null;
    },
    async fileSubmit() {
      this.mPanelStructureText = this.submittedPanel;
      if (this.inferMeasurements) {
        await this.infer();
      }
      this.importPanelDialog = false;
    },
    async onFileUpload(evt) {
      this.submittedPanel = null;
      // console.info(evt.files);
      if (evt.files.length == 1) {
        let mPanelStructure = await this.$ren.utils.readJSONFile(evt.files[0]);
        if (mPanelStructure.name !== undefined) {
          delete mPanelStructure.name;
        }
        if (mPanelStructure.id !== undefined) {
          delete mPanelStructure.id;
        }

        console.error(mPanelStructure);
        this.submittedPanel = getStructureText(mPanelStructure, this.mModel.is_template);
      }
      // await this._submit(event.files);
    },

    async infer() {
      if (!this.mModel.is_template) {
        let panel = JSON.parse(this.mPanelStructureText);
        await this.$ren.dashboardApi.inferMeasurements(panel).then((inferredPanel) => {
          this.submittedPanel = getStructureText(inferredPanel, this.mModel.is_template);
          this.mPanelStructureText = this.submittedPanel;
        });
      }

      let panel = JSON.parse(this.mPanelStructureText);
      panel.name = this.mModel.name;
      panel.id = this.mModel.id;
      panel.label = this.mModel.label ? this.mModel.label : this.panel.label;
      this.mModel = panel;
      this.$emit("update:modelValue", this.mModel);
    },
    submit() {
      if (this.mModel.label && !this.mModel.label.includes(ASSET_TAG) && this.mModel.is_template) {
        this.mModel.label = `${this.mModel.label} - (${ASSET_TAG})`;
      }

      let panel = JSON.parse(this.mPanelStructureText);
      panel.name = this.mModel.name;
      panel.id = this.mModel.id;
      panel.label = this.mModel.label ? this.mModel.label : this.panel.label;
      this.mModel = panel;
      this.$emit("update:modelValue", this.mModel);
    },
    cancel() {
      this.$emit("cancel", this.model);
    },
  },
};
</script>

<style lang="scss">
#panelForm {
  .p-dialog-content,
  .p-accordion-content {
    padding-bottom: 0 !important;
    padding-top: 0 !important;
  }
}
</style>
