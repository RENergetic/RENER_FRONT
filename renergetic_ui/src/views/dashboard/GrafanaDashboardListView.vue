<template>
  <div>
    todo
    <dashboard-list :dashboards="dashboards" />
  </div>
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
      dashboards: this.$store.getters["view/dashboards"],
    };
  },
};
</script>

<style lang="scss"></style>
