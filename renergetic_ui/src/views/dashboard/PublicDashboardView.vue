<template>
  <!-- PUBLIC DASHBOARD -->
  <div v-if="panel" id="panel-box">
    <DotMenu :model="menuModel" />
    <InformationPanelWrapper
      ref="panel"
      :asset-id="$route.params.asset_id"
      :locked="locked"
      :panel="panel"
      :edit-mode="false"
      :panel-settings="settings"
      :filter="effectiveFilterSettings"
    ></InformationPanelWrapper>
    <div style="margin-left: 1rem; margin-top: 2rem">
      <ParsedDateFilter :key="parsedFilterRefresh" :filter="effectiveFilterSettings" />
    </div>
  </div>
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
    <template #settings><ConversionSettings @update="reloadSettings()"></ConversionSettings></template>
  </RenSettingsDialog>
  <RenSettingsDialog ref="filterSettingsDialog" :save="false">
    <template #settings>
      <Card class="ren-settings">
        <template #title>
          <span> {{ $t("view.panel_effective_filter_settings") }}:</span>
        </template>
        <template #content>
          <BasicFilterSettings :settings="effectiveFilterSettings" :submit-button="false" :disabled="true" />
          <!-- <Settings :schema="schema" :settings="effectiveFilterSettings" :disabled="true" /> -->
        </template>
      </Card>
      <Card class="ren-settings">
        <template #title>
          <span> {{ $t("view.panel_filter_settings") }}:</span>
        </template>
        <template #content>
          <BasicFilterSettings :settings="panel.props" :submit-button="false" :disabled="true" />
          <!-- <Settings :schema="schema" :settings="panel.props" :disabled="true" /> -->
        </template>
      </Card>
      <Card class="ren-settings">
        <template #title>
          <span> {{ $t("view.user_filter_settings") }}:</span>
        </template>
        <template #content>
          <BasicFilterSettings @update="updateFilter()" />
          <!-- <PanelSettings @update="reloadPanelSettings()"> </PanelSettings> -->
        </template>
      </Card>
    </template>
  </RenSettingsDialog>
</template>
<script>
import { getCleanPanelStructure } from "@/components/dashboard/informationpanel/InformationPanelForm.vue";
import InformationPanelWrapper from "@/components/dashboard/informationpanel/InformationPanelWrapper.vue";
import DotMenu from "@/components/miscellaneous/DotMenu.vue";
import PanelSettings from "@/components/miscellaneous/settings/PanelSettings.vue";
import ConversionSettings from "@/components/miscellaneous/settings/ConversionSettings.vue";
import Settings from "@/components/miscellaneous/settings/Settings.vue";
import ParsedDateFilter from "@/components/miscellaneous/settings/ParsedDateFilter.vue";
import { panelSchema } from "@/plugins/model/settings.js";
import BasicFilterSettings from "@/components/miscellaneous/settings/BasicFilterSettings.vue";
export default {
  name: "PublicDashboardView",
  components: {
    BasicFilterSettings,
    InformationPanelWrapper,
    ParsedDateFilter,
    DotMenu,
    PanelSettings,
    Settings,
    // NotificationList,
    ConversionSettings,
  },
  data() {
    return {
      schema: panelSchema,
      panel: null,
      // locked: false,
      notifications: [],
      settings: this.$store.getters["settings/panel"],
      settingsDialog: false,
      filterSettingsDialog: false,
      conversionSettingsDialog: false,
      parsedFilterRefresh: false,
    };
  },
  computed: {
    effectiveFilterSettings: function () {
      let userFilter = this.$store.getters["settings/filters"]();
      let overrideMode = this.panel.props && this.panel.props.overrideMode ? this.panel.props.overrideMode : null;
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
    exportStructureButton: function () {
      return { label: this.$t("menu.export"), icon: "pi pi-file", command: () => this.exportPanel(false) };
    },
    exportTemplateButton: function () {
      return { label: this.$t("menu.export_template"), icon: "pi pi-file", command: () => this.exportPanel(true) };
    },
    fullScreenButton: function () {
      return {
        label: this.$t("menu.tv_view_mode"),
        icon: "pi pi-fw pi-window-maximize",
        command: () => {
          this.$router.push({ name: "PublicDashboardViewTV", params: { id: this.panel.id } });
        },
      };
    },

    menuModel() {
      let menu = [
        // {
        //   label: this.$t("menu.save_panel_grid"),
        //   icon: "pi pi-fw pi-save",
        //   command: () => this.saveGrid(),
        // },
      ];
      menu.push(this.settingsButton);
      menu.push(this.conversionSettingsButton);
      menu.push(this.filterSettingsButton);
      menu.push(this.fullScreenButton);
      menu.push(this.exportTemplateButton);
      menu.push(this.exportStructureButton);
      return menu;
    },
  },
  async mounted() {
    await this.loadStructure();
  },
  methods: {
    exportPanel(template) {
      let panelStructure = getCleanPanelStructure(this.panel, template);
      let filename = template ? `template_${this.panel.name}` : `${this.panel.id}_${this.panel.name}`;
      this.$ren.utils.downloadJSON(panelStructure, filename, true);
    },
    async loadStructure() {
      this.panel = await this.$ren.utils.getPanelStructure(this.$route.params.id, this.$route.params.asset_id);
      // let m = this.panel.tiles.map((it) => ({ id: it.id, m: it.measurements.map((m) => ({ name: m.name, label: m.label })) }));
    },
    updateFilter() {
      // this.filterSettings = this.$store.getters["settings/parsedFilter"]();
      this.parsedFilterRefresh = !this.parsedFilterRefresh;
    },
    reloadSettings() {
      // this.filterSettings = this.$store.getters["settings/parsedFilter"]();
      this.settings = this.$store.getters["settings/panel"];
      this.conversionSettings = this.$store.getters["settings/conversion"];
      this.parsedFilterRefresh = !this.parsedFilterRefresh;
    },
  },
};
</script>

<style lang="scss"></style>
