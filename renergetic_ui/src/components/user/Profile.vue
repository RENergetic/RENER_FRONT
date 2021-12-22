<template>
  <div>aa {{ data }}aa</div>
</template>
<script>
export default {
  name: "Profile",
  components: {},
  data() {
    return { data: this.$store.getters["auth/current"] };
  },
  watch: {},
  mounted() {},
  methods: {},
};
</script>
<style lang="scss"></style>
