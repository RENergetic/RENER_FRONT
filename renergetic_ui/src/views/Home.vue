<template>
  <DotMenu :model="menuModel" :fixed="true" />
  <div style="position: relative">
    <energy-flow v-if="panel" ref="panel" :asset-id="null" :panel="panel" :settings="panelSettings"></energy-flow>
  </div>
  <div v-if="settings.demandVisibility" style="position: relative">
    <DemandList id="demand-list" />
  </div>

  <RenSettingsDialog ref="homeSettingsDialog">
    <!--  @update="onSettingsUpdate()" -->
    <template #settings><HomeSettings @update="reloadSettings()"></HomeSettings></template>
  </RenSettingsDialog>
  <RenSettingsDialog ref="panelSettingsDialog">
    <!--  @update="onSettingsUpdate()" -->
    <template #settings><PanelSettings @update="reloadPanelSettings()"></PanelSettings></template>
  </RenSettingsDialog>
  <RenSettingsDialog ref="conversionSettingsDialog">
    <template #settings><ConversionSettings @update="reloadSettings()"></ConversionSettings></template>
  </RenSettingsDialog>
  <RenSettingsDialog ref="filterSettingsDialog" :save="false">
    <template #settings><FilterSettings @update="reloadSettings()"></FilterSettings></template>
  </RenSettingsDialog>
  <div v-if="$refs.panelSettingsDialog">{{ $refs.panelSettingsDialog.settingsDialog }}</div>
</template>
<script>
import DotMenu from "@/components/miscellaneous/DotMenu.vue";
import HomeSettings from "@/components/miscellaneous/settings/HomeSettings.vue";
// import SettingsDialog from "@/components/miscellaneous/settings/SettingsDialog.vue";
import PanelSettings from "@/components/miscellaneous/settings/PanelSettings.vue";
import EnergyFlow from "@/components/dashboard/EnergyFlow.vue";
import DemandList from "@/components/user/demand/DemandList.vue";
import FilterSettings from "@/components/miscellaneous/settings/FilterSettings.vue";
import ConversionSettings from "@/components/miscellaneous/settings/ConversionSettings.vue";
import { RenRoles } from "../plugins/model/Enums.js";

export default {
  name: "Home",
  components: {
    // SettingsDialog,
    DotMenu,
    FilterSettings,
    ConversionSettings,
    DemandList,
    HomeSettings,
    PanelSettings,
    // NotificationList,
    EnergyFlow,
  },
  data() {
    return {
      roles: RenRoles,

      loaded: false,
      grid: null,
      locked: true,
      notifiationDialog: false,
      settingsChange: false,
      settings: this.$store.getters["settings/home"],
      panel: this.$store.getters["view/homePanel"],
      panelSettings: this.$store.getters["settings/panel"],
      // layout: this.$store.getters["settings/homeLayout"],
    };
  },
  computed: {
    hasAccess: function () {
      return (this.$store.getters["auth/renRole"] | RenRoles.REN_ADMIN) > 0;
    },
    toggleButton: function () {
      //TODO: if permission
      let label = this.locked ? this.$t("menu.grid_unlock") : this.$t("menu.grid_lock");
      return {
        label: label,
        icon: "pi pi-fw pi-lock",
        command: () => this.toggleLock(),
        visible: false,
      };
    },
    // saveButton: function () {
    //   return {
    //     label: this.$t("menu.save_grid"),
    //     icon: "pi pi-fw pi-plus-circle",
    //     command: () => this.saveGrid(),
    //   };
    // },
    filterSettingsButton: function () {
      //TODO: set icon
      return {
        label: this.$t("menu.filter_settings"),
        icon: "pi pi-fw pi-filter",
        command: () => this.$refs.filterSettingsDialog.open(),
      };
    },
    conversionSettingsButton: function () {
      //TODO: set icon
      return {
        label: this.$t("menu.unit_settings"),
        icon: "pi pi-fw pi-cog",
        command: () => this.$refs.conversionSettingsDialog.open(),
      };
    },

    settingsButton: function () {
      //TODO: set icon
      return {
        label: this.$t("menu.home_settings"),
        icon: "pi pi-fw pi-home",
        command: () => this.$refs.homeSettingsDialog.open(),
      };
    },
    panelSettingsButton: function () {
      //TODO: set icon
      return {
        label: this.$t("menu.panel_settings"),
        icon: "pi pi-fw pi-cog",
        command: () => this.$refs.panelSettingsDialog.open(),
      };
    },
    menuModel() {
      let model = [];
      // if (!this.locked) model.push(this.saveButton);
      model.push(this.toggleButton);
      model.push(this.settingsButton);
      model.push(this.panelSettingsButton);
      model.push(this.conversionSettingsButton);

      model.push(this.filterSettingsButton);
      return model;
    },
  },
  watch: {},
  async created() {
    this.loaded = false;
  },
  async mounted() {},
  updated() {},
  methods: {
    reloadSettings() {
      this.settings = this.$store.getters["settings/home"];
    },
    reloadPanelSettings() {
      this.panelSettingsDialog = this.$store.getters["settings/panel"];
    },

    async toggleLock() {
      this.locked = !this.locked;
    },

    viewNotification() {
      //TODO: load here notifications for tile
      this.notifiationDialog = true;
    },
  },
};
</script>

<style lang="scss">
#demand-list {
  width: 50rem;
  max-width: 95vw;
  margin: auto;
  color: #3182ce;
}
// .grid-stack-item {
//   margin: 0;
// }
// .grid-stack-item-content {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   color: #3182ce;
//   background-color: #bee3f8;
//   font-weight: 600;
//   box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
// }
</style>
