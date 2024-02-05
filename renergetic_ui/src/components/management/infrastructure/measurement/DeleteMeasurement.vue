<script>
export default {
  name: "DeleteMeasurement",
  components: {},
  props: {
    measurements: {
      type: Object,
      default: null,
    },
  },
  emits: ["delete"],
  mounted() {},
  methods: {
    async delete(measurements) {
      let mMeasurements = measurements ? measurements : this.measurements;
      if (mMeasurements == null) {
        return;
        //todo: log error ?
      }
      var label = mMeasurements.map((m) => this.measurementLabel(m)).join(",");
      await this.$confirm.require({
        message: this.$t("view.measurement_delete_confirm", {
          label: label,
        }),
        header: this.$t("view.measurement_delete"),
        icon: "pi pi-exclamation-triangle",
        accept: async () => {
          let deleted = [];
          for (let m of mMeasurements) {
            let res = await this.deleteConfirmed(m.id);
            if (res) {
              deleted.push(m);
            }
          }
          if (deleted.length > 0) this.$emit("delete", deleted);
        },
        reject: () => {
          this.$confirm.close();
        },
      });
    },
    async deleteConfirmed(id) {
      return await this.$ren.managementApi
        .deleteMeasurement(id)
        .then(() => {
          this.$emitter.emit("information", { message: this.$t("information.measurement_delete_success") });
          return true;
        })
        .catch(() => {
          this.$emitter.emit("error", { message: this.$t("information.measurement_delete_fail") });
          return false;
        });
    },
  },
};
</script>

<style lang="scss"></style>
