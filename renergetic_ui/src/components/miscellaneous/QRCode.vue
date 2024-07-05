<template>
  <div :style="mStyle">
    <canvas id="canvas"></canvas>
  </div>
</template>
<script>
var QRCode = require("qrcode");
export default {
  name: "QRCode",
  components: {},

  props: {
    position: { type: String, default: "top_right" },
    modelValue: {
      type: String,
      default: "localhost:9985/api/user/profile/settings?some_arfsdddddssd",
    },
    size: { type: Number, default: 150 },
  },
  data() {
    return { mStyle: "right:1rem;top:5rem;position: fixed; z-index:1500" };
  },
  computed: {},

  async mounted() {
    var canvas = document.getElementById("canvas");
    await QRCode.toCanvas(canvas, this.modelValue, function (error) {
      if (error) console.error(error);
      console.log("success!");
    });
    canvas.style.width = `${this.size}px`;
    canvas.style.height = `${this.size}px`;
  },
  methods: {
    initStyle() {
      let mStyle = "";

      switch (this.position) {
        case "top_left":
          mStyle = "left:1rem;top:5rem;position: fixed; z-index:1500";
          break;
        case "bottom_right":
          mStyle = "right:1rem;bottom:1rem;position: fixed; z-index:1500";
          break;
        case "bottom_left":
          mStyle = "left:1rem;bottom:1rem;position: fixed; z-index:1500";
          break;
        case "top_right":
          mStyle = "right:1rem;top:5rem;position: fixed; z-index:1500";
          break;
        default:
          mStyle = " ";
          break;
      }
      this.mStyle = mStyle;
    },
  },
};
</script>

<style lang="scss"></style>
