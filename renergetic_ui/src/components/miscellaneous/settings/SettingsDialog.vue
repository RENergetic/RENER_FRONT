<template>
  <Dialog
    v-model:visible="dialogVisibility"
    :style="{ width: '50vw' }"
    :maximizable="true"
    :modal="true"
    :dismissable-mask="true"
    @hide="onClose"
  >
    <!-- @after-hide="" -->
    <slot name="settings" />
  </Dialog>
</template>

<script>
export default {
  name: "SettingsDialog",
  data() {
    return { dialogVisibility: false };
  },
  watch: {
    // dialogVisibility: {
    //   handler: function (newVal) {},
    //   deep: true,
    // },
  },
  methods: {
    open() {
      this.dialogVisibility = true;
    },
    close() {
      this.dialogVisibility = false;
    },
    onClose() {
      this.$ren.utils.saveSettings();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
