<template>
  <Dialog v-model:visible="dialogVisibility" :style="{ width: '50vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <!-- @hide="onClose" -->
    <slot name="settings" />
  </Dialog>
</template>

<script>
export default {
  name: "SettingsDialog",
  props: {
    save: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return { dialogVisibility: false };
  },
  watch: {
    dialogVisibility: {
      handler: function (newVal, oldVal) {
        if (newVal == false && oldVal) {
          this.onClose();
        }
      },
    },
  },
  methods: {
    open() {
      this.dialogVisibility = true;
    },
    close() {
      this.dialogVisibility = false;
    },
    async onClose() {
      console.info("onClose");
      if (this.save) await this.$ren.utils.saveSettings();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
