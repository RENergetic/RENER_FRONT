<template>
  <div>
    <DotMenu :model="menuModel" :fixed="true" />
    <Dialog
      v-model:visible="settingsDialog"
      :style="{ width: '50vw' }"
      :maximizable="true"
      :modal="true"
      :dismissable-mask="true"
      @hide="reload"
    >
      <HomeSettings @update="reloadSettings()"></HomeSettings>
    </Dialog>

    <div class="home-grid-stack grid-stack">
      <div v-if="settings.demandVisibility" :class="'grid-stack-item ren'" v-bind="getLayout('demandTile')">
        <DemandList :class="'grid-stack-item-content'" />
      </div>
      <div v-if="settings.feedbackVisibility" :class="'grid-stack-item ren'" v-bind="getLayout('feedbackTile')">
        <Card :class="'grid-stack-item-content'">
          <Feedback></Feedback>
        </Card>
      </div>

      <div v-if="settings.notificationVisibility" :class="'grid-stack-item ren'" v-bind="getLayout('notificationTile')">
        <Card :class="'grid-stack-item-content'">
          <NotificationList></NotificationList>
        </Card>
      </div>
      <div
        v-if="settings.selectedPanel"
        :class="'grid-stack-item ren'"
        style="background: transparent"
        v-bind="getLayout('panelTile')"
      >
        <div class="grid-stack-item-content" sty>
          <InformationPanel
            v-if="loaded && panel != null"
            ref="panel"
            :panel="panel"
            :edit-mode="false"
            style="background: transparent"
          ></InformationPanel>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DotMenu from "../components/miscellaneous/DotMenu.vue";
import HomeSettings from "../components/miscellaneous/settings/HomeSettings.vue";
import Feedback from "../components/user/Feedback.vue";
import NotificationList from "../components/dashboard/area/NotificationList.vue";
import InformationPanel from "../components/dashboard/InformationPanel.vue";
import DemandList from "../components/user/demand/DemandList.vue";

import { GridStack } from "gridstack";
// THEN to get HTML5 drag&drop
import "gridstack/dist/h5/gridstack-dd-native";
import "gridstack/dist/gridstack.min.css";

export default {
  name: "Home",
  components: {
    DotMenu,
    DemandList,
    HomeSettings,
    InformationPanel,
    NotificationList,
    Feedback,
  },
  data() {
    return {
      demand: { msg: "increase bla blah blah", icon: "battery", up: true, description: "description" },
      loaded: false,
      grid: null,
      panel: null,
      locked: true,
      editTile: null,
      editDialog: false,
      notifiationDialog: false,
      manageSensorsDialog: false,
      settingsDialog: false,
      settingsChange: false,
      settings: this.$store.getters["settings/home"],
      layout: this.$store.getters["settings/homeLayout"],
    };
  },
  computed: {
    toggleButton: function () {
      //TODO: if permission
      let label = this.locked ? this.$t("menu.grid_unlock") : this.$t("menu.grid_lock");
      return {
        label: label,
        icon: "pi pi-fw pi-lock",
        command: () => this.toggleLock(),
      };
    },
    saveButton: function () {
      return {
        label: this.$t("menu.save_grid"),
        icon: "pi pi-fw pi-plus-circle",
        command: () => this.saveGrid(),
      };
    },

    settingsButton: function () {
      //TODO: set icon
      return {
        label: this.$t("menu.settings"),
        icon: "pi pi-fw pi-plus-circle",
        command: () => (this.settingsDialog = !this.settingsDialog),
      };
    },

    menuModel() {
      let model = [];
      if (!this.locked) model.push(this.saveButton);
      model.push(this.toggleButton);
      model.push(this.settingsButton);
      return model;
    },
  },

  watch: {},
  async created() {
    // todo: get id from session storage
    this.loaded = false;

    // console.info(this.$ren.dashboardApi);
    this.getPanel();
    //todo: catch
  },
  async mounted() {
    this.setGrid();
    this.getPanel();
  },
  updated() {},
  methods: {
    getLayout(tileId) {
      // console.info(this.tile.layout);
      var layout = this.layout != null ? this.layout[tileId] : null;
      if (layout != null) {
        return {
          id: tileId,
          "gs-id": tileId,
          "gs-x": layout.x,
          "gs-y": layout.y,
          "gs-w": layout.w,
          "gs-h": layout.h,
        };
      }
      return {
        id: tileId,
        "gs-id": tileId,
      };
    },
    async getPanel() {
      if (this.settings.selectedPanel != null) {
        this.panel = await this.$ren.dashboardApi.getInformationPanel(this.settings.selectedPanel);
      } else this.panel = null;
    },
    reload() {
      this.setGrid();
      // if (this.settingsChange) this.settings = this.$store.getters["settings/home"];
      // this.settingsChange = false;
    },
    reloadSettings() {
      // this.settingsChange = true;
    },
    setGrid() {
      this.loaded = false;
      if (this.grid != null) this.grid.destroy(false);
      let grid = GridStack.init({ float: true }, ".home-grid-stack");
      if (this.locked) {
        grid.disable();
      } else {
        grid.enable();
      }
      this.grid = grid;
      window.homeGrid = this.grid;
      this.loaded = true;
    },
    gridWidth(tile) {
      return tile.col == null ? 2 : tile.col;
    },
    async toggleLock() {
      this.locked = !this.locked;
      this.setGrid();
    },

    saveGrid() {
      let nodes = this.grid.getGridItems();

      nodes.forEach((node) => {
        let gridstackNode = node.gridstackNode;
        this.layout[gridstackNode.id] = {
          x: gridstackNode.x,
          y: gridstackNode.y,
          w: gridstackNode.w,
          h: gridstackNode.h,
        };
      });

      this.$store.commit("settings/homeLayout", this.layout);
    },
    viewNotification() {
      //TODO: load here notifications for tile
      this.notifiationDialog = true;
    },
  },
};
</script>

<style lang="scss">
.grid-stack-item {
  margin: 0;
}
.grid-stack-item-content {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #3182ce;
  background-color: #bee3f8;
  font-weight: 600;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
</style>
