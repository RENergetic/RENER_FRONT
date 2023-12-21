<template>
  <div class="flex flex-wrap">
    <Card class="main_menu_card" style="margin: 5%">
      <template #title>
        {{ $t("view.abstract_meter_administration") }}
      </template>
      <template #content>
        <div class="container">
          <div class="card flex-wrap gap-3 field grid box">
            <p>{{ $t("view.abstract_meter_list") }}</p>
            <ren-input-wrapper>
              <template #content>
                <Dropdown
                  v-model="abstractMeter"
                  :placeholder="dropdownAbstractMeter[0]"
                  :options="dropdownAbstractMeter"
                  class="w-full md:w-14rem"
                  @change="validateButton"
                />
              </template>
            </ren-input-wrapper>
          </div>
          <div class="card flex-wrap gap-3 field grid box sub_container">
            <p>{{ $t("view.domain_list") }}</p>
            <ren-input-wrapper>
              <template #content>
                <Dropdown
                  v-model="domain"
                  :placeholder="dropdownDomain[0]"
                  :options="dropdownDomain"
                  class="w-full md:w-14rem"
                  @change="validateButton"
                />
              </template>
            </ren-input-wrapper>
          </div>
          <div class="card flex-wrap gap-3 field grid box sub_container">
            <InputText
              id="formula"
              v-model="formulaMeter"
              class="inputTextFormula"
              type="text"
              :placeholder="$t('view.formula_meter_placeholder')"
              @input="validateFormula"
            />
            <Button :label="$t('view.add_measurement')" @click="openCalculationsFormula()" />
            <!-- <p v-if="isValidInputFormula">The input is valid.</p> -->
          </div>
          <div class="check_param gap-3">
            <p>{{ $t("view.activate_condition") }}</p>
            <Checkbox v-model="conditionMeterShown" :binary="true" @change="conditionButtonCheck" />
          </div>
          <div class="card flex-wrap gap-3 field grid box sub_container">
            <!-- <InputText class="" v-model="conditionMeter" type="text" :placeholder="'Condition to calculate the meter'" @input="validateCondition" /> -->
            <InputText
              id="condition"
              v-model="conditionMeter"
              class="inputTextCondition"
              type="text"
              :placeholder="$t('view.condition_meter_placeholder')"
              :disabled="!conditionMeterShown"
              @input="validateCondition"
            />
            <Button :disabled="!conditionMeterShown" :label="$t('view.add_measurement')" @click="openCalculationsCondition()" />
            <!-- <p v-if="isValidInputCondition">The input is valid.</p> -->
          </div>
          <div class="gap-3 field grid">
            <Button :disabled="saveButtonDisabled" label="Save" @click="addUpdateAbstractMeter" />
            <Button icon="pi pi-trash" class="p-button-danger" :disabled="!abstracMeterExists" label="Delete" @click="deleteAbstractMeterFunc" />
          </div>
        </div>
      </template>
    </Card>
    <Card class="measurement_guide_card" style="margin: 5%">
      <template #title> {{ $t("view.measurement_guide") }} </template>
      <template #content>
        <div>
          <Accordion v-model:activeIndex="activeAccordion">
            <AccordionTab v-for="(valueFormula, index) in measurementList" :key="index" :header="valueFormula.id">
              <p>{{ $t("model.measurement.name") }} : {{ valueFormula.name }}</p>
              <p>{{ $t("model.measurement.label") }} : {{ valueFormula.label }}</p>
              <p>{{ $t("model.measurement.domain") }} : {{ valueFormula.domain }}</p>
              <p>{{ $t("model.asset.name") }} : {{ valueFormula.asset.name }}</p>
              <p>{{ $t("model.measurement.type") }} : {{ valueFormula.type.name }}</p>
            </AccordionTab>
          </Accordion>
        </div>
      </template>
    </Card>
  </div>
  <MeasurementSelectionList ref="measurementsListFormula" @selected-measurement="handleMeasurementReturnFormula" />
  <MeasurementSelectionList ref="measurementsListCondition" @selected-measurement="handleMeasurementReturnCondition" />
</template>
<script>
import MeasurementSelectionList from "@/components/management/infrastructure/MeasurementSelectionList.vue";
import Checkbox from "primevue/checkbox";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";

export default {
  name: "AbstracMetersView",
  components: {
    MeasurementSelectionList,
    Checkbox,
    Accordion,
    AccordionTab,
  },
  data() {
    return {
      dialog: true,
      abstractMeter: null,
      abstractMeterGlobal: null,
      domain: null,
      domainGlobal: null,
      formulaMeter: null,
      conditionMeter: null,
      checked: false,
      originalAbstractDomain: [],
      dropdownAbstractMeter: [],
      dropdownDomain: ["heat", "electricity"],
      MeasurementSelectionList,
      isValidInputFormula: false,
      isValidInputCondition: false,
      saveButtonDisabled: true,
      abstracMeterExists: false,
      abstractValueId: null,
      conditionMeterShown: false,
      conditionType: null,
      toastMessage: null,
      measurementIdList: [],
      measurementList: [],
      inputFormula: null,
      inputCondition: null,
      activeAccordion: null,
    };
  },
  async created() {
    let abstractMeterList = await this.$ren.managementApi.getAbstracMeterList();
    let claves = Object.keys(abstractMeterList);
    for (let i = 0; i < claves.length; i++) {
      let clave = claves[i];
      this.dropdownAbstractMeter[i] = clave + " : " + abstractMeterList[clave];
    }
    this.abstractMeterGlobal = this.dropdownAbstractMeter[0];
    this.domainGlobal = this.dropdownDomain[0];
    this.variableExistanceChecker();
    this.inputFormula = document.querySelector("#formula");
    this.inputCondition = document.querySelector("#condition");

    this.inputFormula.addEventListener("click", (e) => {
      this.measurementListener(e.target.selectionStart, 0, this.formulaMeter);
    });
    this.inputCondition.addEventListener("click", (e) => {
      this.measurementListener(e.target.selectionStart, 1, this.conditionMeter);
    });
  },
  methods: {
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
    validateFormula(testBool = true) {
      this.isValidInputFormula = this.validateText(this.formulaMeter);
      this.validateSave();
      if (this.isValidInputFormula && testBool) {
        this.validateMeasurements();
      }
    },
    validateCondition(measurementToValidate = true) {
      const operadores = />=|<=|<|>|=|!=/g;
      let matches = this.conditionMeter.match(operadores);
      if (matches && matches.length == 1) {
        const conditions = this.conditionMeter.split(matches);
        if ((conditions[0] && conditions[1]) != "") {
          this.isValidInputCondition = this.validateText(conditions[0]) && this.validateText(conditions[1]);
        } else {
          this.isValidInputCondition = false;
        }
      } else if (matches && matches.length != 1) {
        this.isValidInputCondition = false;
      } else {
        this.isValidInputCondition = false;
      }
      this.validateSave();
      if (this.isValidInputCondition && measurementToValidate) {
        this.validateMeasurements();
      }
    },
    validateText(text) {
      // eslint-disable-next-line no-useless-escape
      const expressionRegex = /^\(*((\d+(\.\d+)?)|(\[\d+\]))([+*^\/-]\(*((\d+(\.\d+)?)|(\[\d+\]))\)*)*$/;
      let isValidInput = expressionRegex.test(text);
      return isValidInput;
    },
    validateButton() {
      console.log("Initial globals 2->" + this.abstractMeterGlobal + ":" + this.domainGlobal);
      if (this.abstractMeter != null && this.abstractMeterGlobal != this.abstractMeter) {
        this.abstractMeterGlobal = this.abstractMeter;
      }
      if (this.domain != null && this.domainGlobal != this.domain) {
        this.domainGlobal = this.domain;
      }
      //console.log("Check globals: " + this.abstractMeterGlobal + ":" + this.domainGlobal);
      //console.log((this.abstractMeter != null) + " " + (this.domain != null) + " " + this.isValidInputFormula + " " + this.isValidInputCondition);
      this.variableExistanceChecker();
      this.validateSave();
    },
    validateSave() {
      if (this.conditionMeterShown) {
        this.saveButtonDisabled = !(this.isValidInputFormula && this.isValidInputCondition);
      } else {
        this.saveButtonDisabled = !this.isValidInputFormula;
      }
    },
    async addUpdateAbstractMeter() {
      let returnValue = null;
      if (this.abstracMeterExists) {
        const jsonAbstractMeter = {
          id: this.abstractValueId,
          name: this.splitAbstractMeters(this.abstractMeterGlobal),
          formula: this.formulaMeter,
          condition: this.conditionMeter,
          domain: this.domainGlobal,
        };
        returnValue = await this.$ren.managementApi.updateAbstractMeter(jsonAbstractMeter);
        if (typeof returnValue == "object") {
          this.showToast(2);
        } else {
          this.showToast(3);
        }
      } else {
        const jsonAbstractMeter = {
          name: this.splitAbstractMeters(this.abstractMeterGlobal),
          formula: this.formulaMeter,
          condition: this.conditionMeter,
          domain: this.domainGlobal,
        };
        returnValue = await this.$ren.managementApi.addAbstractMeter(jsonAbstractMeter);
        if (typeof returnValue == "object") {
          this.showToast(0);
        } else {
          this.showToast(3);
        }
        this.saveButtonDisabled = true;
      }
      //this.variableExistanceChecker();
    },
    async variableExistanceChecker() {
      let abstractValue = await this.$ren.managementApi.getAnAbstracMeterConfiguration(
        this.splitAbstractMeters(this.abstractMeterGlobal),
        this.domainGlobal,
      );
      if (abstractValue != null) {
        this.abstracMeterExists = true;
        this.abstractValueId = abstractValue.id;
        this.formulaMeter = abstractValue.formula;
        if (abstractValue.condition != null) {
          this.conditionMeter = abstractValue.condition;
          this.conditionMeterShown = true;
        } else {
          this.conditionMeter = null;
        }
        this.saveButtonDisabled = false;
      } else {
        this.abstracMeterExists = false;
        this.abstractValueId = null;
        this.resetData();
      }
      this.validateFormula(false);
      if (this.conditionMeter != null) {
        this.validateCondition(false);
      }
      this.validateMeasurements();
    },
    async deleteAbstractMeterFunc() {
      const returnValue = await this.$ren.managementApi.deleteAbstractMeter(this.splitAbstractMeters(this.abstractMeterGlobal), this.domainGlobal);
      if (returnValue) {
        this.showToast(1);
      } else {
        this.showToast(3);
      }
      this.abstracMeterExists = false;
      this.abstractValueId = null;
      this.resetData();
      this.validateMeasurements();
    },
    openCalculationsFormula() {
      this.$refs.measurementsListFormula.open();
    },
    openCalculationsCondition() {
      this.$refs.measurementsListCondition.open();
    },
    openNewPage() {
      this.$refs.measurementSelectionList.open(this.conditionType);
    },
    handleMeasurementReturnFormula(value) {
      if (this.formulaMeter == null) {
        this.formulaMeter = this.concatenateStrings("[" + value + "]", "");
      } else {
        this.formulaMeter = this.concatenateStrings(this.formulaMeter, "[" + value + "]");
      }
      this.validateFormula();
      this.focusFormula();
    },
    handleMeasurementReturnCondition(value) {
      if (this.conditionMeter == null) {
        this.conditionMeter = this.concatenateStrings("[" + value + "]", "");
      } else {
        this.conditionMeter = this.concatenateStrings(this.conditionMeter, "[" + value + "]");
        this.validateCondition();
      }
      this.focusCondition();
    },
    concatenateStrings(string1, string2) {
      let concatString = string1 + string2;
      return concatString;
    },
    conditionButtonCheck() {
      this.conditionMeter = null;
      this.validateSave();
    },
    resetData() {
      this.conditionMeter = null;
      this.formulaMeter = null;
      this.conditionMeterShown = false;
      this.isValidInputCondition = false;
      this.isValidInputFormula = false;
    },
    isObject(value) {
      return typeof value == "object" && value !== null;
    },
    splitAbstractMeters(absMet) {
      return absMet.split(":")[0].substring(0, absMet.split(":")[0].length - 1);
    },
    save() {
      this.$toast.add({ severity: "success", summary: "Success", detail: "Data Saved", life: 3000 });
    },
    validateMeasurements() {
      let aux = [];
      let aux2 = [];
      this.measurementIdList = [];
      if (this.formulaMeter != null) {
        aux = this.extractValues(this.formulaMeter);
        console.log("1: " + aux);
        if (this.conditionMeter != null) {
          aux2 = this.extractValues(this.conditionMeter);
          console.log("2: " + aux2);
        }
        if (aux != null && aux2 != null) {
          this.measurementIdList = aux.concat(aux2);
        } else if (aux != null) {
          this.measurementIdList = aux;
        } else if (aux2 != null) {
          this.measurementIdList = aux2;
        }
      }
      console.log(`Final ${this.measurementIdList}`);
      this.updateGuide();
    },
    extractValues(string) {
      const pattern = /\[(.*?)\]/g;
      let values = null;
      if (pattern.test(string)) {
        values = string.match(pattern).map((value) => value.slice(1, -1));
      }
      if (values == null) {
        return null;
      } else {
        return values;
      }
    },
    updateGuide() {
      this.measurementList.splice(0, this.measurementList.length);
      console.log("Before: " + this.measurementIdList.length);
      console.log(this.measurementIdList);
      console.log(this.measurementList);
      for (let i = 0; i < this.measurementIdList.length; i++) {
        console.log("Test" + i + " -> " + this.measurementIdList[i]);
        this.$ren.managementApi.getMeasurement(this.measurementIdList[i]).then((response) => {
          this.measurementList.push(response);
        });
      }
      console.log("Update guide: ");
      console.log(this.measurementIdList);
      console.log("After: " + this.measurementIdList.length);
      console.log(this.measurementList);
    },
    focusFormula() {
      document.getElementById("formula").focus();
    },
    focusCondition() {
      document.getElementById("condition").focus();
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
.template_container {
  margin: 100px 200px;
  text-align: center;
}
.container {
  margin-left: 5%;
}
.toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  display: none;
}

.showing-toast {
  display: block;
}

.toast_text {
  text-align: center;
}

.main_menu_card {
  flex: 1.25 0 auto;
}

.measurement_guide_card {
  flex: 1 0 auto;
}

.check_param {
  display: flex;
  //justify-content: center;
  align-items: center;
  /* Set the desired height for the container */
  height: 100%;
  margin-left: 5px;
}
</style>
