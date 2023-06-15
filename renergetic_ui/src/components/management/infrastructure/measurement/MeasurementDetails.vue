<template>
  <!-- {{ schema }} -->
  <Settings v-if="schema" :schema="schema" :settings="mModel"></Settings>
  <!-- {{ mModel }} -->
</template>

<script>
import Settings from "@/components/miscellaneous/settings/Settings.vue";
var detailTypes = {
  color: "Color",
  cumulative: Boolean,
};
export default {
  name: "MeasurementDetails",
  components: {
    Settings,
  },
  props: { model: { type: Object, default: () => ({}) } },
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
    onClick() {
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
      if (!this.mModel[key]) {
        this.mModel[key] = null;
      }
      if (mt == Boolean) {
        // alert(this.mModel[key]);
        this.mModel[key] = this.mModel[key] || this.mModel[key] === "true" ? true : false;

        // this.mModel[key] = true;
        // alert(this.mModel[key]);
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
          click: this.onClick,
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
