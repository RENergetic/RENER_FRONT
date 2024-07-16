<template>
  <div :key="position" :style="mStyle">
    <canvas :id="mId"></canvas>
  </div>
</template>
<script>
var QRCode = require("qrcode");
export default {
  name: "QRCode",
  components: {},

  props: {
    position: { type: String, default: "" },
    modelValue: {
      type: String,
      default: "localhost:9985/api/user/profile/settings?some_arfsdddddssd",
    },
    size: { type: Number, default: 150 },
  },
  data() {
    return { mStyle: this.getStyle(this.position) };
  },
  computed: {},

  async mounted() {
    var canvas = document.getElementById(this.mId);
    canvas.style.width = `${this.size}px`;
    canvas.style.height = `${this.size}px`;
    await QRCode.toCanvas(canvas, this.modelValue, function (error) {
      if (error) console.error(error);
      console.log("success!");
    });
  },
  methods: {
    getStyle(position) {
      let mStyle = "";

      switch (position) {
        case "top_left":
          mStyle = "left:0.5rem;top:5rem;position: fixed; z-index:1500";
          break;
        case "bottom_right":
          mStyle = "right:0.5rem;bottom:1rem;position: fixed; z-index:1500";
          break;
        case "bottom_left":
          mStyle = "left:0.5rem;bottom:1rem;position: fixed; z-index:1500";
          break;
        case "top_right":
          mStyle = "right:0.5rem;top:3rem;position: fixed; z-index:1500";
          break;
        // case "default":
        //   mStyle = " ";
        //   break;
        default:
          mStyle = " ";
          break;
      }
      return mStyle;
    },
    initStyle() {
      let mStyle = this.getStyle(this.position);
      this.mStyle = mStyle;
    },
  },
};
</script>

<style lang="scss"></style>
