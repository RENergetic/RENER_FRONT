<template>
  {{ $t("login_success") }}
</template>
<script>
// import { RenRoles } from "../plugins/model/Enums.js";

export default {
  name: "LoginSuccess",
  components: {},
  data() {
    return {
      // roles: RenRoles,
      // settings: this.$store.getters["settings/home"],
    };
  },
  computed: {
    // hasAccess: function () {
    //   return (this.$store.getters["auth/renRole"] | RenRoles.REN_ADMIN) > 0;
    // },
  },
  async created() {
    setTimeout(() => this.$router.push({ path: "/" }), 5000);
  },

  methods: {},
};
</script>

<style lang="scss"></style>
