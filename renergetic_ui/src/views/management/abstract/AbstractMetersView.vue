<template>
  <Card style="width: 60%; margin: auto; margin-top: 10%">
    <template #title> Abstract meter administration </template>
    <template #content>
      <div class="container">
        <div class="card flex-wrap gap-3 field grid box">
          <p>Abstract meter list</p>
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
          <p>Domain list</p>
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
            v-model="formulaMeter"
            class="inputTextFormula"
            type="text"
            :placeholder="'Formula to calculate the meter'"
            @input="validateFormula"
          />
          <Button label="+" @click="openCalculationsFormula()" />
          <!-- <p v-if="isValidInputFormula">The input is valid.</p> -->
        </div>
        <div class="gap-3 field grid">
          <Checkbox v-model="conditionMeterShown" :binary="true" @change="conditionButtonCheck" />
        </div>
        <div class="card flex-wrap gap-3 field grid box sub_container">
          <!-- <InputText class="" v-model="conditionMeter" type="text" :placeholder="'Condition to calculate the meter'" @input="validateCondition" /> -->
          <InputText
            v-model="conditionMeter"
            class="inputTextCondition"
            type="text"
            :placeholder="'Condition to calculate the meter'"
            :disabled="!conditionMeterShown"
            @input="validateCondition"
          />
          <Button :disabled="!conditionMeterShown" label="+" @click="openCalculationsCondition()" />
          <!-- <p v-if="isValidInputCondition">The input is valid.</p> -->
        </div>
        <div class="gap-3 field grid">
          <Button :disabled="saveButtonDisabled" label="Save" @click="addUpdateAbstractMeter" />
          <Button icon="pi pi-trash" class="p-button-danger" :disabled="!abstracMeterExists" label="Delete" @click="deleteAbstractMeterFunc" />
        </div>
      </div>
    </template>
  </Card>
  <AbstractMetersCalculation
    ref="abstractMetersCalculation"
    @selected-measurement-formula="handleMeasurementReturnFormula"
    @selected-measurement-condition="handleMeasurementReturnCondition"
  />
</template>
<script>
//import AbstractMetersCalculation from "@/views/management/abstract/AbstractMetersCalculation.vue";
import AbstractMetersCalculation from "@/components/management/infrastructure/AbstractMetersCalculation.vue";
//import AbstractMetersCalculation from "./AbstractMetersCalculation.vue";
import Checkbox from "primevue/checkbox";
export default {
  name: "AbstracMetersView",
  components: {
    AbstractMetersCalculation,
    Checkbox,
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
      AbstractMetersCalculation,
      isValidInputFormula: false,
      isValidInputCondition: false,
      saveButtonDisabled: true,
      abstracMeterExists: false,
      abstractValudId: null,
      conditionMeterShown: false,
      conditionType: null,
      toastMessage: null,
    };
  },
  async created() {
    console.log("Created");
    //console.error("I arrived here");
    let abstractMeterList = await this.$ren.managementApi.getAbstracMeterList();
    //console.log(this.dropdownMeasurementNames);
    //let myMap = new Map().set("a", 1).set("b", 2);
    let claves = Object.keys(abstractMeterList);
    for (let i = 0; i < claves.length; i++) {
      let clave = claves[i];
      //console.log(clave + " : " + abstractMeterList[clave]);
      this.dropdownAbstractMeter[i] = clave + " : " + abstractMeterList[clave];
    }
    this.abstractMeterGlobal = this.dropdownAbstractMeter[0];
    this.domainGlobal = this.dropdownDomain[0];
    this.variableExistanceChecker();
    //console.log(this.dropdownAbstractMeter);
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
        console.error("Option failed");
      } else {
        this.toastMessage = "Option error";
        console.error("No correct option");
      }
      this.$emitter.emit(msgType, { message: this.toastMessage });
      // setTimeout(() => {
      //   this.showingToast = false;
      // }, 1000); // Cierra el toast después de 3 segundos (ajusta el tiempo según tus necesidades).
    },
    validateFormula() {
      this.isValidInputFormula = this.validateText(this.formulaMeter);
      this.validateSave();
    },
    validateCondition() {
      const operadores = />=|<=|<|>|=|!=/g; // Esta expresión regular busca los operadores "<", ">", "<=", ">=", o "="
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
      console.log("Check globals: " + this.abstractMeterGlobal + ":" + this.domainGlobal);
      console.log((this.abstractMeter != null) + " " + (this.domain != null) + " " + this.isValidInputFormula + " " + this.isValidInputCondition);
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
          id: this.abstractValudId,
          name: this.splitAbstractMeters(this.abstractMeterGlobal),
          formula: this.formulaMeter,
          condition: this.conditionMeter,
          domain: this.domainGlobal,
        };
        console.log("Update abstract meter -> ");
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
      this.variableExistanceChecker();
    },
    async variableExistanceChecker() {
      //let aux0 = this.abstractMeterGlobal.replace(/\s/g, "").split(":")[0];
      console.log(this.splitAbstractMeters(this.abstractMeterGlobal) + ":" + this.domainGlobal);
      let abstractValue = await this.$ren.managementApi.getAnAbstracMeterConfiguration(
        this.splitAbstractMeters(this.abstractMeterGlobal),
        this.domainGlobal,
      );
      if (abstractValue != null) {
        this.abstracMeterExists = true;
        this.abstractValudId = abstractValue.id;
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
        this.abstractValudId = null;
        this.resetData();
      }
      this.validateFormula();
      if (this.conditionMeter != null) {
        this.validateCondition();
      }
    },
    async deleteAbstractMeterFunc() {
      const returnValue = await this.$ren.managementApi.deleteAbstractMeter(this.splitAbstractMeters(this.abstractMeterGlobal), this.domainGlobal);
      if (returnValue) {
        this.showToast(1);
      } else {
        this.showToast(3);
      }
      this.abstracMeterExists = false;
      this.abstractValudId = null;
      this.resetData();
    },
    openCalculationsFormula() {
      this.conditionType = "formula";
      let valueToAdd = this.openNewPage();
      console.log(valueToAdd);
    },
    openCalculationsCondition() {
      this.conditionType = "condition";
      let valueToAdd = this.openNewPage();
      console.log(valueToAdd);
    },
    openNewPage() {
      this.$refs.abstractMetersCalculation.open(this.conditionType);
    },
    handleMeasurementReturnFormula(value) {
      if (this.formulaMeter == null) {
        this.formulaMeter = this.concatenateStrings("[" + value + "]", "");
      } else {
        this.formulaMeter = this.concatenateStrings(this.formulaMeter, "[" + value + "]");
      }
      this.validateFormula();
    },
    handleMeasurementReturnCondition(value) {
      if (this.conditionMeter == null) {
        this.conditionMeter = this.concatenateStrings("[" + value + "]", "");
      } else {
        this.conditionMeter = this.concatenateStrings(this.conditionMeter, "[" + value + "]");
        this.validateCondition();
      }
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
</style>
