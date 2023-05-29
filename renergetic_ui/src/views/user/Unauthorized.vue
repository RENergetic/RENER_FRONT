<template>
  <div class="ren-card">
    <h2>{{ $t("view.unauthorized") }}</h2>
  </div>
</template>
<script>
export default {
  name: "Unauthorized",
  components: {},
  data() {
    return {};
  },

  computed: {},
  async created() {
    if (this.$store.getters["auth/isAuthenticated"]) setTimeout(() => this.$router.push({ path: "/" }), 2000);
  },
  async mounted() {},
  // async updated() {
  //   await this.loadStructure();
  // },

  methods: {},
};
</script>

<style lang="scss"></style>
