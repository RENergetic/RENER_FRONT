<script>
export default {
  name: "DeleteMeasurement",
  components: {},
  props: {
    measurement: {
      type: Object,
      default: null,
    },
  },
  emits: ["delete"],
  mounted() {},
  methods: {
    async delete(measurement) {
      let mMeasurement = measurement ? measurement : this.measurement;
      if (mMeasurement == null) {
        return;
        //todo: log error ?
      }
      await this.$confirm.require({
        message: this.$t("view.measurement_delete_confirm", {
          label: mMeasurement.label ? mMeasurement.label : mMeasurement.name,
        }),
        header: this.$t("view.measurement_delete"),
        icon: "pi pi-exclamation-triangle",
        accept: async () => {
          let res = await this.deleteConfirmed(mMeasurement.id);
          if (res) this.$emit("delete", mMeasurement);
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
