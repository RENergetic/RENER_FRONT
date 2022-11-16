<template>
  <DotMenu :model="menuModel" :fixed="true" />
  <div style="position: relative">
    <energy-flow v-if="panel" ref="panel" :asset-id="null" :panel="panel" :settings="panelSettings"></energy-flow>
  </div>
  <div style="position: relative">
    <DemandList id="demand-list" />
  </div>
  <!-- {{ ($i18n.locale = locale) }} -->
  locale: {{ $i18n.locale }}
  ...
  {{ $i18n }}
  <!-- <div class="home-grid-stack grid-stack"> -->
  <!-- <div v-if="settings.demandVisibility" :class="'grid-stack-item ren'">
        <DemandList :class="'grid-stack-item-content'" />
      </div> -->

  <!-- <div v-if="settings.notificationVisibility" :class="'grid-stack-item ren'">
        <NotificationList :class="'grid-stack-item-content'"></NotificationList>
      </div> -->
  <!-- </div> -->
  <Dialog
    v-model:visible="settingsDialog"
    :style="{ width: '50vw' }"
    :maximizable="true"
    :modal="true"
    :dismissable-mask="true"
    @hide="reload"
  >
    <!--  @update="onSettingsUpdate()" -->
    <HomeSettings @update="reloadSettings()"></HomeSettings>
  </Dialog>
  <Dialog
    v-model:visible="panelSettingsDialog"
    :style="{ width: '50vw' }"
    :maximizable="true"
    :modal="true"
    :dismissable-mask="true"
    @hide="reload"
  >
    <!--  @update="onSettingsUpdate()" -->
    <PanelSettings @update="reloadPanelSettings()"></PanelSettings>
  </Dialog>
</template>
<script>
import DotMenu from "@/components/miscellaneous/DotMenu.vue";
import HomeSettings from "@/components/miscellaneous/settings/HomeSettings.vue";
import PanelSettings from "@/components/miscellaneous/settings/PanelSettings.vue";
import EnergyFlow from "@/components/dashboard/EnergyFlow.vue";
import DemandList from "@/components/user/demand/DemandList.vue";
import { RenRoles } from "../plugins/model/Enums.js";
// import { GridStack } from "gridstack";
// import "gridstack/dist/h5/gridstack-dd-native";
// import "gridstack/dist/gridstack.min.css";

export default {
  name: "Home",
  components: {
    DotMenu,
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
      settingsDialog: false,
      panelSettingsDialog: false,
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
      };
    },
    // saveButton: function () {
    //   return {
    //     label: this.$t("menu.save_grid"),
    //     icon: "pi pi-fw pi-plus-circle",
    //     command: () => this.saveGrid(),
    //   };
    // },
    settingsButton: function () {
      //TODO: set icon
      return {
        label: this.$t("menu.settings"),
        icon: "pi pi-fw pi-plus-circle",
        command: () => (this.settingsDialog = !this.settingsDialog),
      };
    },
    panelSettingsButton: function () {
      //TODO: set icon
      return {
        label: this.$t("menu.panel_settings"),
        icon: "pi pi-fw pi-plus-circle",
        command: () => (this.panelSettingsDialog = !this.panelSettingsDialog),
      };
    },
    menuModel() {
      let model = [];
      // if (!this.locked) model.push(this.saveButton);
      model.push(this.toggleButton);
      model.push(this.settingsButton);
      model.push(this.panelSettingsButton);
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
