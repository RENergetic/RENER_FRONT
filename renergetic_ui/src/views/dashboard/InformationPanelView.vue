<template>
  <div>
    <div v-if="panel">
      <DotMenu :model="menuModel" />
      <InformationPanel ref="panel" :locked="locked" :panel="panel" :edit-mode="editMode"></InformationPanel>
    </div>
  </div>
</template>
<script>
import InformationPanel from "../../components/dashboard/InformationPanel.vue";
import DotMenu from "../../components/miscellaneous/DotMenu.vue";

export default {
  name: "InformationPanelView",
  components: {
    InformationPanel,
    DotMenu,
  },
  data() {
    return {
      panel: null,
      locked: false,
      editMode: false,
    };
  },
  computed: {
    toggleButton: function () {
      //TODO: if permission
      let label = this.locked ? this.$t("menu.panel_grid_unlock") : this.$t("menu.panel_grid_lock");
      return {
        label: label,
        icon: "pi pi-fw pi-lock",
        command: () => this.toggleLock(),
      };
    },
    editModelButton: function () {
      //TODO: if permission
      //todo: add to menu model
      let label = this.editMode ? this.$t("menu.panel_grid_edit_on") : this.$t("menu.panel_grid_edit_off");
      return {
        label: label,
        icon: "pi pi-fw pi-lock",
        command: () => this.toggleEditMode(),
      };
    },
    addButton: function () {
      //TODO: if permission
      return {
        label: this.$t("menu.panel_grid_add_tile"),
        icon: "pi pi-fw pi-plus",
        command: () => this.addTile(),
      };
    },
    menuModel() {
      return [
        {
          label: this.$t("menu.save_panel_grid"),
          icon: "pi pi-fw pi-save",
          command: () => this.saveGrid(),
        },
        this.toggleButton,
        this.addButton,

        // {
        //   label: this.$t("menu.grid_lock"),
        //   icon: "pi pi-fw pi-lock",
        //   command: () => this.saveGrid(),
        // },
      ];
    },
  },
  watch: {},
  async created() {
    this.$ren.dashboardApi.getInformationPanel(this.$route.params.id).then((panel) => {
      this.panel = panel;
    });
    //todo: catch
  },

  methods: {
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
        title: null,
        items: [],
      });
    },

    saveGrid() {
      this.$refs.panel.saveGrid();
    },
  },
};
</script>

<style lang="scss"></style>
