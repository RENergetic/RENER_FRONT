<template>
  <div></div>
</template>
<script>
export default {
  name: "DeleteDashboard",
  components: {},
  props: {
    dashboard: {
      type: Object,
      default: null,
    },
  },
  emits: ["delete"],
  mounted() {},
  methods: {
    async delete() {
      if (this.dashboard == null) {
        return;
        //todo: log error ?
      }
      await this.$confirm.require({
        message: this.$t("view.dashboard_delete_confirm", {
          label: this.dashboard.label ? this.dashboard.label : this.dashboard.name,
        }),
        header: this.$t("view.dashboard_delete"),
        icon: "pi pi-exclamation-triangle",
        accept: async () => {
          this.$store.commit("view/dashboardsDel", this.dashboard.id);
          let res = await this.deleteDashboard(this.dashboard.id);
          if (res) this.$emit("delete", this.dashboard);
          // this.$router.replace("Dashboard");
        },
        reject: () => {
          this.$confirm.close();
        },
      });
    },
    async deleteDashboard(id) {
      return await this.$ren.dashboardApi
        .deleteDashboard(id)
        .then(() => {
          this.$toast.add({
            severity: "success",
            summary: this.$t("view.toast.dashboard_delete_success", {
              label: this.label,
            }),
            life: 3000,
          });
          return true;
        })
        .catch(() => {
          this.$toast.add({
            severity: "error",
            summary: this.$t("view.toast.dashboard_delete_fail", {
              label: this.label,
            }),
            life: 3000,
          });
          return false;
        });
    },
  },
};
</script>

<style lang="scss"></style>
