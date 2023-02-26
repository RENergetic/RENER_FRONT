<template>
  <Settings :schema="schema" :settings="settings"></Settings>
</template>

<script>
import Settings from "./Settings.vue";
export default {
  name: "ConversionSettings",
  components: {
    Settings,
  },

  props: { submit: { type: Boolean, default: false } },
  emits: ["update"],
  data() {
    return {
      settings: this.$store.getters["settings/conversion"],
      schema: {},
    };
  },
  computed: {},
  watch: {
    settings: {
      handler: function (newVal) {
        this.$store.commit("settings/conversion", newVal);
        this.$emit("update");
      },
      deep: true,
    },
  },
  mounted() {
    this.schema = this.getSchema();
  },

  async created() {
    this.schema = this.getSchema();
  },
  methods: {
    async onClick() {
      this.$store.commit("settings/conversion", this.settings);
      if (this.$store.getters["auth/isAuthenticated"]) await this.$ren.utils.saveSettings();
    },
    submitButton() {
      return {
        label: this.$t("settings.submit"),
        ext: {
          click: this.onClick,
        },
        type: "Submit",
        key: "conversionSubmit",
      };
    },
    getSchema() {
      var types = this.$store.getters["view/measurementTypes"];
      var schema = [];
      for (let mtKey in types) {
        let mtList = types[mtKey].map((mt) => {
          return {
            id: mt.unit,
            label: mt.unit,
          };
        });

        schema.push({
          label: this.$t("settings.measurement_type." + mtKey),
          ext: {
            options: mtList,
            optionLabel: "label",
            optionValue: "id",
          },
          type: Array,
          key: mtKey,
        });
      }

      // var schema = [
      //   {
      //     label: this.$t("settings.notification"),
      //     ext: {
      //       true: this.$t("settings.visible"),
      //       false: this.$t("settings.hidden"),
      //     },
      //     type: Boolean,
      //     key: "notificationVisibility",
      //   },

      // ];
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
