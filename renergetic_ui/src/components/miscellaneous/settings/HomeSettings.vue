<template>
  <Settings :schema="schema" :model="model"></Settings>
</template>

<script>
import Settings from "./Settings.vue";
export default {
  name: "HomeSettings",
  components: {
    Settings,
  },
  props: {},
  emits: ["update"],
  data() {
    var schema = [
      {
        label: this.$t("settings.feedback"),
        ext: {
          true: this.$t("settings.visible"),
          false: this.$t("settings.hidden"),
        },
        type: Boolean,
        key: "feedback",
      },
      {
        label: this.$t("settings.notification"),
        ext: {
          true: this.$t("settings.visible"),
          false: this.$t("settings.hidden"),
        },
        type: Boolean,
        key: "notification",
      },
    ];
    return { model: this.$store.commit("settings/home"), schema: schema };
  },
  computed: {},
  watch: {
    model: {
      handler: function (newVal) {
        this.$store.commit("settings/home", newVal);
        this.$emit("update");
      },
      deep: true,
    },
  },

  async created() {},
  methods: {
    toggle(event) {
      this.$refs.menu.toggle(event);
    },
  },
};
</script>
<style scoped lang="scss"></style>
