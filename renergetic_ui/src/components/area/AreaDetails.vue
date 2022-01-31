<template>
  <Card>
    <template v-if="mArea != null" #title>
      <!-- todo remove following icon -->
      <i
        class="pi pi-times"
        style="fontsize: 2rem"
        @click="viewMeasurements()"
      />
      <span v-if="edit">{{ $t("view.edit_area") }} </span>
      <span v-else>
        <i
          class="pi pi-times"
          style="fontsize: 2rem"
          @click="viewMeasurements()"
        />
        {{ $t("view.view_area") }}
      </span>
      <i
        v-if="edit"
        class="pi pi-pencil"
        style="fontsize: 2rem"
        @click="() => (manageSensorsDialog = !manageSensorsDialog)"
      />
      <i
        v-if="edit"
        class="pi pi-times"
        style="fontsize: 2rem"
        @click="deleteArea()"
      />
    </template>
    <template v-else #title>
      {{ $t("view.select_area") }}
    </template>
    <template v-if="mArea != null" #content>
      <!-- {{ area.id }} -->
      <div class="p-field p-grid">
        <label for="heatmapLabel">
          {{ $t("heatmap.label") }}
        </label>
        <InputText
          id="heatmapLabel"
          v-model="mArea.label"
          :aria-readonly="!edit"
        />
      </div>
      <div v-if="mArea && mArea.dashboard">
        {{ $t("heatmap.dashboard") }}
        <i
          class="pi pi-times"
          style="fontsize: 2rem"
          @click="$router.push(`/dashboard/heatmap/view/${mArea.dashboard.id}`)"
        />
      </div>
    </template>
    <template v-else #content>
      <!-- {{ area.id }} -->
      <div class="p-field p-grid">
        <label for="heatmapLabel">
          {{ $t("heatmap.label") }}
        </label>
        <InputText
          id="heatmapLabel"
          aria-disabled="True"
          aria-placeholder="placeholder: todo:"
          :aria-readonly="!edit"
        />
      </div>
    </template>
  </Card>
  <Dialog
    v-model:visible="measurementDialog"
    :style="{ width: '75vw' }"
    :maximizable="true"
    :modal="true"
    :dismissable-mask="true"
  >
    <MeasurementChart
      v-if="mArea != null"
      :objects="[mArea.id]"
    ></MeasurementChart>
  </Dialog>
  <Dialog
    v-model:visible="manageSensorsDialog"
    :style="{ width: '75vw' }"
    :maximizable="true"
    :modal="true"
    :dismissable-mask="true"
  >
    <ManageSensors></ManageSensors>
  </Dialog>
</template>
<script>
import Card from "primevue/card";
import MeasurementChart from "../dashboard/measurements/MeasurementChart.vue";
import ManageSensors from "../dashboard/measurements/ManageSensors.vue";

import Dialog from "primevue/dialog";
export default {
  name: "AreaDetails",
  components: { Card, Dialog, MeasurementChart, ManageSensors },

  props: {
    edit: {
      type: Boolean,
      default: true,
    },
    modelValue: {
      type: Object,
      default: () => null,
    },
  },
  emits: ["delete", "update:modelValue"],
  data() {
    return {
      label: this.modelValue != null ? this.modelValue.label : null,
      mArea: null,
      measurementDialog: false,
      manageSensorsDialog: false,
    };
  },
  watch: {
    mArea: {
      handler(newVal, oldValue) {
        if (oldValue == null && newVal == null) {
          return;
        }
        this.$emit("update:modelValue", newVal);
      },
      deep: true,
      immediate: true, //  the callback will be called immediately after the start of the observation
    },
    modelValue: function (newVal) {
      this.mArea = newVal;
    },
  },
  methods: {
    viewMeasurements() {
      this.measurementDialog = true;
    },
    deleteArea() {
      this.$confirm.require({
        message: this.$t("view.heatmap_area_delete_confirm", {
          label: this.label,
        }),
        header: this.$t("view.heatmap_area_delete"),
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          this.$emit("delete", this.mArea);
        },
        reject: () => {
          this.$confirm.close();
        },
      });
    },
  },
};
</script>

<style lang="scss">
#heatmap {
  max-width: 75%;
  max-height: 75vh;
}
#heatmapContainer {
  padding: 0.5rem;
}
</style>
