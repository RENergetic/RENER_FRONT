<template>
  <!-- PRIVATE DASHBOARD -->

  <div v-if="panel" id="panel-box">
    <!-- {{ $store.getters["settings/parsedFilter"]("private") }} -->
    <DotMenu :model="menuModel" />
    <BasicFilterSettings
      v-if="!panelTitle"
      style="width: 90%; margin: auto; margin-top: 1rem"
      class="ren-card"
      :setting-key="'private'"
      :submit-button="false"
      :columns="3"
      :labels="false"
      @update="reloadSettings()"
    />
    <h3 v-if="panelTitle" style="width: 90%; margin: auto; margin-top: 1rem">{{ panelTitle }}</h3>

    <InformationPanelWrapper
      ref="panel"
      :asset-id="$route.params.asset_id"
      :locked="locked"
      :panel="panel"
      :edit-mode="editMode"
      :filter="effectiveFilterSettings"
      :panel-settings="settings"
    />
    <div style="margin-left: 1rem; margin-top: 2rem">
      <ParsedDateFilter :key="parsedFilterRefresh" :filter="effectiveFilterSettings" />
    </div>
    <!-- <Card style="width: 90%; margin: auto; margin-top: 1rem">
      <template #content>
        todo make own card component -->
    <BasicFilterSettings
      v-if="false"
      class="ren-card"
      :setting-key="'private'"
      :submit-button="false"
      :columns="3"
      :labels="false"
      @update="reloadSettings()"
    />
    <!-- </template>
</Card> -->
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
  <!-- <RenSettingsDialog ref="settingsDialog">
    <template #settings><PanelSettings @update="reloadSettings()"></PanelSettings></template>
  </RenSettingsDialog> -->
  <RenSettingsDialog ref="conversionSettingsDialog">
    <template #settings>
      <ConversionSettings @update="reloadSettings()"></ConversionSettings>
    </template>
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
          <!-- {{ $store.getters["settings/filters"]("private") }} -->
          <BasicFilterSettings :setting-key="'private'" @update="reloadSettings()" />
          <!-- <PanelSettings @update="reloadPanelSettings()"> </PanelSettings> -->
        </template>
      </Card>
    </template>
  </RenSettingsDialog>
</template>
<script>
import InformationPanelWrapper from "@/components/dashboard/informationpanel/InformationPanelWrapper.vue";
import { getCleanPanelStructure } from "@/components/dashboard/informationpanel/InformationPanelForm.vue";
import DotMenu from "@/components/miscellaneous/DotMenu.vue";
import PanelSettings from "@/components/miscellaneous/settings/PanelSettings.vue";
import BasicFilterSettings from "@/components/miscellaneous/settings/BasicFilterSettings.vue";
import ParsedDateFilter from "@/components/miscellaneous/settings/ParsedDateFilter.vue";
import { panelSchema } from "@/plugins/model/settings.js";
import Settings from "@/components/miscellaneous/settings/Settings.vue";
import ConversionSettings from "@/components/miscellaneous/settings/ConversionSettings.vue";
export default {
  name: "InformationPanelView",
  components: { ConversionSettings, Settings, InformationPanelWrapper, DotMenu, PanelSettings, ParsedDateFilter, BasicFilterSettings },
  data() {
    return {
      schema: panelSchema,
      panel: null,
      locked: false,
      editMode: false,
      settings: this.$store.getters["settings/panel"],
      // filter: this.$store.getters["settings/parsedFilter"]("private"),
      settingsDialog: false,
      parsedFilterRefresh: false,
    };
  },
  computed: {
    effectiveFilterSettings: function () {
      let userFilter = this.$store.getters["settings/filters"]("private");
      let overrideMode = this.effectiveOverrideMode(this.settings, this.panel.props);
      let settings = this.mergeSettings(userFilter, this.panel.props, overrideMode);
      return this.parseDateFiltereDateFilter(settings);
    },
    panelTitle: function () {
      let asset = this.$store.getters["view/panelAsset"](this.panel.id, this.$route.params.asset_id);
      if (asset) {
        let name = asset.label ? asset.label : asset.name;
        return this.$t("view.private_dashboard_title", { asset: name });
      }
      return this.panel.label;
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
    // toggleButton: function () {
    //   let label = this.locked ? this.$t("menu.panel_grid_unlock") : this.$t("menu.panel_grid_lock");
    //   return { label: label, icon: "pi pi-fw pi-lock", command: () => this.toggleLock() };
    // },
    // saveButton: function () {
    //   return { label: this.$t("menu.save_panel_grid"), icon: "pi pi-fw pi-save", command: () => this.saveGrid() };
    // },

    menuModel() {
      return [
        /*this.toggleButton*/ this.settingsButton,
        this.conversionSettingsButton,
        this.filterSettingsButton,
        this.exportTemplateButton,
        this.exportStructureButton,
      ];
    },
    // editModelButton: function () {
    //   let label = this.editMode ? this.$t("menu.panel_grid_edit_on") : this.$t("menu.panel_grid_edit_off");
    //   return { label: label, icon: "pi pi-fw pi-lock", command: () => this.toggleEditMode() };
    // },
    // addButton: function () {
    //   return { label: this.$t("menu.panel_grid_add_tile"), icon: "pi pi-fw pi-plus", command: () => this.addTile() };
    // },
    // menuModel() {
    //   let menu = [
    //     {
    //       label: this.$t("menu.save_panel_grid"),
    //       icon: "pi pi-fw pi-save",
    //       command: () => this.saveGrid(),
    //     },
    //   ]; //TODO: if permission
    //   //todo: add to menu model

    //   menu.push(this.toggleButton);
    //   menu.push(this.addButton);
    //   if (this.locked) menu.push(this.editModelButton);
    //   menu.push(this.settingsButton);
    //   return menu;
    // },
  },
  watch: {},
  async mounted() {
    await this.loadStructure();
  },
  // async updated() {
  //   await this.loadStructure();
  // },

  methods: {
    exportPanel(template) {
      let panelStructure = getCleanPanelStructure(this.panel, template);
      let filename = template ? `template_${this.panel.name}` : `${this.panel.id}_${this.panel.name}`;
      this.$ren.utils.downloadJSON(panelStructure, filename, true);
    },
    async loadStructure() {
      this.panel = await this.$ren.utils.getPanelStructure(this.$route.params.id, this.$route.params.asset_id);
      // if (informationPanel == null) {
      //   this.$ren.dashboardApi.getInformationPanel(this.$route.params.id, this.$route.params.asset_id).then((panel) => {
      //     this.panel = panel;
      //   });
      // } else {
      //   this.panel = informationPanel;
      // }
    },
    reloadSettings() {
      // console.info("reloadSettings");
      // this.$store.getters["settings/filter"];
      // this.filter = this.$store.getters["settings/parsedFilter"]("private");
      this.settings = this.$store.getters["settings/panel"];
      this.conversionSettings = this.$store.getters["settings/conversion"];
      this.parsedFilterRefresh = !this.parsedFilterRefresh;
    },

    async toggleLock() {
      this.locked = !this.locked;
    },
    async toggleEditMode() {
      this.editMode = !this.editMode;
    },
    addTile() {
      //TODO: get unique id?
      this.panel.tiles.push({
        // layout: { x: 0, y: 0, h: 3, w: 3 },
        id: this.$ren.utils.uuid(),
        label: null,
        props: { items: [] },
      });
    },

    saveGrid() {
      this.$refs.panel.saveGrid();
    },
  },
};
</script>

<style lang="scss">
#panel-box {
  background: #232526;
  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #232526, #414345);
  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #232526, #414345);
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
</style>
