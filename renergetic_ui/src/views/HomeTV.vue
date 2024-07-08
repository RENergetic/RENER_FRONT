<template>
  <DotMenu v-if="loggedIn" :model="menuModel" :fixed="true" />
  <div v-if="panel && homeSettings.panelVisibility" style="position: relative">
    <!-- {{ $store.getters["view/featuredPanels"] }}  -->
    <!-- {{ $store.getters["view/assetPanels"] }}d -->
    <!-- panel: {{ panel.name }}, {{ panel.id }}, {{ assetId }} -->

    <InformationPanelWrapper
      v-if="panel"
      ref="panel"
      :key="panel.id"
      :asset-id="assetId"
      :edit-mode="false"
      :panel="panel"
      :filter="effectiveFilterSettings"
      :auto-reload="autoReload"
      :panel-settings="panelSettings"
    ></InformationPanelWrapper>

    <div v-else style="width: 50rem; max-width: 95vw; margin: auto; padding-top: 5rem">
      <h4 style="width: 100%; margin: auto">{{ $t("view.empty_home_dashboard") }}</h4>
    </div>
  </div>
  <div v-if="homeSettings.demandVisibility && loggedIn">
    <DemandList id="demand-list" />
  </div>
  <div v-if="homeSettings.notificationVisibility && loggedIn">
    <UserNotificationList id="notification-list" />
  </div>
</template>
<script>
import DotMenu from "@/components/miscellaneous/DotMenu.vue";
import UserNotificationList from "@/components/user/NotificationList.vue";
// import SettingsDialog from "@/components/miscellaneous/settings/SettingsDialog.vue";
import InformationPanelWrapper from "@/components/dashboard/informationpanel/InformationPanelWrapper.vue";
import DemandList from "@/components/user/demand/DemandList.vue";
import { RenRoles } from "../plugins/model/Enums.js";
import { DeferredFunction } from "@/plugins/renergetic/utils.js";
import LoopRunner from "@/plugins/utils/loop_runner.js";

export default {
  name: "HomeTV",
  components: {
    DotMenu,
    DemandList,
    UserNotificationList,
    InformationPanelWrapper,
  },
  data() {
    return {
      loaded: false,
      grid: null,
      slideshow: null,
      autoReload: true,
      assetId: null,
      panel: null,
      homeSettings: this.$store.getters["settings/home"],
      panelSettings: this.$store.getters["settings/panel"],
    };
  },
  computed: {
    effectiveFilterSettings: function () {
      let userFilter = this.$store.getters["settings/filters"]();
      let overrideMode = this.effectiveOverrideMode(this.homeSettings, this.panel.props);
      let settings = this.mergeSettings(userFilter, this.panel.props, overrideMode);
      return this.parseDateFilter(settings);
    },
    loggedIn: function () {
      return this.$store.getters["auth/isAuthenticated"];
    },
    hasAccess: function () {
      return (this.$store.getters["auth/renRole"] | RenRoles.REN_ADMIN) > 0;
    },
    normalViewButton: function () {
      return {
        label: this.$t("menu.normal_view_mode"),
        icon: "pi pi-fw pi-window-minimize",
        command: () => {
          document.exitFullscreen();
          this.$router.push({ name: "Home" });
        },
      };
    },

    menuModel() {
      let model = [];
      model.push(this.normalViewButton);
      return model;
    },
  },
  watch: {},
  async created() {
    this.loaded = false;
  },
  async mounted() {
    let panel = null;
    if (this.homeSettings.homePanel) {
      panel = await this.$ren.utils.getPanelStructure(this.homeSettings.homePanel, null, true);
    }
    this.panel = panel ? panel : this.$store.getters["view/defaultHomePanel"];
    var df = new DeferredFunction(this.slideshowLoop, 1000);
    df.run();
    document.documentElement.requestFullscreen();
  },
  beforeUnmount() {
    if (this.slideshow) {
      this.slideshow.stop();
    }
  },
  methods: {
    async slideshowLoop() {
      let _this = this;
      let f = async () => {
        let panelDetails = await _this.$store.dispatch("slideshow/next");
        // console.error(panelDetails);
        if (panelDetails) {
          _this.autoReload = false;
          let panel = await _this.$ren.utils.getPanelStructure(panelDetails.panelId, panelDetails.assetId, true);
          _this.assetId = panelDetails.assetId;
          _this.panel = panel;
        } else {
          _this.autoReload = true;
        }
      };
      if (this.homeSettings.slideshowLoopInterval > 0) {
        this.slideshow = LoopRunner.init(f, this.homeSettings.slideshowLoopInterval);
        this.slideshow.start();
      } else {
        if (this.slideshow) {
          this.slideshow.stop();
        }
        this.slideshow = null;
      }
    },
    reloadSettings() {
      this.homeSettings = this.$store.getters["settings/home"];
    },
    updateFilter() {
      if (this.slideshow) {
        this.slideshow.reset();
      }
    },
    reloadPanelSettings() {
      this.panelSettingsDialog = this.$store.getters["settings/panel"];
    },
  },
};
</script>

<style lang="scss">
#notification-list,
#demand-list {
  width: 60rem;
  max-width: 90vw;
  margin: auto;
  position: relative;
}
</style>
