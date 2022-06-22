<template>
  <div id="energy-flow">ENERGY FLOW COMPONENT</div>
</template>
<script>
export default {
  name: "EnergyFlow",
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
#energy-flow {
  display: block;
  width: 100%;
  height: 100%;
  background: rgba(255, 0, 247, 0.463);
  font-size: 30 rem;
  padding: 10%;
}
</style>
