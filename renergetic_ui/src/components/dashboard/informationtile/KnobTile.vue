<template>
  <div>
    <Knob v-model="value" :min="0" :max="1.0" />
  </div>
</template>
<script>
import Knob from "primevue/knob";
export default {
  name: "InformationTile",
  components: { Knob },
  props: {
    pdata: { type: Object, default: () => ({}) },
    tile: {
      type: Object,
      default: () => ({}),
    },
  },
  // data() {
  //   return {};
  // },
  computed: {
    value: function () {
      let v = this.pdata ? this.pdata[this.tile.props.key] : null;
      return v != null ? v : this.tile.props.value;
    },
  },

  mounted() {},
  methods: {},
};
</script>

<style lang="scss"></style>
