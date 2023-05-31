<template>
  <!-- {{ $store.getters["settings/filters"](settingKey) }} -->
  <Settings :key="mSettings" :schema="schema" :settings="mSettings" :columns="columns" @update:settings="onUpdate"></Settings>
  <!-- {{ $store.getters["settings/filter"] }} -->
</template>

<script>
import Settings from "./Settings.vue";
export default {
  name: "NotificationFilter",
  components: {
    Settings,
  },
  props: { columns: { type: Number, default: 12 } },
  emits: ["update"],
  data() {
    var settingKey = "notification_filter";
    return {
      mSettings: { ...this.$store.getters["settings/filters"](settingKey) },
      settingKey: settingKey,
      schema: {},
    };
  },
  computed: {},
  watch: {},
  async mounted() {
    this.mSettings = { ...this.$store.getters["settings/filters"](this.settingKey) };
    this.schema = this.getSchema();
  },

  async created() {
    this.schema = this.getSchema();
  },
  methods: {
    onUpdate(evt) {
      var oldValue = this.$store.getters["settings/filters"](this.settingKey);

      let newVal = evt;
      // console.info(newVal);
      if (newVal["timeInterval"] != null && oldValue["timeInterval"] == null) {
        newVal["date_from"] = null;
        newVal["date_to"] = null;
      } else if (newVal["timeInterval"] && (newVal["date_from"] != null || newVal["date_to"] != null)) {
        newVal["timeInterval"] = null;
      }
      if (newVal["date_to"] != null && newVal["date_from"] == null) {
        //TODO:
        newVal["date_from"] = new Date(new Date(newVal["date_to"].getTime()).setHours(0, 0, 0, 0));
      }
      if (newVal["date_from"] != null && newVal["date_to"] != null && newVal["date_to"].getTime() < newVal["date_from"].getTime() - 15 * 60 * 1000) {
        newVal["date_from"] = new Date(newVal["date_to"].getTime() - 15 * 60 * 1000);
      }
      // newVal = { ...newVal };
      this.$store.commit("settings/filters", { payload: newVal, key: this.settingKey });
      this.mSettings = { ...newVal };
      this.$emit("update");
    },
    // async onClick() {
    //   this.$store.commit("settings/filters", { payload: this.mSettings, key: this.settingKey });
    //   await this.$ren.utils.saveSettings();
    //   this.$emit("update");
    // },
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
          label: this.$t("settings.date_from"),
          type: "Datetime",
          key: "date_from",
        },
        {
          label: this.$t("settings.date_to"),

          type: "Datetime",
          key: "date_to",
        },
        // {
        //   label: this.$t("settings.submit"),
        //   ext: {
        //     click: this.onClick,
        //   },
        //   type: "Submit",
        //   key: "filterSubmit",
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
