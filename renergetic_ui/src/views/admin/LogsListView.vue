<template>
  <Card class="ren-page-content">
    <template #title>Logs</template>
    <template #content>
      <RenSpinner ref="spinner" :lock="true" style="width: 100%">
        <!--  max-width: 80vw -->
        <template #content>
          <log-list
            v-model:pagination="pagination"
            :logs="logs"
            :severities="severities"
            :services="services"
            @on-refresh="loadLogs"
            @on-filter="loadLogs"
          />
        </template>
      </RenSpinner>
    </template>
  </Card>
</template>

<script>
import LogList from "@/components/admin/LogList.vue";

export default {
  name: "Logs",
  components: {
    LogList,
  },
  data() {
    return {
      pagination: null,
      logs: [],
      severities: [{ label: "debug" }, { label: "trace" }, { label: "info" }, { label: "warning" }, { label: "error" }],
      services: [{ label: "muveco_service" }, { label: "forecast_service" }],
    };
  },
  watch: {
    pagination: function () {
      this.loadLogs();
    },
  },
  async created() {},
  mounted() {
    if (this.pagination != null) this.loadLogs();
  },
  methods: {
    async loadLogs(filters = null) {
      await this.$refs.spinner.run(async () => {
        console.log("====== loading logs");
        console.log(filters);

        var severity = null;
        var service = null;
        var from = null;
        var to = null;
        if (filters !== null) {
          if (filters.severity.value !== null) {
            filters.severity.value.forEach((elem) => {
              severity = (severity === null ? "" : severity + ",") + elem.label;
            });
            console.log(severity);
          }
          if (filters.service.value !== null) {
            filters.service.value.forEach((elem) => {
              service = (service === null ? "" : service + ",") + elem.label;
            });
            console.log(service);
          }
          if (filters.timestamp.valueFrom !== null) {
            from = filters.timestamp.valueFrom.toISOString();
            console.log(filters.timestamp.valueFrom.toISOString());
          }
          if (filters.timestamp.valueTo !== null) {
            to = filters.timestamp.valueTo.toISOString();
            console.log(filters.timestamp.valueTo.toISOString());
          }
        }

        this.logs = await this.$ren.managementApi.listLogs(this.pagination.offset, this.pagination.limit, severity, service, from, to);
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
