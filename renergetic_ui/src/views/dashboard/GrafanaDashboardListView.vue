<template>
  <Card style="margin: auto; margin-top: 0.5rem; max-width: 90rem">
    <template #title>{{ $t("menu.manage_grafana_dashboard") }}</template>
    <template #content>
      <RenSpinner ref="spinner" :lock="true" style="width: 100%">
        <template #content>
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
  mounted() {
    this.loadDashboards();
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
