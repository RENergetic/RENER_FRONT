<template>
  <Button id="sideMenuButton" icon="pi pi-arrow-right" @click="visible = true" />
  <Sidebar v-model:visible="visible" class="ren-sidebar" :show-close-icon="false">
    <div id="sideMenuLogo"><Logo /></div>
    <PanelMenu class="ren" :model="menuModel" />
  </Sidebar>
  <!-- {{ $route.path }}{{ $route.name }} -->
  <Dialogs
    :notification-dialog="notificationDialog"
    :demand-dialog="demandDialog"
    :locales="localesDialog"
    :add-dashboard="dashboardDialog"
    :add-user="userDialog"
    @update:notification-dialog="notificationDialog = $event"
    @update:demand-dialog="demandDialog = $event"
    @update:notifications="onNotificationChange($event)"
  ></Dialogs>
</template>

<script>
import { RenRoles } from "../../plugins/model/Enums";
import PanelMenu from "primevue/panelmenu";
import Sidebar from "primevue/sidebar";
import Dialogs from "./MenuDialogs.vue";
import Logo from "./Logo.vue";

export default {
  name: "SideMenu",
  components: { PanelMenu, Sidebar, Dialogs, Logo },
  emits: ["notification", "refresh"],
  data() {
    return {
      role: this.$store.getters["auth/renRole"],
      isLoggedIn: this.$store.getters["auth/isAuthenticated"],
      visible: false,
      menuModel: [],
      dashboards: [],
      notificationDialog: false,
      demandDialog: false,
      dashboardDialog: false,
      userDialog: false,
      localesDialog: false,
      informationPanels: [],
      notificationCount: 0,
      demandCount: this.$store.getters["view/demands"].length,
      isAdmin: false, //this.$store.getters["user/isAdmin"],
    };
  },
  computed: {
    pluginLoaded() {
      return this.$pluginLoaded;
    },
  },
  watch: {
    "$route.path": {
      handler: function () {
        this.menuModel = this.initMenu();
      },
      deep: true,
    },
  },
  mounted() {
    this.menuModel = this.initMenu();
    this.reload();
  },
  async created() {},
  methods: {
    initMenu() {
      return [
        {
          class: this.checkPath({ path: "/" }) ? "hl-menu" : "",
          label: this.$t("menu.home"),
          icon: "pi pi-home",
          command: () => this.$router.push({ path: "/" }),
        },
        ...this.featuredPanels(), //public dashboard
        ...this.assetsItems(), //private dashboard
        ...this.dashboardItems(), //grafana  dashboardss
        // ...this.infrastructureItems(),
        // ...this.administrationItems(),
        ...this.notificationsItem(),
        ...this.demandsItem(),

        ...this.managementItems(),
        ...this.userItems(),
      ];
    },
    onNotificationChange(notifications) {
      this.notificationCount = notifications.length;
      this.menuModel = this.initMenu();
    },
    onDemandChange(demands) {
      this.demandCount = demands.length;
      this.menuModel = this.initMenu();
    },
    async reload() {
      this.$ren.utils
        .reloadStore()
        .then(async () => {
          this.dashboards = this.$store.getters["view/dashboards"];
          // this.dashboards = await this.$ren.dashboardApi.list();
          this.informationPanels = this.$store.getters["view/informationPanels"];
          let menu = this.initMenu();
          this.menuModel = menu;
        })
        .catch((error) => {
          if (error == null || error.isAuthenticated != false) {
            console.error(error);
          }
        });
    },

    featuredPanels() {
      var featuredPanels = this.$store.getters["view/featuredPanels"];
      if (featuredPanels == null && featuredPanels.length == 0) return [];
      var items = featuredPanels.map((panel) => {
        // let to = `/panel/view/${panel.id}`;
        return {
          class: this.checkPath({ name: "PublicDashboardView", params: { id: panel.id } }) ? "hl-menu" : "",
          label: panel.label ? panel.label : panel.name,
          icon: "pi pi-fw pi-th-large",
          command: () => {
            this.$router.push({ name: "PublicDashboardView", params: { id: panel.id } });
          },
        };
      });
      if (items.length > 0) {
        return [
          {
            label: this.$t("menu.public_dashboards"),
            icon: "pi pi-fw pi-chart-line",
            items: items,
          },
        ];
      }
      return [];
    },
    assetsItems() {
      let flags = RenRoles.REN_VISITOR | RenRoles.REN_USER;
      if ((flags & this.role) == 0) return [];
      let assetPanels = this.$store.getters["view/assetPanels"];
      if (assetPanels == null && assetPanels.length == 0) return [];
      let items = assetPanels.map((assetPanel) => {
        // let to = `/asset/${assetPanel.asset.id}/panel/${assetPanel.panel.id}`;
        return {
          class: this.checkPath({
            name: "AssetPanelView",
            params: { asset_id: assetPanel.asset.id, id: assetPanel.panel.id },
          })
            ? "hl-menu"
            : "",
          label: assetPanel.panel.label.replace("{asset}", assetPanel.asset.label),
          icon: "pi pi-fw pi-th-large",
          command: () => {
            this.$router.push({
              name: "AssetPanelView",
              params: {
                asset_id: assetPanel.asset.id,
                id: assetPanel.panel.id,
              },
            });
          },
        };
      });

      if (items.length > 0)
        return [
          {
            label: this.$t("menu.private_dashboards"),
            icon: "pi pi-fw pi-chart-line",
            items: items,
          },
        ];
      return [];
    },
    dashboardItems() {
      let flags = RenRoles.REN_ADMIN | RenRoles.REN_MANAGER | RenRoles.REN_TECHNICAL_MANAGER;
      if ((flags & this.role) == 0) {
        return [];
      }
      var items = [];
      if (this.dashboards && this.dashboards.length != 0) {
        items = this.dashboards
          .filter((it) => it.url)
          .map((dashboardItem) => {
            // let to = `/dashboard/view/${dashboardItem.id}`;
            return {
              // label: this.$t("menu.group_list"),
              label: dashboardItem.label ? dashboardItem.label : dashboardItem.name,
              icon: "pi pi-fw pi-th-large",
              command: () => {
                window.open(dashboardItem.url, "_blank");
                // this.$router.push(to);
              },
            };
          });
      }
      if (items.length > 0)
        return [
          {
            label: this.$t("menu.grafana_dashboards"),
            icon: "pi pi-fw pi-chart-line",
            items: items,
          },
        ];
      else {
        return [];
      }
    },
    managementItems() {
      let flags = RenRoles.REN_ADMIN | RenRoles.REN_TECHNICAL_MANAGER;
      if ((flags & this.role) == 0) return [];

      let items = [
        ...this._userItems(),
        ...this._assetItems(),
        ...this._grafanaDashboardManagement(),
        ...this._panelManagementItems(),
        ...this._measurementItems(),
        // ...this._notificationItems(),
        ...this._hdrItems(),
        ...this._abstractMeters(),
      ];
      return [
        {
          label: this.$t("menu.management"),
          icon: "pi pi-fw pi-wrench pi-cog",
          items: items,
        },
      ];
    },
    adminItems() {
      let flags = RenRoles.REN_ADMIN;
      if ((flags & this.role) == 0) return [];

      let items = [...this._workflowItems()];
      return [
        {
          label: this.$t("menu.admin"),
          icon: "pi pi-fw pi-wrench pi-cog",
          items: items,
        },
      ];
    },
    _workflowItems() {
      let items = [
        {
          class: this.checkPath({ name: "Workflows" }) ? "hl-menu" : "",
          label: this.$t("menu.manage_workflows"),
          icon: "pi pi-fw pi-wrench",
          command: () => {
            this.$router.push({ name: "Workflows" });
          },
        },
      ];
      return items;
    },
    _userItems() {
      let items = [
        {
          class: this.checkPath({ name: "Users" }) ? "hl-menu" : "",
          label: this.$t("menu.manage_users"),
          icon: "pi pi-fw pi-users",
          command: () => {
            this.$router.push({ name: "Users" });
          },
        },
        // {
        //   // label: this.$t("menu.group_list"),
        //   label: this.$t("menu.add_user"),
        //   icon: "pi pi-fw pi-user-plus",
        //   command: () => {
        //     this.userDialog = !this.userDialog;
        //     // this.$router.push({ name: "AddUser" });
        //   },
        // },
      ];

      // let flags = RenRoles.REN_ADMIN;
      // if ((flags & this.role) == 0) {
      //   return [];
      // }
      return items;
      // return [
      //   {
      //     label: this.$t("menu.manage_users"),
      //     icon: "pi pi-fw pi-lock",
      //     items: items,
      //   },
      // ];
    },
    _assetItems() {
      return [
        {
          class: this.checkPath({ name: "AssetList" }) ? "hl-menu" : "",
          label: this.$t("menu.manage_assets"),
          icon: "pi pi-fw pi-list",

          command: () => {
            this.$router.push({ name: "AssetList", path: "/management/asset" });
          },
        },
      ];
      // return [
      //   {
      //     label: this.$t("menu.manage_assets"),
      //     icon: "pi pi-fw pi-building",
      //     items: items,
      //   },
      // ];
    },

    _measurementItems() {
      return [
        {
          class: this.checkPath({ name: "MeasurementList" }) ? "hl-menu" : "",
          label: this.$t("menu.manage_measurements"),
          icon: "pi pi-fw pi-list",
          command: () => {
            this.$router.push({ name: "MeasurementList", path: "/management/measurement" });
          },
        },
      ];
    },

    // _notificationItems() {
    //   return [
    //     {
    //       class: this.checkPath({ name: "NotificationList" }) ? "hl-menu" : "",
    //       label: this.$t("menu.manage_notifications"),
    //       icon: "pi pi-fw pi-bell",
    //       command: () => {
    //         this.$router.push({ name: "NotificationList", path: "/management/notification" });
    //       },
    //     },
    //   ];
    // },
    _hdrItems() {
      return [
        {
          class: this.checkPath({ name: "HDRView" }) ? "hl-menu" : "",
          label: this.$t("menu.hdr_view"),
          icon: "pi pi-fw pi-sliders-h",
          command: () => {
            this.$router.push({ name: "HDRView", path: "/management/demand/hdr" });
          },
        },
      ];
    },

    _abstractMeters() {
      return [
        {
          class: this.checkPath({ name: "AbstractMeters" }) ? "hl-menu" : "",
          label: this.$t("menu.abstract_meter"),
          icon: "pi pi-fw pi-list",
          command: () => {
            this.$router.push({ name: "AbstractMeters", path: "/management/abstract" });
          },
        },
      ];
    },
    _panelManagementItems() {
      let items = [
        {
          class: this.checkPath({ name: "InformationPanelListView" }) ? "hl-menu" : "",
          label: this.$t("menu.manage_information_panels"),
          icon: "pi pi-fw  pi-th-large",
          command: () => {
            this.$router.push({ name: "InformationPanelListView", path: "/panel" });
          },
        },
      ];
      return items;
    },

    _grafanaDashboardManagement() {
      let items = [];
      items.push({
        class: this.checkPath({ name: "GrafanaDashboardListView" }) ? "hl-menu" : "",
        label: this.$t("menu.manage_grafana_dashboard"),
        icon: "pi pi-fw pi-th-large",
        command: () => {
          this.$router.push({ name: "GrafanaDashboardListView" });
        },
      });
      return items;
    },

    notificationsItem() {
      let flags = RenRoles.REN_ADMIN | RenRoles.REN_USER | RenRoles.REN_MANAGER | RenRoles.REN_TECHNICAL_MANAGER | RenRoles.REN_STAFF;
      if ((flags & this.role) == 0) {
        return [];
      }
      let managerFlags = RenRoles.REN_ADMIN | RenRoles.REN_MANAGER | RenRoles.REN_TECHNICAL_MANAGER;

      return [
        {
          label: this.$t("menu.notifications"),
          icon: "pi pi-fw  pi-bell",
          command: () => {
            // this.$emit("notification");
            if (this.notificationCount > 0 || managerFlags & this.role) this.notificationDialog = !this.notificationDialog;
          },
          class: this.notificationCount == 0 ? "disabled" : "hl-warning",
        },
      ];
    },
    demandsItem() {
      let flags = RenRoles.REN_USER;
      if ((flags & this.role) == 0) {
        return [];
      }
      return [
        {
          label: this.$t("menu.demands"),
          icon: "pi pi-fw  pi-bell",
          command: () => {
            if (this.demandCount > 0) this.demandDialog = !this.demandDialog;
          },
          class: this.demandCount == 0 ? "disabled" : "hl-warning",
        },
      ];
    },

    userItems() {
      if (!this.isLoggedIn) {
        return [
          {
            class: this.checkPath({ path: "/login" }) ? "hl-menu" : "",
            label: this.$t("menu.login"),
            icon: "pi pi-sign-in",
            command: () => this.$router.push({ path: "/login" }),
            // visible: () => !this.isLoggedIn,
          },
        ];
      }
      let flags = RenRoles.REN_USER | RenRoles.REN_VISITOR;
      let items = [
        {
          label: this.$t("menu.profile"),
          icon: "pi pi-fw pi-user",
          items: [
            {
              class: this.checkPath({ path: "/profile" }) ? "hl-menu" : "",
              label: this.$t("menu.profile_settings"),
              icon: "pi pi-fw pi-user",
              command: () => {
                this.$router.push("/profile");
              },
            },
            {
              label: this.$t("menu.locales"),
              icon: "pi pi-fw pi-cog", //pi-language
              command: () => {
                // this.$emit("notification");
                this.localesDialog = !this.localesDialog;
              },
            },
            {
              class: this.checkPath({ survey: "/profile/survey" }) ? "hl-menu" : "",
              label: this.$t("menu.feedback"),
              icon: "pi pi-fw pi-check-square",
              visible: () => (flags & this.role) > 0,
              command: () => {
                this.$router.push("/profile/survey");
                // this.$router.push("/feedback");
              },
            },
          ],
        },

        // {
        //   label: this.$t("menu.signup"),
        //   icon: "pi pi-sign-in",
        //   visible: () => !this.isLoggedIn,
        //   command: () => {
        //     this.$router.push({ name: "SignUp" });
        //   },
        // },
        {
          label: this.$t("menu.logout"),
          icon: "pi pi-sign-out",
          visible: () => this.isLoggedIn,
          command: () => {
            this.$keycloak.logout();
            this.$router.push("/");
          },
        },
      ];

      return items;
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

// {
//   label: this.$t("menu.heatmaps"),
//   icon: "pi pi-fw pi-chart-line",
//   items: this.heatMapItems(),
// },
</script>
<style scoped lang="scss">
#sideMenuLogo {
  position: relative;
  display: block;
  margin: 5%;
  margin-top: 0;
  bottom: initial;
  width: 90%;
  height: 5rem;
}
.p-sidebar .p-sidebar-header {
  padding-bottom: 0;
}
#sideMenuButton {
  // background: none;
  width: $sidemenu-button-width;
  height: $sidemenu-button-width;
  font-size: $sidemenu-button-width;
  position: fixed;
  top: 0.2rem;
  left: 0.2rem;
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
