<template>
  <DotMenu v-if="loggedIn" :model="menuModel" :fixed="true" />
  <!-- {{ effectiveFilterSettings }} -->
  <div v-if="homeSettings.panelVisibility" style="position: relative">
    <!-- {{ $store.getters["view/featuredPanels"] }}  -->
    <!-- {{ panelSettings }} -->

    <InformationPanelWrapper
      v-if="panel"
      ref="panel"
      :key="panel.id"
      :asset-id="assetId"
      :locked="locked"
      :edit-mode="false"
      :panel="panel"
      :filter="effectiveFilterSettings"
      :auto-reload="autoReload"
      :panel-settings="panelSettings"
    ></InformationPanelWrapper>

    <div v-else style="width: 50rem; max-width: 95vw; margin: auto; padding-top: 5rem">
      <h4 style="width: 100%; margin: auto">{{ $t("view.empty_home_dashboard") }}</h4>
    </div>
    <div style="margin-left: 1rem; margin-top: 2rem">
      <ParsedDateFilter :key="parsedFilterRefresh" :filter="effectiveFilterSettings" />
    </div>
  </div>
  <div v-if="homeSettings.demandVisibility && loggedIn" style="position: relative">
    <DemandList id="demand-list" />
  </div>
  <div v-if="homeSettings.notificationVisibility && loggedIn" style="position: relative">
    <NotificationList id="notification-list" />
  </div>
  <RoleMatrix v-if="false" />
  <RenSettingsDialog ref="homeSettingsDialog">
    <template #settings>
      <HomeSettings @update="reloadHomeSettings()"></HomeSettings>
    </template>
  </RenSettingsDialog>
  <RenSettingsDialog ref="panelSettingsDialog">
    <template #settings>
      <Panel toggleable class="ren-settings">
        <template #header>
          <span> {{ $t("view.panel_effective_settings") }}:</span>
        </template>
        <Settings :schema="schema" :settings="effectivePanelSettings" :disabled="true" />
      </Panel>

      <!-- <Card class="ren-settings">
        <template #title>
          <span> {{ $t("view.panel_effective_settings") }}:</span>
        </template>
        <template #content>
          <Settings :schema="schema" :settings="effectivePanelSettings" :disabled="true" />
        </template>
      </Card> -->
      <!-- <Card class="ren-settings">
        <template #title>
          <span> {{ $t("view.panel_settings") }}:</span>
        </template>
        <template #content>
          <Settings :schema="schema" :settings="panel.props" :disabled="true" />
        </template>
      </Card> -->
      <Panel toggleable class="ren-settings">
        <template #header>
          <span> {{ $t("view.panel_settings") }}:</span>
        </template>
        <Settings :schema="schema" :settings="panel.props" :disabled="true" />
      </Panel>
      <Panel toggleable class="ren-settings">
        <template #header>
          <span> {{ $t("view.panel_user_settings") }}:</span>
        </template>
        <PanelSettings @update="reloadPanelSettings()"> </PanelSettings>
      </Panel>
      <!-- <Card class="ren-settings">
        <template #title>
          <span> {{ $t("view.panel_user_settings") }}:</span>
        </template>
        <template #content>
          <PanelSettings @update="reloadPanelSettings()"> </PanelSettings>
        </template>
      </Card> -->
    </template>
  </RenSettingsDialog>
  <!-- <RenSettingsDialog ref="panelSettingsDialog">
    <template #settings><PanelSettings @update="reloadPanelSettings()"></PanelSettings></template>
  </RenSettingsDialog> -->
  <RenSettingsDialog ref="conversionSettingsDialog">
    <template #settings>
      <ConversionSettings @update="reloadPanelSettings()"></ConversionSettings>
    </template>
  </RenSettingsDialog>
  <RenSettingsDialog ref="filterSettingsDialog" :save="false">
    <template #settings>
      <Card v-if="panel" class="ren-settings">
        <template #title>
          <span> {{ $t("view.panel_effective_filter_settings") }}:</span>
        </template>
        <template #content>
          <BasicFilterSettings :settings="effectiveFilterSettings" :submit-button="false" :disabled="true" />
          <!-- <Settings :schema="schema" :settings="effectiveFilterSettings" :disabled="true" /> -->
        </template>
      </Card>
      <Card v-if="panel" class="ren-settings">
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
        </template>
      </Card>
    </template>
  </RenSettingsDialog>
  <div v-if="$refs.panelSettingsDialog">{{ $refs.panelSettingsDialog.settingsDialog }}</div>
</template>
<script>
import DotMenu from "@/components/miscellaneous/DotMenu.vue";
import HomeSettings from "@/components/miscellaneous/settings/HomeSettings.vue";
import RoleMatrix from "@/components/miscellaneous/settings/RoleMatrix.vue";
import NotificationList from "@/components/user/NotificationList.vue";
// import SettingsDialog from "@/components/miscellaneous/settings/SettingsDialog.vue";
import PanelSettings from "@/components/miscellaneous/settings/PanelSettings.vue";
import InformationPanelWrapper from "@/components/dashboard/informationpanel/InformationPanelWrapper.vue";
import DemandList from "@/components/user/demand/DemandList.vue";
import BasicFilterSettings from "@/components/miscellaneous/settings/BasicFilterSettings.vue";
import ParsedDateFilter from "@/components/miscellaneous/settings/ParsedDateFilter.vue";
import ConversionSettings from "@/components/miscellaneous/settings/ConversionSettings.vue";

import { panelSchema } from "@/plugins/model/settings.js";
import Settings from "@/components/miscellaneous/settings/Settings.vue";
import { DeferredFunction } from "@/plugins/renergetic/utils.js";
import LoopRunner from "@/plugins/utils/loop_runner.js";

export default {
  name: "Home",
  components: {
    Settings,
    DotMenu,
    RoleMatrix,
    ConversionSettings,
    DemandList,
    HomeSettings,
    PanelSettings,
    NotificationList,
    InformationPanelWrapper,
    ParsedDateFilter,
    BasicFilterSettings,
  },
  props: {},
  data() {
    console.debug(this.$store.getters["settings/home"]);
    return {
      schema: panelSchema,
      loaded: false,
      grid: null,
      locked: true,
      slideshow: null,
      autoReload: true,
      assetId: null,
      panel: null,
      homeSettings: this.$store.getters["settings/home"],
      // filter: this.$store.getters["settings/parsedFilter"](),
      panelSettings: this.$store.getters["settings/panel"],
      parsedFilterRefresh: false,
    };
  },
  computed: {
    effectivePanelSettings: function () {
      return this.computePanelSettings(this.panelSettings, this.panel);
    },
    effectiveFilterSettings: function () {
      if (!this.panel) {
        return {};
      }
      let userFilter = this.$store.getters["settings/filters"]();
      let overrideMode = this.panel.props && this.panel.props.overrideMode ? this.panel.props.overrideMode : null;
      let settings = this.mergeSettings(userFilter, this.panel.props, overrideMode);
      return this.parseDateFilter(settings);
    },

    loggedIn: function () {
      return this.$store.getters["auth/isAuthenticated"];
    },
    hasAccess: function () {
      return (this.$store.getters["auth/renRole"] | this.RenRoles.REN_ADMIN) > 0;
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
    filterSettingsButton: function () {
      return { label: this.$t("menu.filter_settings"), icon: "pi pi-fw pi-filter", command: () => this.$refs.filterSettingsDialog.open() };
    },
    fullScreenButton: function () {
      return {
        label: this.$t("menu.tv_view_mode"),
        icon: "pi pi-fw pi-window-maximize",
        command: () => {
          this.$router.push({ name: "HomeTV" });
        },
      };
    },

    conversionSettingsButton: function () {
      return {
        label: this.$t("menu.unit_settings"),
        icon: "pi pi-fw pi-cog",
        command: () => this.$refs.conversionSettingsDialog.open(),
      };
    },
    settingsButton: function () {
      return {
        label: this.$t("menu.home_settings"),
        icon: "pi pi-fw pi-home",
        command: () => this.$refs.homeSettingsDialog.open(),
      };
    },
    panelSettingsButton: function () {
      return {
        label: this.$t("menu.panel_settings"),
        icon: "pi pi-fw pi-cog",
        command: () => this.$refs.panelSettingsDialog.open(),
      };
    },
    menuModel() {
      let model = [];
      let role = this.$store.getters["auth/renRole"];
      model.push(this.settingsButton);
      if ((role & (this.RenRoles.REN_TECHNICAL_MANAGER | this.RenRoles.REN_MANAGER | this.RenRoles.REN_ADMIN)) > 0) {
        model.push(this.panelSettingsButton);
        model.push(this.conversionSettingsButton);
        model.push(this.filterSettingsButton);
      }
      model.push(this.fullScreenButton);
      return model;
    },
  },
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
          let panel = await _this.$ren.utils.getPanelStructure(panelDetails.panelId, panelDetails.assetId);
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

    reloadHomeSettings() {
      this.homeSettings = this.$store.getters["settings/home"];
    },
    updateFilter() {
      this.parsedFilterRefresh = !this.parsedFilterRefresh;
      if (this.slideshow) {
        this.slideshow.reset();
      }
    },
    reloadPanelSettings() {
      this.panelSettingsDialog = this.$store.getters["settings/panel"];
      this.conversionSettings = this.$store.getters["settings/conversion"];
      this.parsedFilterRefresh = !this.parsedFilterRefresh;
    },
    async toggleLock() {
      this.locked = !this.locked;
    },
  },
};
</script>

<style scoped lang="scss">
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
</style>
