<template>
  <div v-if="panel" id="panel-box">
    <DotMenu :model="menuModel" />
    <BasicFilterSettings
      style="width: 90%; margin: auto; margin-top: 1rem"
      class="ren-card"
      :setting-key="'private'"
      :submit-button="false"
      :columns="3"
      :labels="false"
      @update="reloadSettings()"
    />

    <InformationPanelWrapper
      ref="panel"
      :asset-id="$route.params.asset_id"
      :locked="locked"
      :panel="panel"
      :edit-mode="editMode"
      :filter="filter"
      :panel-settings="settings"
    />
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
    <template #settings><PanelSettings @update="reloadSettings()"></PanelSettings></template>
  </RenSettingsDialog>
  <RenSettingsDialog ref="conversionSettingsDialog">
    <template #settings><ConversionSettings @update="reloadSettings()"></ConversionSettings></template>
  </RenSettingsDialog>
  <RenSettingsDialog ref="filterSettingsDialog" :save="false">
    <template #settings><BasicFilterSettings :setting-key="'private'" @update="reloadSettings()" /></template>
  </RenSettingsDialog>
</template>
<script>
import InformationPanelWrapper from "@/components/dashboard/informationpanel/InformationPanelWrapper.vue";
import DotMenu from "@/components/miscellaneous/DotMenu.vue";
import PanelSettings from "@/components/miscellaneous/settings/PanelSettings.vue";
import BasicFilterSettings from "@/components/miscellaneous/settings/BasicFilterSettings.vue";

export default {
  name: "InformationPanelView",
  components: {
    InformationPanelWrapper,
    DotMenu,
    PanelSettings,
    BasicFilterSettings,
  },
  data() {
    return {
      panel: null,
      locked: false,
      editMode: false,
      settings: this.$store.getters["settings/panel"],
      filter: this.$store.getters["settings/parsedFilter"]("private"),
      settingsDialog: false,
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
    // toggleButton: function () {
    //   let label = this.locked ? this.$t("menu.panel_grid_unlock") : this.$t("menu.panel_grid_lock");
    //   return { label: label, icon: "pi pi-fw pi-lock", command: () => this.toggleLock() };
    // },
    // saveButton: function () {
    //   return { label: this.$t("menu.save_panel_grid"), icon: "pi pi-fw pi-save", command: () => this.saveGrid() };
    // },

    menuModel() {
      return [/*this.toggleButton*/ this.settingsButton, this.conversionSettingsButton, this.filterSettingsButton];
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
    async loadStructure() {
      let informationPanel = this.$ren.utils.localPanel(this.$route.params.id, this.$route.params.asset_id);
      if (informationPanel == null) {
        this.$ren.dashboardApi.getInformationPanel(this.$route.params.id, this.$route.params.asset_id).then((panel) => {
          this.panel = panel;
        });
      } else {
        this.panel = informationPanel;
      }
    },
    reloadSettings() {
      // console.info("reloadSettings");
      // this.$store.getters["settings/filter"];
      this.filter = this.$store.getters["settings/parsedFilter"]("private");
      this.settings = this.$store.getters["settings/panel"];
      this.conversionSettings = this.$store.getters["settings/conversion"];
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
  background: #232526; /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #232526, #414345); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #232526, #414345); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
</style>
