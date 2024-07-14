<template>
  <Card class="meter-list">
    <template #content>
      <!-- <h3>{{ $t("view.abstract_meter") }}:</h3> -->
      <div class="ren">
        <!-- {{ measurementIds }}  -->

        <ren-input-wrapper :text-label="'view.abstract_meter_list'">
          <template #content>
            <Dropdown
              v-model="abstractMeterType"
              :option-label="(it) => `${it.description} (${it.meter})`"
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
          <ren-switch v-model="conditionMeterShown" :text-label="'view.activated_condition'" />

          <ren-input
            v-if="conditionMeterShown"
            ref="conditionInput"
            v-model="abstractMeter.condition"
            :invalid="!isValidCondition"
            :errors="conditionError"
            :placeholder="$t('view.condition_meter_placeholder')"
            :disabled="!conditionMeterShown"
          />
          <ren-input-wrapper v-if="conditionMeterShown">
            <template #content> <Button :label="$t('view.add_measurement')" @click="selectConditionMeasurement()" /> </template>
          </ren-input-wrapper>
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
                label="Delete"
                @click="deleteAbstractMeterFunc"
              />
            </template>
          </ren-input-wrapper>

          <!-- <Button :disabled="saveButtonDisabled" label="Save" @click="addUpdateAbstractMeter" /> -->
        </div>
      </div>

      <div class="gap-3 field grid"></div>
    </template>
  </Card>
  <Card class="measurement-list">
    <template #content>
      <h3>{{ $t("view.measurements") }}:</h3>
      <Accordion v-model:activeIndex="activeAccordion">
        <AccordionTab v-for="(valueFormula, index) in Object.values(measurementIds)" :key="index" :header="valueFormula.id">
          <p>{{ $t("model.measurement.name") }} : {{ valueFormula.name }}</p>
          <p>{{ $t("model.measurement.label") }} : {{ valueFormula.label }}</p>
          <p>{{ $t("model.measurement.domain") }} : {{ valueFormula.domain }}</p>
          <p>{{ $t("model.asset.name") }} : {{ valueFormula.asset.name }}</p>
          <p>{{ $t("model.measurement.type") }} : {{ valueFormula.type.name }}</p>
          <p>{{ $t("model.measurement_type.unit") }} : {{ valueFormula.type.unit }}</p>
          <p>{{ $t("model.measurement_type.physical_name") }} : {{ valueFormula.type.physical_name }}</p>
        </AccordionTab>
      </Accordion>
    </template>
  </Card>
  <Dialog v-model:visible="measurementDialog" :style="{ width: '90vw', height: '90vh', maxHeight: '100%' }" :modal="true">
    <Card class="ren-page-content">
      <template #content>
        <MeasurementSelect :selected-measurements="measurementIds" :filters="measurementFilter" @select="onMeasurementSelect" />
      </template>
    </Card>
  </Dialog>
  <!--  
  <MeasurementSelectionList ref="measurementsListCondition" @selected-measurement="handleMeasurementReturnCondition" /> -->
</template>
<script>
import MeasurementSelect from "@/components/management/infrastructure/measurement/MeasurementSelect.vue";
export default {
  name: "AbstracMetersView",
  components: {
    MeasurementSelect,
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
      isValidCondition: false, //      saveButtonDisabled: true,
      // abstracMeterExists: false,
      conditionMeterShown: false,
      toastMessage: null,
      measurementIds: {},
      measurementList: [],
      activeAccordion: null,
      measurementHandler: null,
    };
  },
  computed: {
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
        await this.setAbstractMeter(newValue.meter, this.abstractMeterDomain);
      }
    },
    abstractMeterDomain: async function (newValue) {
      if (newValue == null) {
        this.abstractMeter == null;
        return;
      }
      if (this.abstractMeterType != null) {
        await this.setAbstractMeter(this.abstractMeterType.meter, newValue);
      }
    },
    "abstractMeter.formula": function (newValue) {
      console.error("watch test1");
      if (!newValue || newValue.trim() == "") {
        this.isValidFormula = true;
        return;
      }
      this.isValidFormula = this.validateMeasurementFormula(newValue);
      if (this.isValidFormula) this.measurementIds = this.listMeasurements();
    },
    "abstractMeter.condition": function (newValue) {
      console.error("watch test2");
      if (!newValue || newValue.trim() == "") {
        this.isValidCondition = true;
        return;
      }
      this.isValidCondition = this.validateMeasurementCondition(newValue);
      if (this.isValidCondition) this.measurementIds = this.listMeasurements();
    },
    measurementIds: function (newVal) {
      this.loadMeasurements(newVal);
    },
  },
  async created() {},
  methods: {
    async setAbstractMeter(name, domain) {
      let abstractMeter = await this.$ren.kpiApi.getAbstractMeterConfiguration(name, domain);
      if (abstractMeter == null) {
        abstractMeter = { name: name, domain: domain, _newInstance: true };
      }
      this.mSetAbstractMeter(abstractMeter);
    },
    async mSetAbstractMeter(abstractMeter) {
      this.conditionMeterShown = abstractMeter.condition ? true : false;
      this.measurementFilter = { "type.physical_name": { value: this.abstractMeterType.physicalName } };

      this.abstractMeter = abstractMeter;
    },
    selectFormulaMeasurement() {
      var _this = this;
      this.measurementHandler = (m) => {
        if (_this.abstractMeter) {
          if (_this.abstractMeter.formula) _this.abstractMeter.formula += `[${m.id}]`;
          else {
            _this.abstractMeter.formula = `[${m.id}]`;
          }
        }
        _this.$refs.formulaInput.focus();
      };
      this.measurementDialog = true;
    },
    selectConditionMeasurement() {
      var _this = this;
      this.measurementHandler = (m) => {
        if (_this.abstractMeter) {
          if (_this.abstractMeter.condition) _this.abstractMeter.condition += `[${m.id}]`;
          else {
            _this.abstractMeter.condition = `[${m.id}]`;
          }
        }
        _this.$refs.conditionInput.focus();
      };
      this.measurementDialog = true;
    },
    onMeasurementSelect(m) {
      this.measurementDialog = false;
      m._loaded = true;
      this.measurementIds[m.id] = m;
      this.measurementHandler(m);
    },
    showToast(option) {
      let msgType = "error";
      if (option == 0) {
        msgType = "information";
        this.toastMessage = "Content saved";
      } else if (option == 1) {
        msgType = "information";
        this.toastMessage = "Content deleted";
      } else if (option == 2) {
        msgType = "information";
        this.toastMessage = "Content updated";
      } else if (option == 3) {
        this.toastMessage = "Addition error";
        ///console.error("Option failed");
      } else {
        this.toastMessage = "Option error";
        //console.error("No correct option");
      }
      this.$emitter.emit(msgType, { message: this.toastMessage });
    },
    validateMeasurementCondition(measurementCondition) {
      if (!measurementCondition) {
        return false;
      }
      const operators = />=|<=|<|>|=|!=/g;
      let matches = measurementCondition.match(operators);

      if (matches && matches.length == 1) {
        const formulas = measurementCondition.split(matches);

        return this.validateMeasurementFormula(formulas[0]) && this.validateMeasurementFormula(formulas[1]);
      }
      return false;
    },
    validateMeasurementFormula(text) {
      //match numbers(floats) or ids in square brackets, any amount of round brackets, math operiations between numbers or square brackets
      // eslint-disable-next-line no-useless-escape
      const expressionRegex = /^\(*((\d+(\.\d+)?)|(\[\d+\]))([+*^\/-]\(*((\d+(\.\d+)?)|(\[\d+\]))\)*)*$/;
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

    async deleteAbstractMeterFunc() {
      const returnValue = await this.$ren.kpiApi.deleteAbstractMeter(this.abstractMeter.meter, this.abstractMeter.domain);
      if (returnValue) {
        this.$emitter.emit("information", { code: "delete_success" });
        this.abstractMeter = null;
      }
    },

    listMeasurements() {
      var measurements = {};
      if (this.abstractMeter && this.abstractMeter.formula) {
        let ids = this.extractMeasurements(this.abstractMeter.formula);
        for (let mId of ids) {
          if (!this.measurementIds[mId]) measurements[mId] = { id: mId };
          else measurements[mId] = this.measurementIds[mId];
        }
      }

      if (this.abstractMeter && this.abstractMeter.condition) {
        let ids = this.extractMeasurements(this.abstractMeter.condition);
        for (let mId of ids) {
          if (!this.measurementIds[mId]) measurements[mId] = { id: mId };
          else measurements[mId] = this.measurementIds[mId];
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

    measurementListener(position, operationType, meter) {
      if (meter != null) {
        let currentMeasurement = null;
        if (operationType == 0) {
          console.log("Formula " + position);
        } else if (operationType == 1) {
          console.log("Condition " + position);
        }
        let openings = [];
        let closings = [];

        // Finding indices of '[' and ']'
        for (let i = 0; i < meter.length; i++) {
          if (meter[i] === "[") {
            openings.push(i);
          } else if (meter[i] === "]") {
            closings.push(i);
          }
        }
        for (let i = 0; i < openings.length; i++) {
          for (let j = 0; j < closings.length; j++) {
            if (openings[i] < closings[j] && openings[i] < position && position <= closings[j]) {
              currentMeasurement = meter.substring(openings[i] + 1, closings[i]);
            }
          }
        }
        for (let i = 0; i < this.measurementList.length; i++) {
          if (this.measurementList[i].id == currentMeasurement) {
            this.activeAccordion = i;
          }
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
