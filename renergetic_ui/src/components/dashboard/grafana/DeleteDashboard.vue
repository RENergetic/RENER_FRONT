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
    async delete(dashboard) {
      let mDashboard = dashboard ? dashboard : this.dashboard;
      if (mDashboard == null) {
        return;
        //todo: log error ?
      }
      await this.$confirm.require({
        message: this.$t("view.dashboard_delete_confirm", {
          label: mDashboard.label ? mDashboard.label : mDashboard.name,
        }),
        header: this.$t("view.dashboard_delete"),
        icon: "pi pi-exclamation-triangle",
        accept: async () => {
          this.$store.commit("view/dashboardsDel", mDashboard.id);
          let res = await this.deleteConfirmed(mDashboard.id);
          if (res) this.$emit("delete", mDashboard);
        },
        reject: () => {
          this.$confirm.close();
        },
      });
    },
    async deleteConfirmed(id) {
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
