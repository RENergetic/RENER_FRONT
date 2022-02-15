<template>
  <div>
    <Button id="sideMenuButton" icon="pi pi-arrow-right" @click="visible = true" />
    <Sidebar v-model:visible="visible" class="ren-sidebar">
      <Logo style="position: relative; display: block; margin: 1rem; left: 1rem; bottom: initial" />
      <PanelMenu :model="menuModel" />
    </Sidebar>
    <Dialogs :notifications="notifications" @update:notifications="notifications = $event"></Dialogs>
  </div>
</template>

<script>
import PanelMenu from "primevue/panelmenu";
import Sidebar from "primevue/sidebar";
import Dialogs from "./Dialogs.vue";
import Logo from "./Logo.vue";

export default {
  name: "SideMenu",
  components: {
    PanelMenu,
    Sidebar,
    Dialogs,
    Logo,
  },
  emits: ["notification"],
  data() {
    return {
      visible: false,
      menuModel: [],
      dashboards: [],
      //tODO: dialog state hashmap
      notifications: false,
      informationPanels: [],
      isAdmin: false, //this.$store.getters["user/isAdmin"],
      isLogin: false,
    };
  },
  watch: {
    isAdmin: function () {
      this.menuModel = this.initMenu();
    },
  },

  async created() {
    this.isLogin = (await this.$keycloak.get()).authenticated;
    this.menuModel = this.initMenu();
    this.reload();
  },
  methods: {
    async reload() {
      this.$ren.dashboardApi.list().then((dashboards) => {
        this.dashboards = dashboards;
        this.$store.commit("view/dashboards", dashboards);
        let menu = this.initMenu();
        console.info(menu);
        this.menuModel = menu;
      });

      this.$ren.dashboardApi.informationPanelList(this.$route.params.id).then((informationPanels) => {
        this.informationPanels = informationPanels;
        this.$store.commit("view/informationPanels", informationPanels);
        let menu = this.initMenu();
        this.menuModel = menu;
      });
      //todo: catch
    },
    panelItems() {
      if (this.informationPanels.length == 0) {
        return [];
      }
      var items = this.informationPanels.map((panel) => {
        let to = `/panel/view/${panel.id}`;
        return {
          // label: this.$t("menu.group_list"),
          label: panel.label,
          icon: "pi pi-fw pi-align-left",
          to: to,
          command: () => {
            this.$router.push(to);
          },
        };
      });
      items.push({
        //tODO:
        label: this.$t("menu.add_information_panel"),
        icon: "pi pi-fw pi-plus",
        to: "/panel/add",
        command: () => {
          this.$router.push({ name: "InformationPanelCreator" });
        },
      });
      return items;
    },
    dashboardItems() {
      var items = [];
      if (this.dashboards && this.dashboards.length != 0) {
        items = this.dashboards.map((dashboardItem) => {
          let to = `/dashboard/view/${dashboardItem.id}`;
          return {
            // label: this.$t("menu.group_list"),
            label: dashboardItem.label,
            icon: "pi pi-fw pi-align-left",
            to: to,
            command: () => {
              this.$router.push(to);
            },
          };
        });
      }
      items.push({
        // label: this.$t("menu.group_list"),
        label: this.$t("menu.add_dashboard"),
        icon: "pi pi-fw pi-plus",
        to: "/dashboard/add",
        command: () => {
          this.$router.push({ name: "DashboadAdd" });
        },
      });
      return items;
    },

    heatMapItems() {
      return [
        {
          // label: this.$t("menu.group_list"),
          label: this.$t("menu.list_heatmap"),
          icon: "pi pi-fw pi-align-left",
          to: "/dashboard/heatmap/list",
          command: () => {
            this.$router.push({ name: "HeatMapListView" });
          },
        },
        {
          // label: this.$t("menu.group_list"),
          label: this.$t("menu.add_heatmap"),
          icon: "pi pi-fw pi-plus",
          to: "/dashboard/heatmap/add",
          command: () => {
            this.$router.push({ name: "DashboadAdd" });
          },
        },
      ];
    },
    administrationItems() {
      return [
        {
          // label: this.$t("menu.group_list"),
          label: this.$t("menu.users"),
          icon: "pi pi-fw pi-users",
          to: "/admin/users",
          command: () => {
            this.$router.push({ name: "Users" });
          },
        },
      ];
    },

    infrastructureItems() {
      return [
        {
          // label: this.$t("menu.group_list"),
          label: this.$t("menu.assets"),
          icon: "pi pi-fw pi-building",
          items: [
            {
              // label: this.$t("menu.group_list"),
              label: this.$t("menu.manage"),
              icon: "pi pi-fw pi-chevron-circle-right",
              to: "/infrastructure/assets/manage",
              command: () => {
                alert("todo:");
                // this.$router.push({ name: "Users" });
              },
            },
            {
              // label: this.$t("menu.group_list"),
              label: this.$t("menu.view"),
              icon: "pi pi-fw pi-chevron-circle-right",
              to: "/infrastructure/assets/view",
              command: () => {
                alert("todo:");
                // this.$router.push({ name: "Users" });
              },
            },
          ],
        },
        {
          label: this.$t("menu.measurements"),
          icon: "pi pi-fw pi-chart-line",
          items: [
            {
              label: this.$t("menu.manage"),
              icon: "pi pi-fw pi-chevron-circle-right",
              to: "/infrastructure/measurements/manage",
              command: () => {
                alert("todo:");
                // this.$router.push({ name: "Users" });
              },
            },
            {
              label: this.$t("menu.view"),
              icon: "pi pi-fw pi-chevron-circle-right",
              to: "/infrastructure/measurements/view",
              command: () => {
                alert("todo:");
                // this.$router.push({ name: "Users" });
              },
            },
          ],
        },
        {
          label: this.$t("menu.users"),
          icon: "pi pi-fw pi-users",
          command: () => {
            alert("todo:");
            // this.$router.push({ name: "Users" });
          },
        },
      ];
    },
    initMenu() {
      return [
        {
          label: this.$t("menu.dashboards"),
          icon: "pi pi-fw pi-chart-line",
          items: this.dashboardItems(),
        },
        {
          label: this.$t("menu.information_panel"),
          icon: "pi pi-fw pi-chart-line",
          items: this.panelItems(),
        },
        {
          label: this.$t("menu.heatmaps"),
          icon: "pi pi-fw pi-chart-line",
          items: this.heatMapItems(),
        },
        {
          label: this.$t("menu.infrastructure"),
          icon: "pi pi-fw pi-lock",
          items: this.infrastructureItems(),
        },
        {
          label: this.$t("menu.administration"),
          icon: "pi pi-fw pi-lock",
          items: this.administrationItems(),
        },
        {
          label: this.$t("menu.profile"),
          icon: "pi pi-fw pi-user",
          to: "/profile",
          command: () => {
            this.$router.push("/profile");
          },
        },
        {
          label: this.$t("menu.feedback"),
          icon: "pi pi-fw pi-check-square",
          command: () => {
            alert("TODO: user feedback");
            // this.$router.push("/feedback");
          },
        },

        {
          label: this.$t("menu.notifications"),
          icon: "pi pi-fw  pi-bell",
          command: () => {
            // this.$emit("notification");
            this.notifications = !this.notifications;
          },
        },
        {
          label: this.$t("menu.logout"),
          icon: "pi pi-sign-out",
          to: "/",
          visible: () => this.isLogin,
          command: () => {
            this.$keycloak.logout();
            this.$router.push("/");
          },
        },
      ];
    },
    toggle(event) {
      this.$refs.userPopup.toggle(event);
    },
    logout: function () {
      this.$ren.rest.auth.logout();
      this.$router.push({ path: "/login" });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#sideMenuButton {
  position: fixed;
  top: 0.2rem;
  left: 0.2rem;
  font-size: 2rem;
  height: 2rem;
  width: 2rem;
  z-index: 1001;
}
#sideCloseMenuButton {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  font-size: 2.5rem;
  height: 2.5rem;
  width: 2.5rem;
}
</style>
