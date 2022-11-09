<template>
  <Settings :schema="schema" :settings="settings"></Settings>
</template>

<script>
import Settings from "./Settings.vue";
export default {
  name: "FilterSettings",
  components: {
    Settings,
  },
  props: {},
  emits: ["update"],
  data() {
    return {
      settings: this.$store.getters["settings/filter"],

      schema: {},
    };
  },
  computed: {},
  // watch: {
  //   settings: {
  //     handler: function (newVal) {
  //       this.$store.commit("settings/filter", newVal);
  //       this.$emit("update");
  //     },
  //     deep: true,
  //   },
  // },
  async mounted() {
    this.$ren.dashboardApi
      .listInformationPanel()
      .then((panels) => {
        this.panels = panels;
      })
      .then(() => {
        this.schema = this.getSchema();
      });
  },

  async created() {
    this.schema = this.getSchema();
  },
  methods: {
    onClick() {
      this.$store.commit("settings/filter", this.settings);
      this.$emit("update");
    },
    getSchema() {
      var schema = [
        {
          label: this.$t("settings.time_filter"),
          ext: {
            options: [
              { id: "current_day", label: this.$t("settings.time_filters.current_day") },
              { id: "current_month", label: this.$t("settings.time_filters.current_month") },
              { id: "current_year", label: this.$t("settings.time_filters.current_year") },
              { id: "previous_year", label: this.$t("settings.time_filters.previous_year") },
            ],
            optionLabel: "label",
            optionValue: "id",
          },
          type: Array,
          key: "timeInterval",
        },
        {
          label: this.$t("settings.submit"),
          ext: {
            click: this.onClick,
          },
          type: "Submit",
          key: "filterSubmit",
        },
      ];

      return schema;
    },
    toggle(event) {
      this.$refs.menu.toggle(event);
    },
  },
};
</script>
<style scoped lang="scss"></style>
