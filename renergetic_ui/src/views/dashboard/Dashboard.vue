<template>
  <div>test <Grafana /></div>
</template>
<script>
import Grafana from "../../components/dashboard/Grafana.vue";
export default {
  name: "Dashboard",
  components: { Grafana },
  computed: {
    // isLoading() {
    //   return this.$store.getters["spinner/isLoading"];
    // },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss"></style>
