<template>
  <!-- {{ schema }} -->
  {{ runParameters }} aaaaa {{ workFlowParameters }} bbb
  {{ workFlow }}
  <Settings v-if="schema" :schema="schema" :settings="runParameters"></Settings>
</template>

<script>
import Settings from "@/components/miscellaneous/settings/Settings.vue";
var parameterTypes = {};
export default {
  name: "WorkflowRun",
  components: {
    Settings,
  },
  props: { workFlow: { type: Object, default: () => ({}) } },
  emits: ["update"],
  data() {
    return {
      workFlowParameters: this.workFlow.parameters ? this.workFlow.parameters : {},
      runParameters: {},
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
        description: this.workFlowParameters[key],
        ext: {},
        type: this.getType(key),
        key: key,
      };
    },
    getSchema() {
      var schema = Object.keys(this.workFlowParameters).map((k) => this.getSetting(k));
      schema.push({
        label: this.$t("view.button.start"),
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
