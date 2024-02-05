<template>
  <div v-if="panel" id="panel-box" style="max-height:100vh:overflow:hidden;">
    <DotMenu :model="menuModel" />
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
</template>
<script>
// todo ask fullscreen
import InformationPanelWrapper from "@/components/dashboard/informationpanel/InformationPanelWrapper.vue";
import DotMenu from "@/components/miscellaneous/DotMenu.vue";
export default {
  name: "PublicDashboardView",
  components: {
    InformationPanelWrapper,
    DotMenu,
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
    normalViewButton: function () {
      return {
        label: this.$t("menu.normal_view_mode"),
        icon: "pi pi-fw pi-window-minimize",
        command: () => {
          document.exitFullscreen();
          this.$router.push({ name: "PublicDashboardView", params: { id: this.panel.id } });
        },
      };
    },

    menuModel() {
      let menu = [];
      menu.push(this.normalViewButton);
      return menu;
    },
  },
  async mounted() {
    await this.loadStructure();
    document.documentElement.requestFullscreen();
  },
  methods: {
    async loadStructure() {
      this.panel = await this.$ren.utils.getPanelStructure(this.$route.params.id, this.$route.params.asset_id);
    },
    updateFilter() {
      this.filterSettings = this.$store.getters["settings/parsedFilter"]();
    },
  },
};
</script>

<style lang="scss"></style>
