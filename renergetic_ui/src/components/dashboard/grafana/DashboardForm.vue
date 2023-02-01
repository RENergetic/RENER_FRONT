<template>
  <Card>
    <template #title>
      <span v-if="dashboard"> {{ $t("view.edit_dashboard") }}</span>
      <span v-else> {{ $t("view.add_dashboard") }}</span>
    </template>
    <template #content>
      <div class="ren">
        <!-- {{ mDashboard }} -->
        <!--name-->
        <div class="field grid">
          <label for="dasboardName" class="col-12 mb-2 md:col-2 md:mb-0">
            {{ $t("model.dashboard.name") }}
          </label>

          <div class="col-12 md:col-10">
            <InputText id="dasboardName" v-model="mDashboard.name" />
          </div>

          <span v-if="v$.mDashboard.name.$invalid">
            <span v-for="(error, index) of v$.mDashboard.name.$silentErrors" id="name-error" :key="index">
              <small class="p-error">{{ error.$message }}</small>
            </span>
          </span>
          <!-- {{ v$.mDashboard.name.$invalid }}
          {{ v$.mDashboard.name.$silentErrors }} -->
        </div>
        <!--url-->

        <div class="field grid">
          <label for="dasboardUrl" class="col-12 mb-2 md:col-2 md:mb-0">
            {{ $t("model.dashboard.url") }}
          </label>

          <div class="col-12 md:col-10"><InputText id="dasboardUrl" v-model="mDashboard.url" /></div>
          <span v-if="v$.mDashboard.url.$invalid">
            <span v-for="(error, index) of v$.mDashboard.url.$silentErrors" id="url-error" :key="index">
              <small class="p-error">{{ error.$message }}</small>
            </span>
          </span>
        </div>

        <!-- label -->

        <div class="field grid">
          <label for="dasboardLabel" class="col-12 mb-2 md:col-2 md:mb-0"> {{ $t("model.dashboard.label") }} </label>

          <div class="col-12 md:col-10">
            <InputText id="dasboardLabel" v-model="mDashboard.label" />
          </div>
          <span v-if="v$.mDashboard.label.$invalid">
            <span v-for="(error, index) of v$.mDashboard.label.$silentErrors" id="label-error" :key="index">
              <small class="p-error">{{ error.$message }}</small>
            </span>
          </span>
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
          <Button :disabled="v$.$invalid" :label="$t('view.button.submit')" @click="submit" />
          <!-- <Button :label="$t('view.button.cancel')" @click="cancel" /> -->
          <!-- <div class="col-6 md:col-6"></div>
          <div class="col-6 md:col-6"></div> -->

          <!-- {{ v$.$silentErrors }} -->
        </div>
      </div>
    </template>
  </Card>
</template>
<script>
import { useVuelidate } from "@vuelidate/core";
// import { url, maxLength } from "@vuelidate/validators";
import { required, minLength, url, maxLength } from "@/plugins/validators.js";
// requiredTr
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
  setup: () => ({ v$: useVuelidate() }),
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
  validationConfig: {
    $lazy: true,
  },
  validations() {
    return {
      mDashboard: {
        name: {
          required,
          minLength: minLength(5),
          maxLength: maxLength(50),
        },
        url: {
          required,
          url,
          // uri: or(url, ipAddress),
        },
        label: { minLength: minLength(3), maxLength: maxLength(50) },
      },
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
    // cancel() {
    //   this.$emit("cancel");
    // },
    async submit() {
      this.$emit("save", this.mDashboard);
    },
  },
};
</script>

<style lang="scss"></style>
