<template>
  <InfoIcon :show-icon="false">
    <template #content>
      <!-- some info -->
    </template>
  </InfoIcon>
  <Dialog v-model:visible="dialogVisibility" :style="{ width: '50vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <Card v-if="modelValue">{{ modelJSON }} </Card>
  </Dialog>
  <ren-submit :cancel-button="true" :disabled="v$.$invalid" @cancel="cancel" @submit="submit" />
</template>

<script>
import InfoIcon from "../../../miscellaneous/InfoIcon.vue";

export default {
  name: "MeasurementDialog",
  components: { InfoIcon },
  props: {
    modelValue: {
      type: Object,
      default: () => ({}),
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:visible"],
  data() {
    let modelJSON = null;
    if (this.modelValue != null) {
      modelJSON = JSON.stringify(this.modelValue);
    }
    return {
      modelJSON: modelJSON,
      dialogVisibility: this.visible,
    };
  },
  computed: {},

  methods: {
    show() {
      this.dialogVisibility = true;
      this.$emit("update:visible", true);
    },
    hide() {
      this.dialogVisibility = false;
      this.$emit("update:visible", false);
    },
  },
};
</script>
