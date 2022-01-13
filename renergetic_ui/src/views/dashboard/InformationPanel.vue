<template>
  <div v-if="panel != null" class="p-grid">
    <div v-for="tile in panel.tiles" :key="tile.id" :class="tileClass(tile)">
      <InformationTile :tile="tile"></InformationTile>
    </div>
  </div>
</template>
<script>
// import Carousel from "primevue/carousel";
import InformationTile from "../../components/dashboard/InformationTile.vue";

export default {
  name: "Dashboard",
  components: { InformationTile },
  data() {
    return {
      panel: null,
    };
  },
  computed: {
    dashboardUrl() {
      if (this.dashboard) {
        return this.dashboard.url;
      }
      return null;
    },
    menuModel() {
      if (this.dashboard != null)
        return [
          {
            label: this.$t("menu.delete_dashboard"),
            icon: "pi pi-fw pi-minus-circle",
            command: () => {
              this.$refs.deleteDashboard.delete();
            },
          },
        ];
      return [];
    },
  },
  watch: {},
  async created() {
    this.$ren.dashboardApi
      .getInformationPanel(this.$route.params.id)
      .then((panel) => {
        this.panel = panel;
      });
    //todo: catch
  },
  mounted() {},
  methods: {
    tileClass(tile) {
      return tile.col == null ? 2 : tile.col;
    },
    getColor(item) {
      if (item.id == this.$route.params.dashboard_id) {
        return "color:green";
      }
      return "color:initial";
    },
    createDashboardMenu() {
      if (this.dashboards.length == 0) {
        return [];
      }
      var x = 0;
      if (x >= 1) {
        return [];
      }
      return this.dashboards.map((dashboardItem) => {
        let to = `/dashboard/view/${dashboardItem.id}`;
        return {
          // label: this.$t("menu.group_list"),
          label: dashboardItem.label,
          icon: "pi pi-fw pi-align-left",
          id: dashboardItem.id,
          to: to,
          command: () => {
            this.$router.push(to);
          },
        };
      });
    },
  },
};
</script>

<style lang="scss">
#dashboard-wrapper {
  top: 5vh;
  left: 0;
  position: absolute;
  width: 100%;
  height: 90vh;
}
.ren-dock {
  a {
    text-decoration: none;
    color: grey;
    font-weight: bolder;
    cursor: pointer;
    width: inherit !important;
  }
  .p-dock,
  .p-dock-action {
    height: inherit !important;
  }
  .p-dock-item-current * {
    color: yellow !important;
  }
}
</style>
