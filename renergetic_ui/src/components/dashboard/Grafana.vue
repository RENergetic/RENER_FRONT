<template>
  <div>
    current dashboard: {{ $route.params.dashboard_id }}
    {{ $route.params }}
    todo: toolbar{{ $store.getters["view/dashboards"] }}
  </div>
</template>
<script>
export default {
  name: "Grafana",
  components: {},
  computed: {
    // isLoading() {
    //   return this.$store.getters["spinner/isLoading"];
    // },
  },
  watch: {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss"></style>
