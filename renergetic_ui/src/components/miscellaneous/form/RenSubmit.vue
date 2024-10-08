<template>
  <div class="field grid" style="max-width: 31.25rem; margin: auto; padding-top: 1rem">
    <Button class="col-12 md:col-4" :disabled="disabled" :label="mSubmitLabel" @click="$emit('submit')" />
    <div class="col-12 md:col-4" />
    <Button v-if="cancelButton" class="col-12 md:col-4" :label="$t('view.button.cancel')" @click="$emit('cancel')" />
  </div>
</template>

<script>
//TODO: submit/cancel handler as optional properties ?
export default {
  name: "RenSubmit",
  props: {
    disabled: { type: Boolean, default: false },
    cancelButton: { type: Boolean, default: false },
    submitLabel: { type: String, default: null },
  },
  emits: ["cancel", "submit"],
  data() {
    return { mSubmitLabel: this.submitLabel ? this.submitLabel : this.$t("view.button.submit") };
  },
};
</script>
<style></style>
