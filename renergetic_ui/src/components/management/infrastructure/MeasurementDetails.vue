<template>
  <!-- {{ schema }} -->
  <Settings :schema="schema" :model="model"></Settings>
</template>

<script>
import Settings from "@/components/miscellaneous/settings/Settings.vue";
var types = {
  color: "Color",
};
export default {
  name: "MeasurementDetails",
  components: {
    Settings,
  },
  props: ["value"],
  emits: ["update"],
  data() {
    return {
      model: this.value,
      keys: [],
      schema: {},
    };
  },
  computed: {},
  watch: {
    model: {
      handler: function (newVal) {
        this.model = newVal;
        this.$emit("update", newVal);
      },
      deep: true,
    },
  },
  async mounted() {
    this.keys = Object.keys(this.value);
    this.schema = this.getSchema();
  },

  methods: {
    getType(key) {
      if (types[key]) {
        return types[key];
      }
      return String;
    },
    getSetting(key) {
      let mt = this.getType(key);
      var ext = {};
      if (mt == Boolean) {
        ext = {
          true: this.$t("settings.visible"),
          false: this.$t("settings.hidden"),
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
      var schema = this.keys.map((k) => this.getSetting(k));
      return schema;
    },
  },
};
</script>
<style scoped lang="scss"></style>
