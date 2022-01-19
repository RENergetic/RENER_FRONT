<template>
  <div style="display: block; width: 10rem; height: 20rem">
    todo view list of recommendation {{ recommendations }}
  </div>
</template>
<script>
// THEN to get HTML5 drag&drop
export default {
  name: "Dashboard",
  components: {},
  props: {
    recommendations: {
      type: Array,
      default: () => null,
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},

  methods: {},
};
</script>

<style lang="scss"></style>
