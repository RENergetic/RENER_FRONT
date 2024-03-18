<template>
  <Calendar v-model="mValue" v-tooltip="description" :disabled="disabled" :show-time="true" hour-format="24" />
</template>

<script>
// import InfoIcon from "@/components/miscellaneous/InfoIcon.vue";

import Calendar from "primevue/calendar";
export default {
  name: "RenInput",
  components: { Calendar },
  props: {
    modelValue: {
      type: [Number],
      default: null,
      // default: () => {
      //   new Date().getDate;
      // }
    }, //Object,
    disabled: { type: Boolean, default: false },
    description: { type: String, default: null },
  },
  emits: ["update:modelValue", "submit"],
  data() {
    return { mValue: this.modelValue ? new Date(this.modelValue) : null };
  },
  watch: {
    mValue: {
      handler(newV) {
        if (newV) this.$emit("update:modelValue", newV.getTime());
        else this.$emit("update:modelValue", null);
      },
      // immediate: true,
    },
  },

  methods: {},
};
</script>
