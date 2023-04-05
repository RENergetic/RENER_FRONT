<template>
  <Settings :schema="schema" :settings="settings" :columns="columns" />
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
    columns: { type: Number, default: 12 },
    settingKey: { type: String, default: "filter" },
    submitButton: { type: Boolean, default: true },
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
  watch: {
    //watch only without submit button
    settings: {
      handler: function (newVal) {
        if (this.submitButton) return;
        this.$store.commit("settings/filters", { payload: newVal, key: this.settingKey });
        this.$emit("update");
      },
      deep: true,
    },
  },
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
      this.$store.commit("settings/filters", this.settings, this.settingKey);

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
      ];
      if (this.submitButton) {
        schema.push({
          label: this.$t("settings.submit"),
          ext: {
            click: this.onClick,
          },
          type: "Submit",
          key: "filterSubmit",
        });
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
