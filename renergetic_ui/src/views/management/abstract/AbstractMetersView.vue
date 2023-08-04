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
          <Button :disabled="buttonDisabled" label="Save" @click="addAbstractMeter" />
          <Button icon="pi pi-trash" class="p-button-danger" :disabled="!abstracMeterExists" label="Delete" @click="deleteAbstractMeterFunc" />
        </div>
      </div>
    </template>
  </Card>
  <AbstractMetersCalculation
    ref="abstractMetersCalculation"
    @selected-measurement-formula="testFunction"
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
      buttonDisabled: true,
      abstracMeterExists: false,
      abstractValudId: null,
      elementTextFormula: null,
      elementTextCondition: null,
      conditionMeterShown: false,
    };
  },
  async created() {
    console.log("Created");
    this.elementTextFormula = document.getElementById("inputTextFormula");
    this.elementTextCondition = document.getElementById("inputTextCondition");
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
    console.log(
      "Initial globals 3->" + this.abstractMeterGlobal + ":" + this.domainGlobal + " F-> " + this.formulaMeter + " C-> " + this.conditionMeter,
    );
    console.log("Initial globals->" + this.abstractMeterGlobal + ":" + this.domainGlobal);
    console.log("End of created");
    //console.log(this.dropdownAbstractMeter);
  },
  methods: {
    validateFormula() {
      this.isValidInputFormula = this.validateText(this.formulaMeter);
      console.log("Validate formula-> " + this.isValidInputFormula);
      this.validateSave();
    },
    validateCondition() {
      this.isValidInputCondition = this.validateText(this.conditionMeter);
      /*if (this.isValidInputCondition) {
        this.elementTextCondition.style.color = "black";
      } else {
        this.elementTextCondition.style.color = "red";
      }*/
      console.log("Validate condition-> " + this.isValidInputCondition);
      this.validateSave();
    },
    validateText(text) {
      //const pattern = /^[0-9[\]]+$/;
      //const expressionRegex = /^(\d+(\s*[+\-\/*]\s*\[\d+\])*)$/;
      // eslint-disable-next-line no-useless-escape
      const expressionRegex = /^\(*((\d+(\.\d+)?)|(\[\d+\]))([+*^\/-]\(*((\d+(\.\d+)?)|(\[\d+\]))\)*)*$/;
      console.log(text);
      let isValidInput = expressionRegex.test(text);
      console.log(this.isValidInput);
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
        this.buttonDisabled = !(this.isValidInputFormula && this.isValidInputCondition);
      } else {
        //this.buttonDisabled = !/*((this.abstractMeter != null) && (this.domain != null) &&*/ this.isValidInputFormula/*)*/;
        console.log("mostrar-> " + this.buttonDisabled);
        this.buttonDisabled = !this.isValidInputFormula;
      }
      console.log(this.buttonDisabled);
      if (this.buttonDisabled) {
        console.log("The button cannot be pressed");
      } else {
        console.log("The button can be pressed");
      }
      console.log(this.buttonDisabled);
    },
    async addAbstractMeter() {
      console.log(this.abstractMeterGlobal.replace(/\s/g, "").split(":")[0]);
      console.log("longitud" + this.conditionMeter);
      // eslint-disable-next-line prettier/prettier
      if (this.conditionMeter == '') {
        // this won´t be neccessary when the checkbox exists, because the value will be changed to null when the checkbox is not with the tick
        this.conditionMeter = null;
      }
      if (this.abstracMeterExists) {
        const jsonAbstractMeter = {
          id: this.abstractValudId,
          name: this.abstractMeterGlobal.replace(/\s/g, "").split(":")[0],
          formula: this.formulaMeter,
          condition: this.conditionMeter,
          domain: this.domainGlobal,
        };
        console.log(jsonAbstractMeter);
        await this.$ren.managementApi.updateAbstractMeter(jsonAbstractMeter);
      } else {
        const jsonAbstractMeter = {
          name: this.abstractMeterGlobal.replace(/\s/g, "").split(":")[0],
          formula: this.formulaMeter,
          condition: this.conditionMeter,
          domain: this.domainGlobal,
        };
        console.log(jsonAbstractMeter);
        await this.$ren.managementApi.addAbstractMeter(jsonAbstractMeter);
        this.buttonDisabled = true;
      }
    },
    async variableExistanceChecker() {
      console.log("Initial globals 3->" + this.abstractMeterGlobal + ":" + this.domainGlobal);
      console.log(this.abstractMeterGlobal.replace(/\s/g, "").split(":")[0] + ":" + this.domainGlobal);
      let abstractValue = await this.$ren.managementApi.getAnAbstracMeterConfiguration(
        this.abstractMeterGlobal.replace(/\s/g, "").split(":")[0],
        this.domainGlobal,
      );
      if (abstractValue != null) {
        this.abstracMeterExists = true;
        console.log("AbstractMeterExists-> " + this.abstracMeterExists);
        this.abstractValudId = abstractValue.id;
        this.formulaMeter = abstractValue.formula;
        this.conditionMeter = abstractValue.condition;
        console.log(
          "Variable existance checker -> " + this.abstractMeterGlobal.replace(/\s/g, "").split(":")[0] + ":" + this.domainGlobal + "- Exists",
        );
        this.buttonDisabled = false;
      } else {
        this.abstracMeterExists = false;
        console.log("AbstractMeterExists-> " + this.abstracMeterExists);
        this.abstractValudId = null;
        console.log(this.abstractMeterGlobal.replace(/\s/g, "").split(":")[0] + ":" + this.domainGlobal + "- Doesn´t exist");
      }
      this.validateFormula();
      this.validateCondition();
    },
    async deleteAbstractMeterFunc() {
      console.log(this.abstractMeterGlobal.replace(/\s/g, "").split(":")[0], this.domainGlobal);
      await this.$ren.managementApi.deleteAbstractMeter(this.abstractMeterGlobal.replace(/\s/g, "").split(":")[0], this.domainGlobal);
      this.abstractMeterGlobal = this.dropdownAbstractMeter[0];
      this.domainGlobal = this.dropdownDomain[0];
      this.variableExistanceChecker();
    },
    openCalculationsFormula() {
      let valueToAdd = this.openNewPage("formula");
      console.log(valueToAdd);
    },
    openCalculationsCondition() {
      let valueToAdd = this.openNewPage("condition");
      console.log(valueToAdd);
    },
    openNewPage(conditionType) {
      console.log(this.$refs.abstractMetersCalculation);
      this.$refs.abstractMetersCalculation.open(conditionType);
      //TODO: CHECK IF THIS RETURN IS NECESSARY -> I DON´T THINK SO
    },
    handleMeasurementReturnFormula(value) {
      console.log("AbstractMetersView: " + value);
      console.log("Before: " + this.formulaMeter);
      if (this.formulaMeter == null) {
        this.formulaMeter = "[" + value + "]";
      } else {
        this.formulaMeter = this.formulaMeter + "[" + value + "]";
      }
      console.log("After: " + this.formulaMeter);
    },
    handleMeasurementReturnCondition(value) {
      console.log("AbstractMetersView: " + value);
      console.log("Before: " + this.conditionMeter);
      if (this.conditionMeter == null) {
        this.conditionMeter = "[" + value + "]";
      } else {
        this.conditionMeter = this.conditionMeter + "[" + value + "]";
      }
      console.log("After: " + this.conditionMeter);
    },
    testFunction(value) {
      console.log("AbstractMetersView: " + value);
      console.log("Before: " + this.formulaMeter);
      if (this.formulaMeter == null) {
        this.formulaMeter = this.concatenateStrings("[" + value + "]", "");
        console.log("AbstracMetersView vacio: " + this.formulaMeter);
      } else {
        console.log("AbstracMetersView con valor: " + this.formulaMeter);
        this.formulaMeter = this.concatenateStrings(this.formulaMeter, "[" + value + "]");
        console.log("AbstracMetersView con valor: " + this.formulaMeter);
      }
      console.log("After: " + this.formulaMeter);
      this.validateFormula();
    },
    concatenateStrings(string1, string2) {
      let concatString = string1 + string2;
      return concatString;
    },
    conditionButtonCheck() {
      this.validateSave();
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
</style>
