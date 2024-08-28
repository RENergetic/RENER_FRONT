<template>
  <Card>
    <template #title>
      <span v-if="dashboard"> {{ $t("view.edit_dashboard") }}</span>
      <span v-else> {{ $t("view.add_dashboard") }}</span>
    </template>
    <template #content>
      <div class="ren">
        <!-- {{ $store.getters["view/dashboardUnits"] }}   {{ measurementTypes }}  {{ mDashboard }} -->
        <ren-input
          v-model="mDashboard.name"
          :text-info="'model.name_description'"
          :text-label="'model.dashboard.name'"
          :invalid="v$.mDashboard.name.$invalid"
          :errors="v$.mDashboard.name.$silentErrors"
        />
        <!--url-->
        <ren-input
          v-model="mDashboard.url"
          :text-label="'model.dashboard.url'"
          :invalid="v$.mDashboard.url.$invalid"
          :errors="v$.mDashboard.url.$silentErrors"
        />

        <ren-input
          v-model="mDashboard.grafana_id"
          :text-label="'model.dashboard.grafana_id'"
          :invalid="v$.mDashboard.grafana_id.$invalid"
          :errors="v$.mDashboard.grafana_id.$silentErrors"
        />

        <ren-input
          v-model="mDashboard.label"
          :text-info="'model.label_description'"
          :text-label="'model.dashboard.label'"
          :invalid="v$.mDashboard.label.$invalid"
          :errors="v$.mDashboard.label.$silentErrors"
        />

        <!-- <ren-input-wrapper v-if="false" :text-label="'model.dashboard.model'">
          <template #content>
            <Dropdown
              id="dasboardModel"
              v-model="mDashboard.ext.model"
              option-label="label"
              option-value="name"
              :options="$store.getters['view/dashboardModels']"
              :placeholder="$t('view.select_dashboard_model')"
            />
          </template>
        </ren-input-wrapper> -->
        <ren-input-wrapper :text-label="'model.dashboard.measurement_type'">
          <template #content>
            <Dropdown
              id="dashboardMeasurementType"
              v-model="mDashboard.ext.measurement_type"
              :option-label="(opt) => $t('enums.dashboard_measurement_types.' + opt)"
              :options="measurementTypes"
              :placeholder="$t('view.select_dashboard_measurement_type')"
              @change="typeChange"
            />
          </template>
        </ren-input-wrapper>
        <ren-input-wrapper :text-label="'model.dashboard.unit'">
          <template #content>
            <Dropdown
              id="dasboardUnit"
              v-model="mDashboard.measurement_type"
              :option-label="(opt) => `[${opt.unit}]`"
              :options="mUnits"
              :placeholder="$t('view.select_dashboard_unit')"
            />
          </template>
        </ren-input-wrapper>
        <ren-submit :disabled="v$.$invalid" @submit="submit" />
      </div>
    </template>
  </Card>
</template>
<script>
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, url, maxLength, maxLengthTr } from "@/plugins/validators.js";
import { DashboardMeasurementTypes } from "@/plugins/model/Enums.js";
export default {
  name: "DashboardForm",
  components: {},
  props: {
    dashboard: {
      type: Object,
      default: null,
    },
  },
  emits: ["update:modelValue", "save", "cancel"],
  setup: () => ({ v$: useVuelidate() }),
  data() {
    //TODO: copy dashboard object to mDashboard - otherwise we modify element  from the list and it hhas to be refreshed
    let mDashboard = this.dashboard ? this.dashboard : { ext: {} };
    if (!mDashboard.ext) {
      mDashboard.ext = {};
    }
    let mUnits = this.filterUnits(mDashboard.ext.measurement_type);
    if (mDashboard.ext.unit && !mUnits.find((it) => this.unitValue(it) == mDashboard.ext.unit)) {
      mDashboard.ext.unit = null;
    }

    return {
      mDashboard: mDashboard,
      models: this.$store.getters["view/dashboardModels"],
      mUnits: mUnits,
      selectedPhysicalUnit: this.mDashboard && this.mDashboard.measurement_type ? this.mDashboard.measurement_type.physical_name : null,

      measurementTypes: Object.keys(DashboardMeasurementTypes),
    };
  },
  validationConfig: {
    $lazy: true,
  },
  computed: {
    measurementType() {
      if (this.mDashboard && this.mDashboard.measurement_type) return this.mDashboard && this.mDashboard.measurement_type.physical_name;
      return null;
    },
    unit() {
      if (this.mDashboard && this.mDashboard.measurement_type) return this.mDashboard && this.mDashboard.measurement_type.unit;
      return null;
    },
  },
  validations() {
    return {
      mDashboard: {
        grafana_id: {
          // required: requiredTr("model.dashboard."),
          maxLength: maxLengthTr("model.dashboard.", null)(30),
        },
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
    unitValue(unit) {
      return `${unit.name} [${unit.symbol}]`;
    },
    typeChange(evt) {
      let v;
      try {
        v = evt.value.toLowerCase();
      } catch (Exception) {
        v = null;
      }
      this.mUnits = this.filterUnits(v);
      if (this.mDashboard.ext.unit && !this.mUnits.find((it) => this.unitValue(it) == this.mDashboard.ext.unit)) {
        this.mDashboard.ext.unit = null;
      }
    },

    filterUnits(type) {
      if (type == null) {
        return this.$store.getters["view/dashboardUnits"];
      }
      let units = this.$store.getters["view/dashboardUnits"];
      return units.filter((it) => it.physical_name == type);
    },
    clear() {
      this.mDashboard = {};
    },
    async submit() {
      this.$emit("save", this.mDashboard);
    },
  },
};
</script>

<style lang="scss"></style>
