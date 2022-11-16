<template>
  <!-- {{ settings }} -->
  <Settings :schema="schema" :settings="settings"></Settings>
</template>

<script>
import Settings from "./Settings.vue";
import { allowedLocales } from "@/plugins/locales.js";
export default {
  components: {
    Settings,
  },
  emits: ["update"],
  data() {
    return {
      settings: this.$store.getters["settings/locales"],
    };
  },
  async created() {
    this.schema = this.getSchema();
  },
  methods: {
    onClick() {
      this.$store.commit("settings/locales", this.settings);
      this.$emitter.emit("localeSwitch", this.settings.selectedLocale);
    },
    getSchema() {
      let locales = Object.keys(allowedLocales).map((it) => ({ code: it }));
      var schema = [];
      schema.push({
        label: this.$t("settings.selected_locale"),
        ext: {
          options: locales,
          optionLabel: "code",
          optionValue: "code",
        },
        type: Array,
        key: "selectedLocale",
      });

      schema.push({
        label: this.$t("settings.submit"),
        ext: {
          click: this.onClick,
        },
        type: "Submit",
        key: "localeSubmit",
      });
      return schema;
    },
    toggle(event) {
      this.$refs.menu.toggle(event);
    },
  },
};
</script>
<style scoped lang="scss"></style>
