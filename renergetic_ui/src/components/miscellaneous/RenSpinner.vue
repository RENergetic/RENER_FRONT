<template>
  <div ref="spinnerContent" :class="'ren-spinner-wrapper ' + inputClass">
    <!-- <ProgressSpinner><slot name="content" /></ProgressSpinner> -->
    <slot name="content" />
    <div v-if="!isContent" class="spinner-default-content" />
    <div v-if="counter && mLock" class="ren-spinner-bg">
      <!-- {{ size }} -->
    </div>
    <ProgressSpinner v-if="counter" class="ren-spinner" :stroke-width="strokeWidth"></ProgressSpinner>
  </div>
</template>
<script>
import ProgressSpinner from "primevue/progressspinner";
export default {
  name: "Spinner",
  components: { ProgressSpinner },
  props: {
    lock: { default: null, type: Boolean },
    inputClass: { default: "", type: String },
  },
  data() {
    return {
      isContent: !!this.$slots.content,
      size: 0,
      strokeWidth: 2,
      counter: 0,
    };
  },
  computed: {
    mLock: function () {
      return this.lock != null ? this.lock : this.isContent;
    },
  },
  watch: {},
  updated() {
    this.update();
  },
  mounted() {
    this.update();
  },
  methods: {
    update() {
      this.size = Math.min(this.$refs.spinnerContent.clientHeight, this.$refs.spinnerContent.clientWidth);
      this.strokeWidth = this.size;
      // console.info(this.size);
      // console.info(this.$refs.spinnerContent.clientHeight);
      // console.info(this.$refs.spinnerContent.clientWidth);
      this.strokeWidth = Math.min(8, Math.max(2, this.size / 150));
    },

    async run(handler) {
      this.start();
      try {
        // await new Promise((r) => setTimeout(r, 600000));
        await handler();
        // await new Promise((r) => setTimeout(r, 600000));
      } finally {
        this.stop();
      }
    },
    start() {
      this.counter++;
    },
    stop() {
      this.counter--;
    },
  },
};
</script>
<style scoped lang="scss">
.ren-spinner-wrapper {
  position: relative;
  width: max-content;
  min-width: 5rem;
  min-height: 5rem;
}
.spinner-default-content {
  height: 6.7rem;
  width: 6.7rem;
}
.ren-spinner {
  position: absolute;
  max-width: 75%;
  max-height: 75%;
  min-width: 20%;
  min-height: 20%;
  height: 5rem;
  width: 5rem;
  right: 5%;
  bottom: 5%;
}
.ren-spinner-bg {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.5);
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>
