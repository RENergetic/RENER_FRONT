<template>
  <Settings :schema="schema" :settings="settings"></Settings>
</template>

<script>
import Settings from "./Settings.vue";
export default {
  name: "PanelSettings",
  components: {
    Settings,
  },
  props: {},
  emits: ["update"],
  data() {
    return {
      settings: this.$store.getters["settings/panel"],
      panels: [],
      schema: {},
    };
  },
  computed: {},
  watch: {
    settings: {
      handler: function (newVal) {
        this.$store.commit("settings/panel", newVal);
        this.$emit("update");
      },
      deep: true,
    },
  },
  async mounted() {
    this.settings = this.$store.getters["settings/panel"];
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
    getSchema() {
      var schema = [
        {
          label: this.$t("settings.notification"),
          ext: {
            true: this.$t("settings.visible"),
            false: this.$t("settings.hidden"),
          },
          type: Boolean,
          key: "notificationVisibility",
        },
        {
          label: this.$t("settings.request_demand"),
          ext: {
            true: this.$t("settings.visible"),
            false: this.$t("settings.hidden"),
          },
          type: Boolean,
          key: "demandVisibility",
        },
        {
          label: this.$t("settings.group_by_domain"),
          ext: {
            true: this.$t("settings.enabled"),
            false: this.$t("settings.disabled"),
          },
          type: Boolean,
          key: "groupByDomain",
        },
        {
          label: this.$t("settings.group_by_measurement"),
          ext: {
            true: this.$t("settings.enabled"),
            false: this.$t("settings.disabled"),
          },
          type: Boolean,
          key: "groupByMeasurement",
        },
        {
          label: this.$t("settings.group_by_direction"),
          ext: {
            true: this.$t("settings.enabled"),
            false: this.$t("settings.disabled"),
          },
          type: Boolean,
          key: "groupByDirection",
        },

        {
          label: this.$t("settings.relative_values"),
          ext: {
            true: this.$t("settings.enabled"),
            false: this.$t("settings.disabled"),
          },
          type: Boolean,
          key: "relativeValues",
        },
        // {
        //   label: this.$t("settings.time_filter"),
        //   ext: {
        //     options: [
        //       { id: "current_day", label: this.$t("settings.time_filters.current_day") },
        //       { id: "current_month", label: this.$t("settings.time_filters.current_month") },
        //       { id: "current_year", label: this.$t("settings.time_filters.current_year") },
        //       { id: "previous_year", label: this.$t("settings.time_filters.previous_year") },
        //     ],
        //     optionLabel: "label",
        //     optionValue: "id",
        //   },
        //   type: Array,
        //   key: "selectedPanel",
        // },
        //TODO: font size?
        // {
        //   label: this.$t("settings.panel_font_size"),
        //   type: Number,
        //   key: "fontSize",
        //   ext: { mode: "decimal" },
        // },
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
