<template>
  <InfoIcon :show-icon="false">
    <template #content>
      <!-- some info -->
    </template>
  </InfoIcon>
  <Dialog v-model:visible="dialogVisibility" :style="{ width: 'max-content' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <!-- <Card v-if="modelValue">
      <template #content> -->
    <Textarea
      v-model="modelJSON"
      style="width: 100%; height: 70vh; max-width: 100%; min-height: 20rem; min-width: 20rem"
      :maxlength="40000"
      :cols="120"
      disabled
    ></Textarea>
    <!-- </template>
    </Card> -->
  </Dialog>
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
    reload: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:visible"],
  data() {
    let modelJSON = null;
    if (this.modelValue != null) {
      modelJSON = JSON.stringify(this.modelValue, null, "\t");
    }
    return {
      mMeasurement: this.modelValue ? JSON.parse(JSON.stringify(this.modelValue)) : {},
      modelJSON: modelJSON,
      dialogVisibility: this.visible,
    };
  },
  computed: {},
  watch: {
    dialogVisibility: function (v) {
      if (v != this.visible) {
        this.$emit("update:visible", v);
        if (v) {
          this.loadDetails();
        }
      }
    },
    visible: function (v) {
      this.dialogVisibility = v;
    },
  },
  mounted: function () {},
  methods: {
    async loadDetails() {
      if (this.mMeasurement.id == null) {
        console.debug("Measurement has no id ");
        this.modelJSON = JSON.stringify(this.mMeasurement, null, "\t");
        return;
      }
      if (this.reload) {
        await this.$ren.managementApi.getMeasurement(this.mMeasurement.id).then((m) => {
          this.mMeasurement = m;
        });
      }
      await this.$ren.managementApi.getMeasurementProperties(this.mMeasurement.id).then((details) => {
        this.mMeasurement.measurement_details = details ? details : {};
        this.modelJSON = JSON.stringify(this.mMeasurement, null, "\t");
      });
    },
    show(m) {
      this.mMeasurement = m;
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
