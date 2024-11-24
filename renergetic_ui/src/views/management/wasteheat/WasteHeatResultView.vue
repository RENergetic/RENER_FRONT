<template>
  <div style="height: 100%">
    <DotMenu v-if="workflow" :model="menuModel" />
    <RenSpinner ref="spinner" :lock="true" style="width: 100%; height: 100%">
      <template #content>
        <WasteHeatResult
          v-if="workflow"
          :key="settingsRefresh"
          :workflow="workflow"
          :workflow-run="workflowRun"
          :panel-settings="settings"
          @reload="reload"
        />
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

    <Dialog v-model:visible="runlogDialog" :style="{ width: '95vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
      <PipelineRunLog :workflow="workflow" @select="onSelect" />
    </Dialog>
  </div>
</template>
<script>
import WasteHeatResult from "@/components/management/WasteHeatResult.vue";
import PipelineRunLog from "@/components/admin/PipelineRunLog.vue";
import DotMenu from "@/components/miscellaneous/DotMenu.vue";
import { panelSchema } from "@/plugins/model/settings.js";
import ConversionSettings from "@/components/miscellaneous/settings/ConversionSettings.vue";
import Settings from "@/components/miscellaneous/settings/Settings.vue";
import PanelSettings from "@/components/miscellaneous/settings/PanelSettings.vue";
export default {
  name: "WasteHeatResultView",
  components: { PanelSettings, WasteHeatResult, DotMenu, ConversionSettings, Settings, PipelineRunLog },
  data() {
    return {
      workflow: null,
      workflowRun: null,
      settings: this.$store.getters["settings/panel"],
      settingsDialog: false,
      conversionSettingsDialog: false,
      schema: panelSchema(),
      runlogDialog: false,
      settingsRefresh: false,
    };
  },
  computed: {
    settingsButton: function () {
      return { label: this.$t("menu.panel_settings"), command: () => this.$refs.settingsDialog.open(), icon: "pi pi-fw pi-plus-circle" };
    },
    conversionSettingsButton: function () {
      return { label: this.$t("menu.unit_settings"), command: () => this.$refs.conversionSettingsDialog.open(), icon: "pi pi-fw pi-plus-circle" };
    },
    runListButton: function () {
      return { label: this.$t("menu.run_list"), command: () => (this.runlogDialog = true), icon: "pi pi-fw pi-list" };
    },
    resultCopyButton: function () {
      return { label: this.$t("menu.copy_results"), command: () => this.toClipboard(this.workflowRun.results), icon: "pi pi-fw pi-clipboard" };
    },

    menuModel() {
      let menu = [];
      if (this.panel != null) {
        menu.push(this.settingsButton);
        menu.push(this.conversionSettingsButton);
      }

      menu.push(this.runListButton);
      menu.push(this.resultCopyButton);
      //TODO:
      return menu;
    },
  },
  watch: {},
  async mounted() {
    await this.loadRun();
  },
  methods: {
    reloadSettings() {
      this.settings = this.$store.getters["settings/panel"];
      this.conversionSettings = this.$store.getters["settings/conversion"];
      this.settingsRefresh = !this.settingsRefresh;
    },
    async loadRun() {
      await this.$refs.spinner.run(async () => {
        let runId = this.$route.params.run_id;
        this.workflowRun = await this.$ren.kubeflowApi.getRun(runId);
        this.workflow = this.workflowRun.pipeline;
        try {
          this.panel = this.workflowRun.results.panel;
        } catch {
          this.panel = null;
          //nopanel
        }
      });

      // this.workflowRun = await this.$ren.kubeflowApi.getWorkflow(workflowRun.pipeline);
    },
  },
};
</script>
