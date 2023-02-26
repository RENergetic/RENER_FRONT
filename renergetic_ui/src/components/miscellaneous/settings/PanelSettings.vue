<template>
  <!-- {{ settings }} -->
  <Settings :schema="schema" :settings="settings"></Settings>
</template>

<script>
import { RenRoles } from "@/plugins/model/Enums";
import Settings from "./Settings.vue";
export default {
  name: "PanelSettings",
  components: {
    Settings,
  },

  props: { submit: { type: Boolean, default: false } },
  emits: ["update"],
  data() {
    return {
      settings: this.$store.getters["settings/panel"],
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
    this.schema = this.getSchema();
  },

  async created() {
    this.schema = this.getSchema();
  },
  methods: {
    async onClick() {
      this.$store.commit("settings/panel", this.settings);
      if (this.$store.getters["auth/isAuthenticated"]) await this.$ren.utils.saveSettings();
    },
    submitButton() {
      return {
        label: this.$t("settings.submit"),
        ext: {
          click: this.onClick,
        },
        type: "Submit",
        key: "panelSubmit",
      };
    },
    getSchema() {
      var schema = [
        {
          label: this.$t("settings.relative_values"),
          description: this.$t("settings.relative_values_description"),
          ext: {
            true: this.$t("settings.enabled"),
            false: this.$t("settings.disabled"),
          },
          type: Boolean,
          key: "relativeValues",
        },
        {
          label: this.$t("settings.group_by_domain"),
          description: this.$t("settings.group_by_domain_description"),
          ext: {
            true: this.$t("settings.enabled"),
            false: this.$t("settings.disabled"),
          },
          type: Boolean,
          key: "groupByDomain",
        },
        {
          label: this.$t("settings.group_by_measurement"),
          description: this.$t("settings.group_by_measurement_description"),
          ext: {
            true: this.$t("settings.enabled"),
            false: this.$t("settings.disabled"),
          },
          type: Boolean,
          key: "groupByMeasurement",
        },
        {
          label: this.$t("settings.group_by_direction"),
          description: this.$t("settings.group_by_direction_description"),
          ext: {
            true: this.$t("settings.enabled"),
            false: this.$t("settings.disabled"),
          },
          type: Boolean,
          key: "groupByDirection",
        },
        {
          label: this.$t("settings.tile_legend_visibility"),
          description: this.$t("settings.tile_legend_visibility_description"),
          ext: {
            true: this.$t("settings.enabled"),
            false: this.$t("settings.disabled"),
          },
          type: Boolean,
          key: "legend",
        },
        {
          label: this.$t("settings.request_demand"),
          description: this.$t("settings.request_demand_description"),
          ext: {
            true: this.$t("settings.visible"),
            false: this.$t("settings.hidden"),
          },
          type: Boolean,
          key: "demandVisibility",
        },
        {
          label: this.$t("settings.notification"),
          ext: {
            true: this.$t("settings.visible"),
            false: this.$t("settings.hidden"),
          },
          type: Boolean,
          key: "notificationVisibility",
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
      let r = RenRoles.REN_ADMIN | RenRoles.REN_MANAGER | RenRoles.REN_TECHNICAL_MANAGER;
      if (r & this.$store.getters["auth/renRole"]) {
        schema.push({
          label: this.$t("settings.ignore_override_mode"),
          description: this.$t("settings.ignore_override_mode_description"),
          ext: {
            true: this.$t("settings.enabled"),
            false: this.$t("settings.disabled"),
          },
          type: Boolean,
          key: "ignoreOverrideMode",
        });
      }

      if (this.submit) {
        schema.push(this.submitButton());
      }
      return schema;
    },
    toggle(event) {
      this.$refs.menu.toggle(event);
    },
  },
};
</script>
<style scoped lang="scss"></style>
