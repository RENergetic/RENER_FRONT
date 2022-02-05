<template>
  <Card>
    <template v-if="mArea != null" #title>
      <div class="flex">
        <div class="flex flex-grow-1">{{ mArea.label }}</div>
        <div class="flex flex-none">
          <i v-if="edit" class="pi pi-times" style="fontsize: 2rem" k="" e="d" />
        </div>
      </div>
      <div class="flex flex-row flex-wrap justify-content-start">
        <div class="flex flex-none">
          <i class="pi pi-chart-line" style="fontsize: 2rem" @click="viewMeasurements()" />
        </div>
        <div class="flex flex-none">
          <i v-if="edit" class="pi pi-plus" style="fontsize: 2rem" @click="() => (manageSensorsDialog = !manageSensorsDialog)" />
        </div>
        <div class="flex flex-none">
          <i v-if="edit" class="pi pi-link" style="fontsize: 2rem" @click="selectHeatmap" />
        </div>
      </div>
      <!-- todo remove following icon -->
    </template>
    <template v-else #title>
      {{ $t("view.selected_area") }}
    </template>
    <template v-if="mArea != null" #content>
      <div class="field grid">
        <label for="heatmapLabel">
          {{ $t("model.heatmap.label") }}
        </label>
        <InputText id="heatmapLabel" v-model="mArea.label" :aria-readonly="!edit" />
      </div>
      <div>
        <div v-if="mArea.dashboard">
          {{ $t("model.heatmap.dashboard") }}
          <i v-if="edit" class="pi pi-chart-line" @click="selectDashboard" />

          <i
            class="pi pi-arrow-circle-right"
            style="fontsize: 2rem"
            @click="$router.push(`/dashboard/heatmap/view/${mArea.dashboard.id}`)"
          />hhh
        </div>
        <div v-else>
          {{ $t("view.select_dashboard") }}
        </div>
      </div>
    </template>
    <!-- <template v-else #content>
   
      <div class="field grid">
        <label for="heatmapLabel">
          {{ $t("model.heatmap.label") }}
        </label>
        <InputText
          id="heatmapLabel"
          aria-disabled="True"
          aria-placeholder="placeholder: todo:"
          :aria-readonly="!edit"
        />
      </div>
    </template> -->
  </Card>
  <div v-if="mArea">
    <Dialog
      v-model:visible="measurementDialog"
      :style="{ width: '75vw' }"
      :maximizable="true"
      :modal="true"
      :dismissable-mask="true"
    >
      <MeasurementChart v-if="mArea != null" :objects="[mArea.id]"></MeasurementChart>
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
    <HeatMapSelect ref="dashboardDialog" :current="mArea.dashboard" @change="updateHeatMap"></HeatMapSelect>
    <DashboardSelect></DashboardSelect>
  </div>
</template>
<script>
import Card from "primevue/card";
import MeasurementChart from "../dashboard/measurements/MeasurementChart.vue";
import ManageSensors from "../dashboard/measurements/ManageSensors.vue";
import HeatMapSelect from "./HeatMapSelect.vue";
import DashboardSelect from "../dashboard/DashboardSelect.vue";

import Dialog from "primevue/dialog";
export default {
  name: "AreaDetails",
  components: {
    Card,
    Dialog,
    MeasurementChart,
    ManageSensors,
    HeatMapSelect,
    DashboardSelect,
  },
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
      heatMapDialog: false,
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
    selectHeatmap() {
      this.$refs.heatmapSelectDialog.open();
    },
    selectDashboard() {
      this.$refs.dashboardDialog.open();
    },
    viewMeasurements() {
      this.measurementDialog = true;
    },

    updateDashboard(dashboard) {
      this.mArea.dashboard = dashboard;
      // todo: save to api
    },
    updateHeatMap(heatmap) {
      this.mArea.heatmap = heatmap;
      // todo: save to api
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
i.pi {
  font-size: 1rem;
}
</style>
