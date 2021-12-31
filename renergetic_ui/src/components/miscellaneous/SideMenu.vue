<template>
  <div>
    <Button
      id="sideMenuButton"
      icon="pi pi-arrow-right"
      @click="visible = true"
    />
    <Sidebar v-model:visible="visible" class="ren-sidebar">
      <Logo
        style="
          position: relative;
          display: block;
          margin: 1rem;
          left: 1rem;
          bottom: initial;
        "
      />
      <PanelMenu :model="menuModel" />
    </Sidebar>
  </div>
</template>

<script>
import PanelMenu from "primevue/panelmenu";
import Sidebar from "primevue/sidebar";
import Logo from "./Logo.vue";

export default {
  name: "SideMenu",
  components: {
    PanelMenu,
    Sidebar,
    Logo,
  },
  data() {
    return {
      visible: false,
      menuModel: [],
      dashboards: [],
      isAdmin: false, //this.$store.getters["user/isAdmin"],
    };
  },
  watch: {
    isAdmin: function () {
      this.menuModel = this.initMenu();
    },
  },

  async created() {
    this.$ren.dashboardApi.list().then((dashboards) => {
      this.dashboards = dashboards;
      this.$store.commit("view/dashboards", dashboards);
      this.menuModel = this.initMenu();
    });
    this.menuModel = this.initMenu();
  },
  methods: {
    dashboardItems() {
      if (this.dashboards.length == 0) {
        return [];
      }
      var items = this.dashboards.map((dashboardItem) => {
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
      items.append({
        // label: this.$t("menu.group_list"),
        label: this.$t("menu.add_dashboard"),
        icon: "pi pi-fw pi-plus",
        to: "DashboadAdd",
        command: () => {
          this.$router.push("DashboadAdd");
        },
      });
      return items;
    },
    initMenu() {
      return [
        {
          label: this.$t("menu.dashboards"),
          icon: "pi pi-fw pi-chart-line",
          items: this.dashboardItems(),
        },
        {
          label: this.$t("menu.profile"),
          icon: "pi pi-fw pi-user",
          to: "/profile",
          command: () => {
            this.$router.push("/profile");
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
  top: 0.5rem;
  left: 0.5rem;
  font-size: 2.5rem;
  height: 2.5rem;
  width: 2.5rem;
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
