<template>
  <div v-if="panel" id="panel-box">
    <DotMenu :model="menuModel" />

    <!-- <NotificationList v-if="settings.notificationVisibility" :notifications="notifications"></NotificationList> -->

    <energy-flow
      v-if="panel"
      :key="reload"
      :asset-id="$route.params.asset_id"
      :panel="panel"
      :settings="settings"
    ></energy-flow>
  </div>
  <!--dialogs -->
  <div>
    <SettingsDialog ref="settingsDialog">
      <template #settings><PanelSettings @update="reloadSettings()"></PanelSettings></template>
    </SettingsDialog>
    <SettingsDialog ref="conversionSettingsDialog">
      <template #settings><ConversionSettings @update="reloadSettings()"></ConversionSettings></template>
    </SettingsDialog>
    <SettingsDialog ref="filterSettingsDialog" :save="false">
      <template #settings><FilterSettings @update="reloadSettings()"></FilterSettings></template>
    </SettingsDialog>
  </div>
</template>
<script>
import EnergyFlow from "@/components/dashboard/EnergyFlow.vue";
import DotMenu from "@/components/miscellaneous/DotMenu.vue";
import PanelSettings from "@/components/miscellaneous/settings/PanelSettings.vue";
import SettingsDialog from "@/components/miscellaneous/settings/SettingsDialog.vue";
import ConversionSettings from "@/components/miscellaneous/settings/ConversionSettings.vue";
import FilterSettings from "@/components/miscellaneous/settings/FilterSettings.vue";
// import NotificationList from "@/components/management/notification/NotificationList.vue";
// import { RenRoles } from "@/plugins/model/Enums";
export default {
  name: "EnergyFlowView",
  components: {
    EnergyFlow,
    FilterSettings,
    SettingsDialog,
    DotMenu,
    PanelSettings,
    // NotificationList,
    ConversionSettings,
  },
  data() {
    return {
      reload: false,
      panel: null,
      // locked: false,
      notifications: [],
      settings: this.$store.getters["settings/panel"],
      settingsDialog: false,
      filterSettingsDialog: false,
      conversionSettingsDialog: false,
    };
  },
  computed: {
    settingsButton: function () {
      //TODO: set icon
      return {
        label: this.$t("menu.panel_settings"),
        icon: "pi pi-fw pi-plus-circle",
        command: () => this.$refs.settingsDialog.open(),
      };
    },
    conversionSettingsButton: function () {
      //TODO: set icon
      return {
        label: this.$t("menu.unit_settings"),
        icon: "pi pi-fw pi-plus-circle",
        command: () => this.$refs.conversionSettingsDialog.open(),
      };
    },

    filterSettingsButton: function () {
      //TODO: set icon
      return {
        label: this.$t("menu.filter_settings"),
        icon: "pi pi-fw pi-filter",
        command: () => this.$refs.filterSettingsDialog.open(),
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
      return menu;
    },
  },
  async mounted() {
    // if (
    //   this.settings.notificationVisibility &&
    //   (RenRoles.REN_ADMIN |
    //     RenRoles.REN_USER |
    //     RenRoles.REN_MANAGER |
    //     RenRoles.REN_TECHNICAL_MANAGER |
    //     RenRoles.REN_STAFF) &
    //     this.$store.getters["auth/renRole"]
    // ) {
    //   this.notifications = await this.$ren.userApi.getNotifications();
    // }

    await this.loadStructure();
  },
  async updated() {
    await this.loadStructure();
  },

  methods: {
    localPanel(id, assetId) {
      console.error("asset panels templates not supported: " + assetId);
      let index = this.$store.getters["view/informationPanelsMap"][id];
      if (index != null) {
        return this.$store.getters["view/informationPanels"][index];
      }
      return null;
    },
    async loadStructure() {
      let informationPanel = this.localPanel(this.$route.params.id, this.$route.params.asset_id);
      if (informationPanel == null) {
        this.$ren.dashboardApi.getInformationPanel(this.$route.params.id, this.$route.params.asset_id).then((panel) => {
          this.panel = panel;
        });
      } else {
        this.panel = informationPanel;
      }
    },
    reloadSettings() {
      this.filterSettings = this.$store.getters["settings/filter"];
      this.settings = this.$store.getters["settings/panel"];
      this.conversionSettings = this.$store.getters["settings/conversion"];
    },
    reloadView() {
      this.reload = !this.reload;
    },
  },
};
</script>

<style lang="scss">
#panel-box {
  background: #232526; /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #232526, #414345); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #232526,
    #414345
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
</style>
