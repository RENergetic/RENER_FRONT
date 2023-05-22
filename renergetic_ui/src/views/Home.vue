<template>
  <DotMenu v-if="loggedIn" :model="menuModel" :fixed="true" />
  <div v-if="settings.panelVisibility" style="position: relative">
    <InformationPanelWrapper v-if="panel" ref="panel" :locked="locked" :panel="panel" :panel-settings="settings"></InformationPanelWrapper>
    <div v-else style="width: 50rem; max-width: 95vw; margin: auto; padding-top: 5rem">
      <h4 style="width: 100%; margin: auto">{{ $t("view.empty_home_dashboard") }}</h4>
    </div>
  </div>
  <div v-if="settings.demandVisibility && loggedIn" style="position: relative">
    <DemandList id="demand-list" />
  </div>
  <div v-if="settings.notificationVisibility" style="position: relative">
    <NotificationList id="notification-list" />
  </div>
  <RoleMatrix v-if="false" />
  <RenSettingsDialog ref="homeSettingsDialog">
    <template #settings><HomeSettings @update="reloadSettings()"></HomeSettings></template>
  </RenSettingsDialog>
  <RenSettingsDialog ref="panelSettingsDialog">
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
import RoleMatrix from "@/components/miscellaneous/settings/RoleMatrix.vue";
import NotificationList from "@/components/management/notification/NotificationList.vue";
// import SettingsDialog from "@/components/miscellaneous/settings/SettingsDialog.vue";
import PanelSettings from "@/components/miscellaneous/settings/PanelSettings.vue";
import InformationPanelWrapper from "@/components/dashboard/informationpanel/InformationPanelWrapper.vue";
import DemandList from "@/components/user/demand/DemandList.vue";
import FilterSettings from "@/components/miscellaneous/settings/FilterSettings.vue";
import ConversionSettings from "@/components/miscellaneous/settings/ConversionSettings.vue";
import { RenRoles } from "../plugins/model/Enums.js";

export default {
  name: "Home",
  components: {
    // SettingsDialog,
    DotMenu,
    RoleMatrix,
    FilterSettings,
    ConversionSettings,
    DemandList,
    HomeSettings,
    PanelSettings,
    NotificationList,
    InformationPanelWrapper,
  },
  data() {
    return {
      loaded: false,
      grid: null,
      locked: true,
      settings: this.$store.getters["settings/home"],
      panel: this.$store.getters["view/homePanel"],
      // panelSettings: this.$store.getters["settings/panel"],
    };
  },
  computed: {
    loggedIn: function () {
      return this.$store.getters["auth/isAuthenticated"];
    },
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
      let role = this.$store.getters["auth/renRole"];

      // model.push(this.toggleButton);
      model.push(this.settingsButton);
      if ((role & (RenRoles.REN_TECHNICAL_MANAGER | RenRoles.REN_MANAGER | RenRoles.REN_ADMIN)) > 0) {
        model.push(this.panelSettingsButton);
        model.push(this.conversionSettingsButton);
        model.push(this.filterSettingsButton);
      }

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
#notification-list {
  width: 50rem;
  max-width: 95vw;
  margin: auto;
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
