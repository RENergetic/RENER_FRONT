<template>
  <div>
    <div v-if="panel">
      <Button
        id="menu-toggle"
        :style="'float: right'"
        :class="'p-button-rounded p-button-text ' + position"
        aria-haspopup="true"
        aria-controls="overlay_menu"
        icon="pi pi-ellipsis-v"
        @click="toggle"
      />
      <div class="grid-stack">
        <InformationTile v-for="tile in tiles" :key="tile.id" :tile="tile" />
      </div>
      <div class="grid-stack">
        <test-component
          v-for="widget in tiles"
          :key="widget.id"
          :widget="widget"
        />
      </div>
    </div>

    <!--  <div class="p-grid">
   <div>
        
      </div>
    </div> -->
    <!-- 
    <div class="grid-stack">
      <div v-for="tile in tiles" :key="tile.id">
        <div class="grid-stack-item">
          <div class="grid-stack-item-content">
          <InformationTile :tile="tile"></InformationTile>  
          </div>
        </div>
      </div>
    </div> -->
    <!-- <div class="grid-stack">
      <div
        v-for="tile in tiles"
        :key="tile.id"
        :class="'grid-stack-item'"
        :gs-w="gridWidth(tile)"
      >
        <div class="grid-stack-item-content">Item 2 wider</div>
      </div>
    </div> -->
  </div>
</template>
<script>
import InformationTile from "../../components/dashboard/InformationTile.vue";
// import TestComponent from "../../components/dashboard/TestComponent.vue";
import { GridStack } from "gridstack";
// THEN to get HTML5 drag&drop
import "gridstack/dist/h5/gridstack-dd-native";
import "gridstack/dist/gridstack.min.css";
export default {
  name: "Dashboard",
  components: { InformationTile },
  data() {
    return {
      panel: null,
      grid: null,
    };
  },
  computed: {
    tiles: function () {
      var t = this.panel != null ? this.panel.tiles : [];
      return t;
      // return JSON.parse(JSON.stringify(t));
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
  updated() {
    // console.info(this.tiles);
    if (this.grid != null) this.grid.destroy(false);
    this.grid = GridStack.init({ float: true });
    window.grid = this.grid;
  },
  methods: {
    // tileClass(tile) {
    //   return tile.col == null ? 2 : tile.col;
    // },
    gridWidth(tile) {
      return tile.col == null ? 2 : tile.col;
    },
    toggle() {
      if (this.grid != null) this.grid.disable();
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
