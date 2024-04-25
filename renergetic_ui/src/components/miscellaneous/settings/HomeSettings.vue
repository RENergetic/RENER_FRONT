<template>
  <Settings :schema="schema" :settings="settings"></Settings>
</template>

<script>
import { RenRoles } from "@/plugins/model/Enums";
import Settings from "./Settings.vue";
export default {
  name: "HomeSettings",
  components: {
    Settings,
  },
  props: { submit: { type: Boolean, default: false } },
  emits: ["update"],
  data() {
    return {
      settings: this.$store.getters["settings/home"],
      panels: [],
      schema: {},
    };
  },
  computed: {},
  watch: {
    settings: {
      handler: function (newVal) {
        this.$store.commit("settings/home", newVal);
        this.$emit("update");
      },
      deep: true,
    },
  },
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
    async onClick() {
      this.$store.commit("settings/home", this.settings);
      if (this.$store.getters["auth/isAuthenticated"]) await this.$ren.utils.saveSettings();
    },
    submitButton() {
      return {
        label: this.$t("settings.submit"),
        ext: {
          click: this.onClick,
        },
        type: "Submit",
        key: "homeSubmit",
      };
    },
    getSchema() {
      var schema = [
        {
          label: this.$t("settings.home_page_items"),
          type: "Header",
          key: "homePageitems",
        },
        // {
        //   label: this.$t("settings.feedback"),
        //   ext: {
        //     true: this.$t("settings.visible"),
        //     false: this.$t("settings.hidden"),
        //   },
        //   type: Boolean,
        //   key: "feedbackVisibility",
        // },
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
          label: this.$t("settings.information_panel_visibility"),
          ext: {
            true: this.$t("settings.visible"),
            false: this.$t("settings.hidden"),
          },
          type: Boolean,
          key: "panelVisibility",
        },
        {
          label: this.$t("settings.slideshow"),
          type: "Header",
          key: "slideshow",
        },
        {
          label: this.$t("settings.loop_public_dashboard"),
          ext: {
            true: this.$t("settings.yes"),
            false: this.$t("settings.no"),
          },
          type: Boolean,
          key: "publicLoop",
        },
        {
          label: this.$t("settings.loop_private_dashboard"),
          ext: {
            true: this.$t("settings.yes"),
            false: this.$t("settings.no"),
          },
          type: Boolean,
          key: "privateLoop",
        },
        {
          label: this.$t("settings.panel_loop_interval"),
          description: this.$t("settings.panel_loop_interval_description"),
          type: Number,
          defaultValue: 300000,
          key: "slideshowLoopInterval",
        },
      ];

      let r = RenRoles.REN_ADMIN | RenRoles.REN_MANAGER | RenRoles.REN_TECHNICAL_MANAGER;
      // TODO: get list of public panel
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

      if (r & this.$store.getters["auth/renRole"]) {
        var opts = this.$store.getters["view/informationPanels"];

        schema.push({
          label: this.$t("settings.home_panel"),
          description: this.$t("settings.home_panel_description"),
          type: Array,
          ext: {
            options: opts,
            optionLabel: "label",
            optionValue: "id",
          },
          defaultValue: null,
          key: "homePanel",
        });
      }
      //TODO: get panel list from store
      // if (this.panels.length > 0) {
      //   schema.push({
      //     label: this.$t("settings.selected_panel"),
      //     ext: {
      //       options: this.panels,
      //       optionLabel: "label",
      //       optionValue: "id",
      //     },
      //     type: Array,
      //     key: "selectedPanel",
      //   });
      // }
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
