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
    if (this.$store.getters["auth/isAuthenticated"] && localStorage.getItem("authenticated")) {
      console.debug("User is authenticated");
      setTimeout(() => this.$router.push({ path: "/" }), 2000);
    }
    if (localStorage.getItem("authenticated") === null) {
      localStorage.setItem("authenticated", 0);
      setTimeout(() => window.location.reload(), 500);
    }
  },
  async mounted() {},
  // async updated() {
  //   await this.loadStructure();
  // },

  methods: {},
};
</script>

<style lang="scss"></style>
