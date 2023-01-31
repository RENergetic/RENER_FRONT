<template>
  <Card>
    <template #title>
      <span v-if="dashboard"> {{ $t("view.add_dashboard") }}</span>
      <span v-else> {{ $t("view.edit_dashboard") }}</span>
    </template>
    <template #content>
      {{ mDashboard }}
      <!--name-->
      <div class="field grid">
        <label for="dasboardName" class="col-12 mb-2 md:col-2 md:mb-0">
          {{ $t("model.dashboard.name") }}
        </label>

        <div class="col-12 md:col-10">
          <InputText id="dasboardName" v-model="mDashboard.name" />
        </div>
      </div>
      <!--url-->

      <div class="field grid">
        <label for="dasboardUrl" class="col-12 mb-2 md:col-2 md:mb-0">
          {{ $t("model.dashboard.url") }}
        </label>

        <div class="col-12 md:col-10"><InputText id="dasboardUrl" v-model="mDashboard.url" /></div>
      </div>

      <!-- label -->

      <div class="field grid">
        <label for="dasboardLabel" class="col-12 mb-2 md:col-2 md:mb-0"> {{ $t("model.dashboard.label") }} </label>

        <div class="col-12 md:col-10">
          <InputText id="dasboardLabel" v-model="mDashboard.label" />
        </div>
      </div>
      <!-- label -->

      <div class="field grid">
        <label for="dasboardModel" class="col-12 mb-2 md:col-2 md:mb-0"> {{ $t("model.dashboard.model") }} </label>

        <div class="col-12 md:col-10">
          <Dropdown
            id="dasboardModel"
            v-model="mDashboard.ext.model"
            option-label="label"
            option-value="name"
            :options="$store.getters['view/dashboardModels']"
            :placeholder="$t('view.select_dashboard_model')"
          />
        </div>
      </div>
      <div class="field grid">
        <label for="dasboardUnit" class="col-12 mb-2 md:col-2 md:mb-0"> {{ $t("model.dashboard.unit") }} </label>
        <div class="col-12 md:col-10">
          <Dropdown
            id="dasboardUnit"
            v-model="mDashboard.ext.unit"
            :option-label="(opt) => `[${opt.symbol}]`"
            option-value="name"
            :options="$store.getters['view/dashboardUnits']"
            :placeholder="$t('view.select_dashboard_unit')"
          />
        </div>
      </div>
      <div class="field grid">
        <label for="dashboardMeasurementType" class="col-12 mb-2 md:col-2 md:mb-0">
          {{ $t("model.dashboard.measurement_type") }}
        </label>

        <div class="col-12 md:col-10">
          <Dropdown
            id="dashboardMeasurementType"
            v-model="mDashboard.ext.measurement_type"
            :option-label="(opt) => $t('enums.dashboard_measurement_types.' + opt)"
            :options="measurementTypes"
            :placeholder="$t('view.select_dashboard_measurement_type')"
          />
        </div>
      </div>

      <div class="field grid">
        <div class="col-6 md:col-6"><Button :label="$t('view.button.submit')" @click="submit" /></div>
        <div class="col-6 md:col-6">
          <Button :label="$t('view.button.cancel')" @click="cancel" />
        </div>
      </div>
    </template>
  </Card>
</template>
<script>
//TODO: validate
import Card from "primevue/card";
import { DashboardMeasurementTypes } from "@/plugins/model/Enums.js";
export default {
  name: "DashboardForm",
  components: { Card },
  props: {
    dashboard: {
      type: Object,
      default: null,
    },
  },
  emits: ["update:modelValue", "save", "cancel"],
  data() {
    let mDashboard = this.dashboard ? this.dashboard : { ext: {} };
    if (!mDashboard.ext) {
      mDashboard.ext = {};
    }
    return {
      mDashboard: mDashboard,
      models: this.$store.getters["view/dashboardModels"],
      units: this.$store.getters["view/dashboardUnits"],
      measurementTypes: Object.keys(DashboardMeasurementTypes),
    };
  },
  watch: {
    mDashboard: {
      handler(newVal, oldValue) {
        if (oldValue == null && newVal == null) {
          return;
        }
        this.$emit("update:modelValue", newVal);
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {},
  methods: {
    clear() {
      this.mDashboard = {};
    },
    cancel() {
      this.$emit("cancel");
    },
    async submit() {
      this.$emit("save", this.mDashboard);
    },
  },
};
</script>

<style lang="scss"></style>
