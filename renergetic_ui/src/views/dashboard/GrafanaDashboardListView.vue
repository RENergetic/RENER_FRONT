<template>
  <Card class="ren-page-content" style="max-width: 95rem">
    <template #title>{{ $t("menu.manage_grafana_dashboard") }}</template>
    <template #content>
      <RenSpinner ref="spinner" :lock="true" style="width: 100%">
        <template #content>
          <!-- {{ dashboards }} -->
          <dashboard-list :dashboards="dashboards" @reload="reload" />
        </template>
      </RenSpinner>
    </template>
  </Card>
</template>
<script>
import DashboardList from "@/components/dashboard/grafana/DashboardList.vue";
export default {
  name: "GrafanaDashboardListView",
  components: {
    DashboardList,
  },
  data() {
    return {
      dashboards: [], // this.$store.getters["view/dashboards"],
    };
  },
  async mounted() {
    await this.loadDashboards();
  },
  methods: {
    async loadDashboards() {
      this.$refs.spinner.run(async () => {
        this.dashboards = await this.$ren.dashboardApi.list();
      });
    },
    reload() {
      this.loadDashboards();
    },
  },
};
</script>

<style lang="scss"></style>
