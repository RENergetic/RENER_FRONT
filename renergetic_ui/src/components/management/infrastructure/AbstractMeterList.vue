<template>
  <Card class="meter-list">
    <template #content>
      <!-- <h3>{{ $t("view.abstract_meter") }}:</h3> -->
      <div class="ren">
        <!-- {{ meterMeasurements }}  -->

        <ren-input-wrapper :text-label="'view.abstract_meter_list'">
          <template #content>
            <Dropdown
              v-model="abstractMeterType"
              :option-label="(it) => `${it.description} (${it.label ? it.label : it.name})`"
              :options="abstractMeterTypes"
              style="flex-grow: 1"
              @change="validateButton"
            />
          </template>
        </ren-input-wrapper>
        <ren-input-wrapper :text-label="'view.domain_list'">
          <template #content>
            <Dropdown v-model="abstractMeterDomain" :options="dropdownDomain" @change="validateButton" />
            <!-- :placeholder="dropdownDomain[0]" -->
          </template>
        </ren-input-wrapper>
        <div v-if="abstractMeter">
          <ren-input
            ref="formulaInput"
            v-model="abstractMeter.formula"
            :disabled="abstractMeter.domain == 'none'"
            :read-only="abstractMeter.domain == 'none'"
            :text-label="'model.abstract_meter.formula'"
            :invalid="!isValidFormula"
            :errors="formulaError"
          />
          <ren-input-wrapper>
            <template #content>
              <Button v-if="abstractMeter.domain == 'none'" disabled :label="$t('view.add_measurement')" />
              <Button v-else :label="$t('view.add_measurement')" @click="selectFormulaMeasurement()" />
            </template>
          </ren-input-wrapper>
          <ren-switch v-model="conditionMeterShown" :disabled="hasCondition" :text-label="'view.activated_condition'" />

          <ren-input
            v-if="conditionMeterShown"
            ref="conditionInput"
            v-model="abstractMeter.condition"
            :invalid="!isValidCondition"
            :errors="conditionError"
            :show-clear="true"
            :placeholder="$t('view.condition_meter_placeholder')"
            :disabled="!conditionMeterShown"
          />
          <ren-input-wrapper v-if="conditionMeterShown">
            <template #content> <Button :label="$t('view.add_measurement')" @click="selectConditionMeasurement()" /> </template>
          </ren-input-wrapper>
          <div>
            <!-- v-if="abstractMeter.measurement && abstractMeter.measurement.id" -->

            <ren-input-wrapper :text-label="'model.abstract_meter.linked_measurement'">
              <template #content>
                <div v-if="abstractMeter.measurement" style="padding: 0.25rem">
                  {{ abstractMeter.measurement.label ? abstractMeter.measurement.label : abstractMeter.measurement.label }}
                  ({{ abstractMeter.measurement.id }})
                </div>
                <div v-else>{{ $t("model.abstract_meter.linked_no_measurement") }}</div>
                <Button :label="$t('view.link_measurement')" @click="selectLinkedMeasurement" />
              </template>
            </ren-input-wrapper>
          </div>
          <ren-input-wrapper>
            <template #content>
              <Button v-if="!isValidMeter" disabled :label="$t('view.button.submit')" />
              <Button v-else :label="$t('view.button.submit')" @click="submitAbstractMeter()" />
            </template>
          </ren-input-wrapper>
          <ren-input-wrapper v-if="abstractMeter && !abstractMeter._newInstance">
            <template #content>
              <Button
                icon="pi pi-trash"
                class="p-button-danger"
                :disabled="abstractMeter._newInstance"
                :label="$t('view.button.delete')"
                @click="deleteAbstractMeter"
              />
            </template>
          </ren-input-wrapper>

          <!-- <Button :disabled="saveButtonDisabled" label="Save" @click="addUpdateAbstractMeter" /> -->
        </div>
      </div>
    </template>
  </Card>
  <Card class="measurement-list">
    <template #content>
      <h3 v-if="abstractMeter && meterMeasurements && Object.keys(meterMeasurements).length > 0">{{ $t("view.measurements") }}:</h3>
      <div v-if="abstractMeter && meterMeasurements && Object.keys(meterMeasurements).length > 0">
        <Accordion v-model:activeIndex="activeAccordion">
          <AccordionTab v-for="(measurement, index) in Object.values(meterMeasurements)" :key="index" :header="measurement.id">
            <span v-if="measurement._loaded">
              <p>{{ $t("model.measurement.name") }} : {{ measurement.name }}</p>
              <p>{{ $t("model.measurement.label") }} : {{ measurement.label }}</p>
              <p>{{ $t("model.measurement.domain") }} : {{ measurement.domain }}</p>
              <p v-if="measurement.asset">{{ $t("view.asset") }} {{ $t("model.asset.name") }} : {{ measurement.asset.name }}</p>
              <p>{{ $t("model.measurement.type") }} : {{ measurement.type.name }}</p>
              <p>{{ $t("model.measurement_type.unit") }} : {{ measurement.type.unit }}</p>
              <p>{{ $t("model.measurement.direction") }} : {{ measurement.direction }}</p>
              <p>{{ $t("model.measurement.sensor_name") }} : {{ measurement.sensor_name }}</p>
              <p>{{ $t("model.measurement_type.physical_name") }} : {{ measurement.type.physical_name }}</p>
              <Button v-tooltip="$t('view.view_data')" icon="pi pi-chart-line" class="p-button-rounded" @click="showData(measurement)" />
            </span>
          </AccordionTab>
        </Accordion>
      </div>
    </template>
  </Card>
  <Dialog v-model:visible="dataDialog" :style="{ width: '90vw' }" :modal="true" :dismissable-mask="true">
    <div v-if="selectedMeasurement">
      <MeasurementChart
        :key="selectedMeasurement.id"
        ref="chart"
        :filter="filter"
        :style="'margin:auto;max-width: 90%;'"
        :width="1200"
        :height="500"
        :measurements="[selectedMeasurement]"
      />
      <BasicFilterSettings
        style="width: 100%; margin: auto; margin-top: 1rem"
        class="ren-card"
        :setting-key="'measurement'"
        :submit-button="false"
        :columns="3"
        :labels="false"
        @update="reloadSettings()"
      />
    </div>
  </Dialog>
  <MeasurementDialog v-model:visible="jsonDialog" v-model="mMeasurement" />
  <Dialog v-model:visible="measurementDialog" :style="{ width: '90vw', height: '90vh', maxHeight: '100%' }" :modal="true">
    <Card class="ren-page-content">
      <template #content>
        <MeasurementSelect :selected-measurements="selectedMeasurements" :filters="measurementFilter" @select="onMeasurementSelect" />
      </template>
    </Card>
  </Dialog>
</template>
<script>
import MeasurementSelect from "@/components/management/infrastructure/measurement/MeasurementSelect.vue";
import MeasurementChart from "@/components/dashboard/measurement/MeasurementChart.vue";
import BasicFilterSettings from "@/components/miscellaneous/settings/BasicFilterSettings.vue";
export default {
  name: "AbstractMeterList",
  components: {
    MeasurementSelect,
    MeasurementChart,
    BasicFilterSettings,
  },
  props: {
    abstractMeterTypes: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      measurementDialog: false,
      abstractMeterType: null,
      abstractMeterDomain: null,
      measurementFilter: null,
      abstractMeter: null,
      dropdownDomain: ["heat", "electricity", "none"],
      isValidFormula: false,
      isValidCondition: true, //      saveButtonDisabled: true,
      // abstracMeterExists: false,
      conditionMeterShown: false,
      meterMeasurements: {},
      selectedMeasurements: {},
      activeAccordion: null,
      measurementHandler: null,
      dataDialog: false,
      selectedMeasurement: null,
      filter: null,
    };
  },
  computed: {
    hasCondition: function () {
      console.info(this.abstractMeter.condition);
      return this.abstractMeter && this.abstractMeter.condition ? this.abstractMeter.condition.replace(/\s/g, "") != "" : false;
    },
    isValidMeter: function () {
      return this.isValidFormula && this.isValidCondition && this.abstractMeter && this.abstractMeter.formula;
    },
  },
  watch: {
    abstractMeterType: async function (newValue) {
      if (newValue == null) {
        this.abstractMeter == null;
        return;
      }
      if (this.abstractMeterDomain != null) {
        //tODO: backward compatibility - use just name
        var name = newValue.name ? newValue.name : newValue.meter;
        await this.setAbstractMeter(name, this.abstractMeterDomain);
      }
    },
    abstractMeterDomain: async function (newValue) {
      if (newValue == null) {
        this.abstractMeter == null;
        return;
      }
      if (this.abstractMeterType != null) {
        var name = this.abstractMeterType.name ? this.abstractMeterType.name : this.abstractMeterType.meter;
        await this.setAbstractMeter(name, newValue);
      }
    },
    "abstractMeter.formula": function (newValue) {
      console.error("watch test1");
      if (!newValue) {
        this.isValidFormula = true;
        return;
      }
      var trimmed = newValue.replace(/\s/g, "");
      if (trimmed == "") {
        this.isValidFormula = true;
        return;
      }
      this.isValidFormula = this.validateMeasurementFormula(trimmed);
      if (this.isValidFormula) this.meterMeasurements = this.listMeasurements();
    },
    "abstractMeter.condition": function (newValue) {
      console.error("watch test2");
      if (!newValue || newValue.trim() == "") {
        this.isValidCondition = true;
        return;
      }
      var trimmed = newValue.replace(/\s/g, "");
      this.isValidCondition = this.validateMeasurementCondition(trimmed);
      if (this.isValidCondition) this.meterMeasurements = this.listMeasurements();
    },
    meterMeasurements: function (newVal) {
      this.loadMeasurements(newVal);
    },
  },
  methods: {
    reloadSettings() {
      this.filter = this.$store.getters["settings/parsedFilter"]("measurement");
      // this.conversionSettings = this.$store.getters["settings/conversion"];
    },
    async showData(measurement) {
      await this.$ren.managementApi.getMeasurementProperties(measurement.id).then((details) => {
        measurement.measurement_details = details;
      });
      this.selectedMeasurement = measurement;
      this.dataDialog = true;
    },
    async setAbstractMeter(name, domain) {
      let abstractMeter = await this.$ren.kpiApi.getAbstractMeterConfiguration(name, domain);
      if (abstractMeter == null) {
        abstractMeter = { name: name, domain: domain, _newInstance: true };
      }
      this.mSetAbstractMeter(abstractMeter);
    },
    async mSetAbstractMeter(abstractMeter) {
      this.conditionMeterShown = abstractMeter.condition ? true : false;
      this.measurementFilter = {
        "type.physical_name": { value: this.abstractMeterType.physicalName },
        domain: { value: abstractMeter.domain },
      };

      this.abstractMeter = abstractMeter;
    },
    async selectLinkedMeasurement() {
      this.measurementFilter = {
        domain: { value: this.abstractMeter.domain },
        name: { value: this.abstractMeter.name.toLocaleLowerCase() },
        sensor_name: { value: "abstract_meter" },
      };
      var _this = this;
      this.measurementHandler = (m) => {
        _this.abstractMeter.measurement = m;
      };
      if (this.abstractMeter.measurement) {
        var selectedMeasurements = {};
        selectedMeasurements[this.abstractMeter.measurement.id] = this.abstractMeter.measurement;
        this.selectedMeasurements = selectedMeasurements;
      }
      this.measurementDialog = true;
    },
    mSetFormulaMeasurement(measurement, strFormula) {
      measurement._loaded = true;
      this.meterMeasurements[measurement.id] = measurement;
      if (this.abstractMeter) {
        if (strFormula) strFormula += `[${measurement.id}]`;
        else {
          strFormula = `[${measurement.id}]`;
        }
      }
      return strFormula;
    },
    selectFormulaMeasurement() {
      var _this = this;

      this.measurementHandler = (m) => {
        _this.abstractMeter.formula = _this.mSetFormulaMeasurement(m, _this.abstractMeter.formula);
        _this.$refs.formulaInput.focus();
      };
      this.selectedMeasurements = this.meterMeasurements;
      this.measurementFilter = {
        "type.physical_name": { value: this.abstractMeterType.physicalName },
        domain: { value: this.abstractMeter.domain },
      };

      this.measurementDialog = true;
    },
    selectConditionMeasurement() {
      var _this = this;
      this.measurementHandler = (m) => {
        _this.abstractMeter.condition = _this.mSetFormulaMeasurement(m, _this.abstractMeter.condition);
        _this.$refs.conditionInput.focus();
      };
      this.selectedMeasurements = this.meterMeasurements;
      this.measurementFilter = {
        "type.physical_name": { value: this.abstractMeterType.physicalName },
        domain: { value: this.abstractMeter.domain },
      };

      this.measurementDialog = true;
    },
    onMeasurementSelect(m) {
      this.measurementDialog = false;
      this.measurementHandler(m);
    },
    validateMeasurementCondition(measurementCondition) {
      console.error(measurementCondition);
      if (!measurementCondition) {
        return false;
      }
      const operators = />=|<=|<|>|=|!=/g;
      var condition = measurementCondition.replace(/\s/g, "");
      let matches = condition.match(operators);
      console.error(matches);
      if (matches && matches.length == 1) {
        const formulas = condition.split(matches);
        return this.validateMeasurementFormula(formulas[0]) && this.validateMeasurementFormula(formulas[1]);
      }
      return false;
    },
    validateMeasurementFormula(text) {
      //match numbers(floats) or ids in square brackets, any amount of round brackets, math operiations between numbers or square brackets
      // eslint-disable-next-line no-useless-escape
      const expressionRegex = /^\(*((\d+(\.\d+)?)|(\[\d+\]))([+*^\/-]\(*((\d+(\.\d+)?)|(\[\d+\]))\)*)*$/;

      // const expressionRegex = /^((\d+(\.\d+)?)|(\[\d+\]))([+-]((\d+(\.\d+)?)|(\[\d+\])))*$/;
      // const expressionRegex = /^\(*((\d+(\.\d+)?)|(\[\d+\]))([+-]\(*((\d+(\.\d+)?)|(\[\d+\]))\)*)*$/;
      let isValidInput = expressionRegex.test(text);
      return isValidInput;
    },

    async submitAbstractMeter() {
      var submitRes;
      if (!this.abstractMeter._newInstance) {
        submitRes = await this.$ren.kpiApi.updateAbstractMeter(this.abstractMeter);
      } else {
        submitRes = await this.$ren.kpiApi.addAbstractMeter(this.abstractMeter);
      }
      if (submitRes) {
        this.$emitter.emit("information", { code: "update_success" });
        submitRes._newInstance = false;
        this.mSetAbstractMeter(submitRes);
      }
    },

    async deleteAbstractMeter() {
      this.$confirm.require({
        message: this.$t("view.confirm_abstract_meter_delete", {
          label: this.abstractMeter.name,
        }),
        header: this.$t("view.delete_abstract_meter"),
        icon: "pi pi-exclamation-triangle",
        accept: async () => {
          const returnValue = await this.$ren.kpiApi.deleteAbstractMeter(this.abstractMeter.name, this.abstractMeter.domain);
          if (returnValue) {
            this.$emitter.emit("information", { code: "delete_success" });
            this.abstractMeter = null;
          }
        },
        reject: () => {
          this.$confirm.close();
        },
      });
    },

    listMeasurements() {
      var measurements = {};
      if (this.abstractMeter && this.abstractMeter.formula) {
        let ids = this.extractMeasurements(this.abstractMeter.formula);
        for (let mId of ids) {
          if (!this.meterMeasurements[mId]) measurements[mId] = { id: mId };
          else measurements[mId] = this.meterMeasurements[mId];
        }
      }

      if (this.abstractMeter && this.abstractMeter.condition) {
        let ids = this.extractMeasurements(this.abstractMeter.condition);
        for (let mId of ids) {
          if (!this.meterMeasurements[mId]) measurements[mId] = { id: mId };
          else measurements[mId] = this.meterMeasurements[mId];
        }
      }
      return measurements;
    },
    extractMeasurements(strFormula) {
      const pattern = /\[(.*?)\]/g;
      if (pattern.test(strFormula)) {
        return strFormula.match(pattern).map((value) => value.slice(1, -1));
      }
      return [];
    },
    loadMeasurements(measurements) {
      for (let mId in measurements) {
        if (!measurements[mId]._loaded) {
          this.$ren.managementApi.getMeasurement(mId).then((measurement) => {
            measurement._loaded = true;
            measurements[mId] = measurement;
          });
        }
      }
    },
  },
};
</script>
<style scoped lang="scss">
.meter-list {
  flex-grow: 1;
  max-width: 70rem;
}

.measurement-list {
  min-width: 20rem;
}
</style>
