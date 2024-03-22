<template>
  <Settings :schema="schema" :settings="settings"></Settings>
  <!-- {{ $store.getters["settings/filter"] }} -->
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
  name: "FilterSettings",
  components: {
    Settings,
  },
  props: {},
  emits: ["update"],
  data() {
    // let settings = setSettings(this.$store.getters["settings/filter"]);
    let settings = this.$store.getters["settings/filter"];
    return {
      settings: settings,
      timeIntervalType: settings.timeIntervalType,
      schema: {},
    };
  },
  computed: {},
  watch: {
    settings: {
      handler: function (newVal) {
        validateDateInterval(newVal);
        if (newVal["timeIntervalType"] != this.timeIntervalType) {
          this.schema = this.getSchema();
        }
        this.timeIntervalType = newVal.timeIntervalType;
      },
      deep: true,
    },
  },
  async mounted() {
    // this.settings = setSettings(this.$store.getters["settings/filter"]);
    this.settings = this.$store.getters["settings/filter"];
    this.timeIntervalType = this.settings.timeIntervalType;
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
      let mSettings = { ...this.settings };
      mSettings["predictionIntervalms"] = mSettings.predictionInterval * 3600;

      validateDateInterval(mSettings);
      // if (mSettings.date_from) mSettings.date_from = mSettings.date_from.getTime();
      // if (mSettings.date_to) mSettings.date_to = mSettings.date_to.getTime();
      this.$store.commit("settings/filter", mSettings);
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
