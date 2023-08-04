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
      // roles: RenRoles
    };
  },
  async created() {
    setTimeout(() => this.$router.push({ path: "/" }), 2000);
  },
  methods: {},
};
</script>
<style lang="scss"></style>
