<template>
  <!-- {{ settings }} -->
  <Settings :schema="schema" :settings="settings"></Settings>
</template>

<script>
import { RenRoles } from "@/plugins/model/Enums";
import { userPanelSchema } from "@/plugins/model/settings.js";

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
      // console.error(panelSchema);
      // alert(JSON.stringify(panelSchema));
      var schema = userPanelSchema();
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
        schema.push({
          label: this.$t(`settings.compare_interval_type`),
          description: this.$t(`settings.compare_interval_type_description`),
          type: Array,
          ext: {
            options: [
              { id: "none", label: this.$t("enums.interval_type.none") },
              { id: "previous", label: this.$t("enums.interval_type.previous") },
              { id: "year", label: this.$t("enums.interval_type.year") },
              { id: "month", label: this.$t("enums.interval_type.month") },
              { id: "day", label: this.$t("enums.interval_type.day") },
              { id: "week", label: this.$t("enums.interval_type.week") },
            ],
            optionLabel: "label",
            optionValue: "id",
          },
          key: "compare_interval_type",
          default: "none",
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
