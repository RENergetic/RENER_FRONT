<template>
  <Settings :schema="schema" :settings="settings"></Settings>
  <!-- {{ $store.getters["settings/all"].filters }} -->
</template>

<script>
import Settings from "./Settings.vue";
export default {
  name: "BasicFilterSettings",
  components: {
    Settings,
  },
  props: {
    settingKey: { type: String, default: "filter" },
  },
  emits: ["update"],
  data() {
    return {
      //https://vueschool.io/lessons/dynamic-vuex-getters
      settings: this.$store.getters["settings/filters"](this.settingKey),

      schema: {},
    };
  },
  computed: {},
  async mounted() {
    (this.settings = this.$store.getters["settings/filters"](this.settingKey)),
      await this.$ren.dashboardApi.listInformationPanel().then((panels) => {
        this.panels = panels;
      });
    // .then(() => {
    //   this.schema = this.getSchema();
    // });
    this.schema = this.getSchema();
  },

  async created() {
    this.schema = this.getSchema();
  },
  methods: {
    async onClick() {
      this.settings["predictionIntervalms"] = this.settings.predictionInterval * 3600;
      this.$store.commit("settings/filter", this.settings, this.settingKey);

      await this.$ren.utils.saveSettings();
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
          label: this.$t("settings.prediction_interval"),
          ext: {
            max: 48,
            unit: "h",
          },
          type: Number,
          mode: "slider",
          key: "predictionInterval",
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
