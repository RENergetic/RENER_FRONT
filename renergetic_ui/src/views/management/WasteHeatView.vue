<template>
  <!-- Admin workflows -->

  <DotMenu v-if="panel" :model="menuModel" />
  <RenSpinner ref="spinner" :lock="true" style="width: 100%">
    <template #content>
      <WasteHeat
        v-if="workflow"
        :key="parsedFilterRefresh"
        :workflow="workflow"
        :workflow-run="workflowRun"
        :panel-settings="settings"
        :information-panel="panel"
        :panel-filter="effectiveFilterSettings"
        @reload="reload"
      />
      <div v-else>{{ $t("view.wasteheat_workflow_undefined") }}</div>
    </template>
  </RenSpinner>
  <RenSettingsDialog ref="settingsDialog">
    <template #settings>
      <Card class="ren-settings">
        <template #title>
          <span> {{ $t("view.panel_effective_settings") }}:</span>
        </template>
        <template #content>
          <Settings :schema="schema" :settings="computePanelSettings(settings, panel)" :disabled="true" />
        </template>
      </Card>
      <Card class="ren-settings">
        <template #title>
          <span> {{ $t("view.panel_settings") }}:</span>
        </template>
        <template #content>
          <Settings :schema="schema" :settings="panel.props" :disabled="true" />
        </template>
      </Card>
      <Card class="ren-settings">
        <template #title>
          <span> {{ $t("view.panel_user_settings") }}:</span>
        </template>
        <template #content>
          <PanelSettings @update="reloadSettings()"> </PanelSettings>
        </template>
      </Card>
    </template>
  </RenSettingsDialog>
  <RenSettingsDialog ref="conversionSettingsDialog">
    <template #settings>
      <ConversionSettings @update="reloadSettings()"></ConversionSettings>
    </template>
  </RenSettingsDialog>
  <RenSettingsDialog ref="filterSettingsDialog" :save="false">
    <template #settings>
      <Panel v-if="panel" toggleable class="ren-settings">
        <template #header>
          <span> {{ $t("view.panel_effective_filter_settings") }}:</span>
        </template>
        <BasicFilterSettings :settings="effectiveFilterSettings" :submit-button="false" :disabled="true" />
      </Panel>
      <Panel v-if="panel" toggleable class="ren-settings">
        <template #header>
          <span> {{ $t("view.panel_filter_settings") }}:</span>
        </template>
        <BasicFilterSettings :settings="panel.props" :submit-button="false" :disabled="true" />
      </Panel>
      <Panel v-if="panel" toggleable class="ren-settings">
        <template #header>
          <span> {{ $t("view.user_filter_settings") }}:</span>
        </template>
        <BasicFilterSettings :setting-key="'public'" @update="updateFilter()" />
      </Panel>
    </template>
  </RenSettingsDialog>
</template>
<script>
import WasteHeat from "@/components/management/WasteHeat.vue";
import DotMenu from "@/components/miscellaneous/DotMenu.vue";
import { panelSchema } from "@/plugins/model/settings.js";
import ConversionSettings from "@/components/miscellaneous/settings/ConversionSettings.vue";
import Settings from "@/components/miscellaneous/settings/Settings.vue";
import BasicFilterSettings from "@/components/miscellaneous/settings/BasicFilterSettings.vue";
import PanelSettings from "@/components/miscellaneous/settings/PanelSettings.vue";
export default {
  name: "WasteHeatView",
  components: { PanelSettings, WasteHeat, DotMenu, ConversionSettings, Settings, BasicFilterSettings },
  data() {
    return {
      workflow: null,
      workflowRun: null,
      panel: null,
      settings: this.$store.getters["settings/panel"],
      settingsDialog: false,
      filterSettingsDialog: false,
      conversionSettingsDialog: false,
      parsedFilterRefresh: false,
      schema: panelSchema(),
    };
  },
  computed: {
    effectiveFilterSettings: function () {
      if (this.panel == null) return {};
      let userFilter = this.$store.getters["settings/filters"]("public");
      let overrideMode = this.effectiveOverrideMode(this.settings, this.panel.props);
      let settings = this.mergeSettings(userFilter, this.panel.props, overrideMode);
      return this.parseDateFilter(settings);
    },
    settingsButton: function () {
      return { label: this.$t("menu.panel_settings"), command: () => this.$refs.settingsDialog.open(), icon: "pi pi-fw pi-plus-circle" };
    },
    conversionSettingsButton: function () {
      return { label: this.$t("menu.unit_settings"), command: () => this.$refs.conversionSettingsDialog.open(), icon: "pi pi-fw pi-plus-circle" };
    },
    filterSettingsButton: function () {
      return { label: this.$t("menu.filter_settings"), icon: "pi pi-fw pi-filter", command: () => this.$refs.filterSettingsDialog.open() };
    },

    menuModel() {
      let menu = [];
      menu.push(this.settingsButton);
      menu.push(this.conversionSettingsButton);
      menu.push(this.filterSettingsButton);
      return menu;
    },
  },
  watch: {},
  async mounted() {
    await this.loadWorkflow();
  },
  methods: {
    async loadWorkflow() {
      this.workflowRun = null;
      await this.$refs.spinner.run(async () => {
        var l = await this.$ren.kubeflowApi.getPipelineByProperty(this.WASTEHEAT_KUBEFLOW_DEFAULT_PIPELINE, "true");
        if (l && l.length == 1) {
          this.workflow = l[0];
        } else this.workflow = null;
      });
      if (this.workflow != null) {
        this.workflowRun = await this.$ren.kubeflowApi.getWorkflowRun(this.workflow.pipeline_id);
      }
      await this.loadPanelStructure();
    },

    async loadPanelStructure() {
      if (this.workflow && this.workflow.information_panel) {
        this.panel = await this.$ren.utils.getPanelStructure(this.workflow.information_panel.id, null, true, false);
      } else {
        this.panel = null;
      }
    },
    updateFilter() {
      this.parsedFilterRefresh = !this.parsedFilterRefresh;
    },
    reloadSettings() {
      this.settings = this.$store.getters["settings/panel"];
      this.parsedFilterRefresh = !this.parsedFilterRefresh;
    },
    async reload() {
      await this.loadWorkflow();
    },
  },
};
</script>
