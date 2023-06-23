<template>
  <div v-if="panel" id="panel-box">
    <DotMenu :model="menuModel" />
    <!-- {{ filterSettings }} -->
    <InformationPanelWrapper
      ref="panel"
      :asset-id="$route.params.asset_id"
      :locked="locked"
      :panel="panel"
      :edit-mode="false"
      :panel-settings="settings"
      :filter="filterSettings"
    ></InformationPanelWrapper>
  </div>
  <RenSettingsDialog ref="settingsDialog">
    <template #settings><PanelSettings @update="reloadSettings()"></PanelSettings></template>
  </RenSettingsDialog>
  <RenSettingsDialog ref="conversionSettingsDialog">
    <template #settings><ConversionSettings @update="reloadSettings()"></ConversionSettings></template>
  </RenSettingsDialog>
  <RenSettingsDialog ref="filterSettingsDialog" :save="false">
    <template #settings><FilterSettings @update="updateFilter()"></FilterSettings></template>
  </RenSettingsDialog>
</template>
<script>
import InformationPanelWrapper from "@/components/dashboard/informationpanel/InformationPanelWrapper.vue";
import DotMenu from "@/components/miscellaneous/DotMenu.vue";
import PanelSettings from "@/components/miscellaneous/settings/PanelSettings.vue";
import ConversionSettings from "@/components/miscellaneous/settings/ConversionSettings.vue";
import FilterSettings from "@/components/miscellaneous/settings/FilterSettings.vue";
export default {
  name: "PublicDashboardView",
  components: {
    InformationPanelWrapper,
    FilterSettings,
    DotMenu,
    PanelSettings,
    // NotificationList,
    ConversionSettings,
  },
  data() {
    return {
      panel: null,
      // locked: false,
      notifications: [],
      settings: this.$store.getters["settings/panel"],
      filterSettings: this.$store.getters["settings/parsedFilter"](),
      settingsDialog: false,
      filterSettingsDialog: false,
      conversionSettingsDialog: false,
    };
  },
  computed: {
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
      return menu;
    },
  },
  async mounted() {
    await this.loadStructure();
  },
  methods: {
    async loadStructure() {
      this.panel = await this.$ren.utils.getPanelStructure(this.$route.params.id, this.$route.params.asset_id);
    },
    updateFilter() {
      this.filterSettings = this.$store.getters["settings/parsedFilter"]();
    },
    reloadSettings() {
      this.filterSettings = this.$store.getters["settings/parsedFilter"]();
      this.settings = this.$store.getters["settings/panel"];
      this.conversionSettings = this.$store.getters["settings/conversion"];
    },
  },
};
</script>

<style lang="scss"></style>
