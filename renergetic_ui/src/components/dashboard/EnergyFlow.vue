<template>
  <div id="graph">This ia another fantastic and creative ,kempt, innovative new graph view</div>
</template>
<script>
export default {
  name: "Grafana",
  components: {},
  props: {
    url: {
      type: String,
      default: null,
    },
  },
  // data() {
  //   return {};
  // },

  mounted() {},
  methods: {},
};
</script>

<style lang="scss">
#graph {
  display: block;
  width: 100%;
  height: 100%;
  background: rgba(255, 0, 247, 0.463);
}
</style>
