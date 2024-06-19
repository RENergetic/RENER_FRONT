<template>
  <!-- {{ schema }} -->
  <Settings v-if="schema" :schema="schema" :settings="mModel"></Settings>
  <!-- {{ mModel }}
  {{ model }} -->
</template>

<script>
import Settings from "@/components/miscellaneous/settings/Settings.vue";
var detailTypes = {
  color: "Color",
  cumulative: Boolean,
  background: "Color",
  fill_chart: Boolean,
};
export default {
  name: "MeasurementDetails",
  components: {
    Settings,
  },
  props: {
    model: { type: Object, default: () => ({}) },
    autosave: { type: Boolean, default: false },
    measurement: { type: Object, default: null },
  },
  emits: ["update"],
  data() {
    return {
      mModel: this.model,
      keys: [],
      schema: null,
    };
  },
  computed: {},
  watch: {
    mModel: {
      // handler: function (newVal) {
      //   this.$emit("update", newVal);
      // },
      // deep: true,
    },
  },
  async mounted() {
    this.keys = Object.keys(this.mModel);
    this.detailKeys = Object.keys(detailTypes);

    this.schema = this.getSchema();
  },

  methods: {
    async onClick() {
      if (this.autosave && this.measurement != null) {
        await this.$ren.managementApi.updateMeasurementProperties(this.measurement, this.mModel);
      }
      this.$emit("update", this.mModel);
    },
    getType(key) {
      if (detailTypes[key]) {
        return detailTypes[key];
      }
      return String;
    },
    getSetting(key) {
      let mt = this.getType(key);
      console.error(this.mModel);
      if (!this.mModel[key]) {
        this.mModel[key] = null;
      }
      if (mt == Boolean) {
        this.mModel[key] = this.mModel[key] || this.mModel[key] === "true" ? true : false;
      }
      var ext = {};
      if (mt == Boolean) {
        ext = {
          true: this.$t("settings.yes"),
          false: this.$t("settings.no"),
        };
      }
      return {
        label: this.$t("settings.measurement_details." + key),
        description: this.$te("settings.measurement_details.description." + key) ? this.$t("settings.measurement_details.description." + key) : null,
        ext: ext,
        type: this.getType(key),
        key: key,
      };
    },
    getSchema() {
      var schema = this.detailKeys.map((k) => this.getSetting(k));
      schema.push({
        label: this.$t("settings.submit"),
        ext: {
          click: async () => await this.onClick(),
          async: true,
        },
        type: "Submit",
        key: "detailsSubmit",
      });
      return schema;
    },
  },
};
</script>
<style scoped lang="scss"></style>
