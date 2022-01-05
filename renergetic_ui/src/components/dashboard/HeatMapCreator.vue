<template>
  <div id="dashboard"></div>
</template>
<script>
export default {
  name: "HeatMapCreator",
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
#dashboard {
  position: relative;
  height: 100%;
  width: 100%;
  display: inline-block;
}
</style>
