<template>
  <!-- {{ schema }} -->
  {{ runProperties }}
  <Settings v-if="schema" :schema="schema" :settings="runProperties"></Settings>
  <!-- {{ mModel }}
  {{ model }} -->
</template>

<script>
import Settings from "@/components/miscellaneous/settings/Settings.vue";
var parameterTypes = {};
export default {
  name: "WorkflowRun",
  components: {
    Settings,
  },
  props: { workflow: { type: Object, default: () => ({}) } },
  emits: ["update"],
  data() {
    return {
      runProperties: {},
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
    // this.keys = Object.keys(this.mModel);
    this.schema = this.getSchema();
  },

  methods: {
    onClick() {
      alert("TODO: start");
      // this.$emit("update", this.mModel);
    },
    getType(key) {
      return parameterTypes[key] ? parameterTypes[key] : String;
    },
    getSetting(key) {
      return {
        label: key,
        description: this.props[key],
        ext: {},
        type: this.getType(key),
        key: key,
      };
    },
    getSchema() {
      var schema = this.detailKeys.map((k) => this.getSetting(k));
      schema.push({
        label: this.$t("view.button"),
        ext: {
          click: this.onClick,
        },
        type: "Submit",
        key: "startTask",
      });
      return schema;
    },
  },
};
</script>
<style scoped lang="scss"></style>
