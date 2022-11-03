<template>
  <div id="panel-box">
    <div v-if="panel">
      <DotMenu :model="menuModel" />
      <Dialog
        v-model:visible="settingsDialog"
        :style="{ width: '50vw' }"
        :maximizable="true"
        :modal="true"
        :dismissable-mask="true"
      >
        <PanelSettings @update="reloadSettings()"></PanelSettings>
      </Dialog>

      <energy-flow
        v-if="panel"
        ref="panel"
        :asset-id="$route.params.asset_id"
        :panel="panel"
        :edit-mode="editMode"
        :settings="settings"
      ></energy-flow>
    </div>
  </div>
</template>
<script>
import EnergyFlow from "@/components/dashboard/EnergyFlow.vue";
import DotMenu from "@/components/miscellaneous/DotMenu.vue";
import PanelSettings from "@/components/miscellaneous/settings/PanelSettings.vue";

export default {
  name: "InformationPanelView",
  components: {
    EnergyFlow,
    DotMenu,
    PanelSettings,
  },
  data() {
    return {
      panel: null,
      locked: false,
      editMode: false,
      settings: this.$store.getters["settings/panel"],
      settingsDialog: false,
    };
  },
  computed: {
    settingsButton: function () {
      //TODO: set icon
      return {
        label: this.$t("menu.settings"),
        icon: "pi pi-fw pi-plus-circle",
        command: () => (this.settingsDialog = !this.settingsDialog),
      };
    },

    menuModel() {
      let menu = [
        {
          label: this.$t("menu.save_panel_grid"),
          icon: "pi pi-fw pi-save",
          command: () => this.saveGrid(),
        },
      ]; //TODO: if permission
      menu.push(this.settingsButton);
      return menu;
    },
  },
  async mounted() {
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
      // console.info(informationPanel);
      if (informationPanel == null) {
        this.$ren.dashboardApi.getInformationPanel(this.$route.params.id, this.$route.params.asset_id).then((panel) => {
          this.panel = panel;
        });
      } else {
        this.panel = informationPanel;
      }
    },
    reloadSettings() {
      this.settings = this.$store.getters["settings/panel"];
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
