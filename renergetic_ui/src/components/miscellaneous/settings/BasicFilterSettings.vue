<template>
  <Settings :schema="schema" :settings="settings" :columns="columns" :labels="labels" />
  <!-- {{ $store.getters["settings/all"].filters }} -->
  <!-- {{ schema }}{{ settings }} -->
  <!-- {{ settings }} -->
</template>

<script>
import Settings from "./Settings.vue";
// function setSettings(s) {
//   if (s.date_from) s.date_from = new Date(s.date_from);
//   if (s.date_to) s.date_to = new Date(s.date_to);
//   return s;
// }
function validateDateInterval(s) {
  // if (s.date_to && s.date_from && s.date_to.getTime() < s.date_from.getTime()) {
  //   s.date_to = new Date(s.date_from.getTime() + 15 * 60000);
  // }
  if (s.date_to && s.date_from && s.date_to < s.date_from) {
    s.date_to = new Date(s.date_from + 15 * 60000);
  }
  return s;
  // this.updateModel();
}
export default {
  name: "BasicFilterSettings",
  components: {
    Settings,
  },
  props: {
    columns: { type: Number, default: 12 },
    settingKey: { type: String, default: "filter" },
    submitButton: { type: Boolean, default: true },
    labels: { type: Boolean, default: true },
  },
  emits: ["update"],
  data() {
    // let settings = setSettings(this.$store.getters["settings/filters"](this.settingKey));
    let settings = this.$store.getters["settings/filters"](this.settingKey);
    return {
      //https://vueschool.io/lessons/dynamic-vuex-getters
      settings: settings,

      timeIntervalType: settings.timeIntervalType,
      schema: {},
    };
  },
  computed: {},
  watch: {
    //watch only without submit button
    settings: {
      handler: function (newVal) {
        validateDateInterval(newVal);
        if (newVal["timeIntervalType"] != this.timeIntervalType) {
          this.schema = this.getSchema();
        }
        if (this.submitButton) return;
        newVal["predictionIntervalms"] = newVal.predictionInterval * 3600;
        console.info(newVal.date_from);
        console.info(newVal.date_from instanceof Date);
        if (newVal.date_from && newVal.date_from instanceof Date) newVal.date_from = newVal.date_from.getTime();
        if (newVal.date_to && newVal.date_to instanceof Date) newVal.date_to = newVal.date_to.getTime();
        this.$store.commit("settings/filters", { payload: newVal, key: this.settingKey });
        this.$emit("update");
      },
      deep: true,
    },
  },
  async mounted() {
    // this.settings = setSettings(this.$store.getters["settings/filters"](this.settingKey));
    this.settings = this.$store.getters["settings/filters"](this.settingKey);
    this.timeIntervalType = this.settings.timeIntervalType;
    // await this.$ren.dashboardApi.listInformationPanel().then((panels) => {
    //   this.panels = panels;
    // });
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
      let mSettings = { ...this.settings };
      mSettings["predictionIntervalms"] = mSettings.predictionInterval * 3600;
      if (mSettings.date_from) mSettings.date_from = mSettings.date_from.getTime();
      if (mSettings.date_to) mSettings.date_to = mSettings.date_to.getTime();
      // this.settings["predictionIntervalms"] = this.settings.predictionInterval * 3600;
      this.$store.commit("settings/filters", mSettings, this.settingKey);

      await this.$ren.utils.saveSettings();

      this.$emit("update");
    },
    getTimeIntrvalSchema() {
      var isCustomInterval = this.settings && this.settings["timeIntervalType"] == "custom_interval";
      if (!isCustomInterval) return [];
      else {
        return [
          {
            label: this.$t("settings.date_from"),
            ext: {},
            type: "Datetime",
            key: "date_from",
          },
          {
            label: this.$t("settings.date_to"),
            ext: {},
            type: "Datetime",
            key: "date_to",
          },
        ];
      }
    },
    getSchema() {
      var schema = [
        {
          label: this.$t("settings.time_filter"),
          ext: {
            options: [
              { id: "current_day", label: this.$t("settings.time_filters.current_day") },
              { id: "last_24h", label: this.$t("settings.time_filters.last_24h") },
              { id: "last_week", label: this.$t("settings.time_filters.last_week") },
              { id: "current_month", label: this.$t("settings.time_filters.current_month") },
              { id: "current_year", label: this.$t("settings.time_filters.current_year") },
              { id: "previous_year", label: this.$t("settings.time_filters.previous_year") },
              { id: "custom_interval", label: this.$t("settings.time_filters.custom_interval") },
            ],
            optionLabel: "label",
            optionValue: "id",
          },
          type: Array,
          key: "timeIntervalType",
        },
        ...this.getTimeIntrvalSchema(),
        {
          label: this.$t("settings.prediction_interval"),
          ext: {
            valueTemplate: (v) => this.$t("settings.templates.prediction_interval", [v]),
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
