<template>
  <div id="dashboard-wrapper"><Grafana :url="dashboardUrl" /></div>

  <!-- <Carousel   :value="data"    :num-visible="3"   :num-scroll="1"  :responsive-options="responsiveOptions" >
    <template #header>   <h5>Basic</h5>    </template>
    <template #item="slotProps">      <div>data: {{ slotProps.data.name }}</div>    </template>  </Carousel> -->
  <Dock class="ren-dock" :model="dashboardMenu" position="bottom">
    <template #icon="{ item }"
      ><div :style="getColor(item)">
        {{ item.label }}
      </div>
    </template>
  </Dock>
</template>
<script>
// import Carousel from "primevue/carousel";
import Grafana from "../../components/dashboard/Grafana.vue";
import Dock from "primevue/dock";

export default {
  name: "Dashboard",
  components: { Dock, Grafana /* Carousel */ },
  data() {
    return { dashboards: {}, dashboard: null, dashboardMenu: [] };
  },
  computed: {
    dashboardUrl() {
      if (this.dashboard) {
        return this.dashboard.url;
      }
      return null;
    },
    // isLoading() {
    //   return this.$store.getters["spinner/isLoading"];
    // }, };
  },
  watch: {},
  created() {
    let dashboards = this.$store.getters["view/dashboards"];
    try {
      if (dashboards) {
        this.dashboards = dashboards;
        this.dashboard = dashboards.find(
          (item) => item.id == this.$route.params.dashboard_id
        );
        this.dashboardMenu = this.createDashboardMenu();
      }
    } catch (error) {
      this.dashboard = null;
    }
  },
  mounted() {},
  methods: {
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
        let to = `/dashboard/${dashboardItem.id}`;
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
}
</style>
