<template>
  <!-- <i v-if="$ren.utils.roundValue(valueDiff) > 0" class="pi pi-caret-up" style="font-size: 2rem" />
  <i v-else-if="$ren.utils.roundValue(valueDiff) < 0" class="pi pi-caret-down" style="font-size: 2rem" />  
  <i v-else class="pi pi-sort" style="font-size: 2rem" />
  -->
  <i style="display: flex; justify-content: center; align-items: center">
    <i
      v-if="mValue != null && mValue > 0"
      v-tooltip="$t('view.value_increased_by', { value: valueDiff })"
      class="pi pi-arrow-circle-up"
      style="font-size: 0.5em"
    />
    <i
      v-else-if="mValue != null && mValue < 0"
      v-tooltip="$t('view.value_decreased_by', { value: -valueDiff })"
      class="pi pi-arrow-circle-down"
      style="font-size: 0.5em"
    />
    <i v-else-if="mValue != null" v-tooltip="$t('view.value_not_changed')" class="pi pi-circle" style="font-size: 0.5em" />
  </i>
</template>

<script>
//TODO: submit/cancel handler as optional properties ?
export default {
  name: "RenValueCompare",
  props: {
    baseValue: { type: Number, default: null },
    valueDiff: { type: Number, default: null },
    relative: { type: Boolean, default: false },
  },
  emits: ["cancel", "submit"],
  data() {
    return { mSubmitLabel: this.submitLabel ? this.submitLabel : this.$t("view.button.submit") };
  },
  computed: {
    mValue: function () {
      if (this.valueDiff == null) {
        return null;
      }
      let mValue;
      if (this.relative && this.baseValue != null) {
        mValue = ((1.0 * this.valueDiff) / this.baseValue) * 100.0;
      } else {
        mValue = this.valueDiff;
      }
      return this.$ren.utils.roundValue(mValue);
    },
  },
};
</script>
<style scoped>
i {
  margin: 0.12em;
  font-size: max(0.5em, 1.5rem);
}
</style>
