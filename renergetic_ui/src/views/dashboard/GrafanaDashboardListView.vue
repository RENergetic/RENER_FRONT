<template>
  <Card class="col-12" style="width: 90%; margin: auto; margin-top: 1rem">
    <template #content>
      <RenSpinner ref="spinner" :lock="true" style="margin: auto; max-width: 80rem">
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
