<template>
  <!-- PUBLIC DASHBOARD -->
  <div v-if="panel" id="panel-box">
    <DotMenu :model="menuModel" />
    <!-- :asset-id="$route.params.asset_id" -->
    <InformationPanelWrapper
      ref="panel"
      :key="panelReload"
      :panel="panel"
      :edit-mode="editMode"
      :panel-settings="settings"
      :filter="effectiveFilterSettings"
      @update:tile="onTileUpdate"
    ></InformationPanelWrapper>
    <div style="margin-left: 1rem; margin-top: 2rem">
      <ParsedDateFilter :key="parsedFilterRefresh" :filter="effectiveFilterSettings" />
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
        <!-- <Card class="ren-settings">
        <template #title>
          <span> {{ $t("view.panel_effective_filter_settings") }}:</span>
        </template>
        <template #content>
          <BasicFilterSettings :settings="effectiveFilterSettings" :submit-button="false" :disabled="true" /> 
        </template>
      </Card>
      <Card class="ren-settings">
        <template #title>
          <span> {{ $t("view.panel_filter_settings") }}:</span>
        </template>
        <template #content>
          <BasicFilterSettings :settings="panel.props" :submit-button="false" :disabled="true" /> 
        </template>
      </Card>
      <Card class="ren-settings">
        <template #title>
          <span> {{ $t("view.user_filter_settings") }}:</span>
        </template>
        <template #content>
          <BasicFilterSettings :setting-key="'public'" @update="updateFilter()" />
        </template>
      </Card> -->
      </template>
    </RenSettingsDialog>
  </div>
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
      schema: panelSchema(),
      panel: null,
      panelReload: false,
      editMode: false,
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
    exportStructureButton: function () {
      return { label: this.$t("menu.export"), icon: "pi pi-file", command: () => this.exportPanel(false) };
    },
    exportTemplateButton: function () {
      return { label: this.$t("menu.export_template"), icon: "pi pi-file", command: () => this.exportPanel(true) };
    },
    editModeButton: function () {
      return { label: this.$t("menu.toggle_edit_mode"), icon: "pi pi-pencil", command: () => (this.editMode = !this.editMode) };
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
      if (this.hasRole(this.RenRoles.REN_ADMIN | this.RenRoles.REN_MANAGER | this.RenRoles.REN_TECHNICAL_MANAGER)) {
        menu.push(this.exportTemplateButton);
        menu.push(this.exportStructureButton);
        menu.push(this.editModeButton);
      }

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
    async onTileUpdate(ev) {
      this.panel.tiles[ev.index] = ev.tile;
      await this.$ren.dashboardApi.updateInformationPanel(this.panel).then(async () => {
        // console.debug(this.panel);
        await this.loadStructure(true);
        this.panelReload = !this.panelReload;
        console.debug(this.panel);
      });
    },
    async loadStructure(forceReload = false) {
      this.panel = await this.$ren.utils.getPanelStructure(this.$route.params.id, this.$route.params.asset_id, !forceReload, forceReload);
    },
    updateFilter() {
      this.parsedFilterRefresh = !this.parsedFilterRefresh;
    },
    reloadSettings() {
      this.settings = this.$store.getters["settings/panel"];
      this.conversionSettings = this.$store.getters["settings/conversion"];
      this.parsedFilterRefresh = !this.parsedFilterRefresh;
    },
  },
};
</script>

<style lang="scss"></style>
