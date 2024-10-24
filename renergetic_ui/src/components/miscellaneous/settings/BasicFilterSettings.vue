<template>
  <Settings :key="refresh" v-model:settings="settingsObj" :schema="schema" :columns="columns" :labels="labels" :disabled="disabled" />
</template>

<script>
import Settings from "./Settings.vue";
function validateDateInterval(s) {
  var modified = false;
  if (s.date_to && s.date_from && s.date_to < s.date_from) {
    s.date_to = new Date(s.date_from + 60 * 60000).getTime();
    modified = true;
  }
  if (!s.date_from && s.date_to) {
    s.date_from = new Date(s.date_to - 24 * 60 * 60000).getTime();
    modified = true;
  }
  return modified;
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
    settings: { type: Object, default: null },
    disabled: { type: Boolean, default: false },
  },
  emits: ["update", "update:settings"],
  data() {
    let settings = this.settings ? this.settings : this.$store.getters["settings/filters"](this.settingKey);

    return {
      //https://vueschool.io/lessons/dynamic-vuex-getters
      mSettings: settings,
      settingsObj: settings,
      refresh: false,
      timeIntervalType: settings.timeIntervalType,
      schema: {},
    };
  },
  watch: {
    //watch only without submit button
    settingsObj: {
      handler: function (newVal) {
        // console.debug("refresh");
        let mSettings = this.copyDateObj(newVal);
        var modified = validateDateInterval(mSettings);

        if (newVal["timeIntervalType"] != this.timeIntervalType) {
          this.timeIntervalType = newVal["timeIntervalType"];
          this.schema = this.getSchema();
          // modified = true;
        }
        if (modified) {
          this.refresh = !this.refresh;
          newVal.date_from = mSettings.date_from;
          newVal.date_to = mSettings.date_to;
        }
        if (this.submitButton) return;
        mSettings["predictionIntervalms"] = mSettings.predictionInterval * 3600;
        if (mSettings.date_from && mSettings.date_from instanceof Date) mSettings.date_from = mSettings.date_from.getTime();
        if (mSettings.date_to && mSettings.date_to instanceof Date) mSettings.date_to = mSettings.date_to.getTime();
        this.parseDateFilter(mSettings);
        if (this.settings) {
          this.$emit("update:settings", mSettings);
        } else {
          this.$store.commit("settings/filters", { payload: mSettings, key: this.settingKey });
          this.$emit("update");
        }
      },
      deep: true,
    },
  },
  async mounted() {
    this.mSettings = this.settings ? this.settings : this.$store.getters["settings/filters"](this.settingKey);
    let settingsObj = this.copyDateObj(this.mSettings);
    this.settingsObj = settingsObj;
    this.timeIntervalType = this.mSettings.timeIntervalType;
    this.schema = this.getSchema();
  },

  async created() {
    this.schema = this.getSchema();
  },
  methods: {
    copyDateObj(obj) {
      let settingsObj = {
        date_from: obj["date_from"],
        date_to: obj["date_to"],
        timeIntervalType: obj["timeIntervalType"],
      };
      return settingsObj;
    },
    async onClick() {
      let mSettings = { ...this.mSettings };
      mSettings["predictionIntervalms"] = mSettings.predictionInterval * 3600;
      validateDateInterval(mSettings);
      this.parseDateFilter(mSettings);
      if (this.settings) {
        this.$emit("update:settings", mSettings);
      } else {
        this.$store.commit("settings/filters", { payload: mSettings, key: this.settingKey });
        await this.$ren.utils.saveSettings();
        this.$emit("update");
      }
    },
    getTimeIntervalSchema() {
      var isCustomInterval = this.mSettings && this.mSettings["timeIntervalType"] == "custom_interval";
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
        ...this.getTimeIntervalSchema(),
        // {
        //   label: this.$t("settings.prediction_interval"),
        //   ext: {
        //     valueTemplate: (v) => this.$t("settings.templates.prediction_interval", [v]),
        //     max: 48,
        //     unit: "h",
        //   },
        //   type: Number,
        //   mode: "slider",
        //   key: "predictionInterval",
        // },
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
