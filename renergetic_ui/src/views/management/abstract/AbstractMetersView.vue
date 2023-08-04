<template>
  <div class="container">
    <div class="centered-card">
      <Card style="width: 95%; margin: auto; margin-top: 1rem">
        <template #title> Abstract meter administration </template>
        <template #content>
          <div class="template_container" style="text">
            <AbstractMetersCalculation ref="abstractMetersCalculation" />
            <h1>Abstract meters management</h1>
            <!--
            <p>Value from meter: {{ abstractMeterGlobal }}</p>
            <p>Value from domain: {{ domainGlobal }}</p>
            <p>Vale from existance: {{ abstracMeterExists }}</p>
            -->
            <div class="card flex flex-wrap gap-3 field grid box">
              <p>Abstract meter list</p>
              <ren-input-wrapper>
                <template #content>
                  <Dropdown
                    v-model="abstractMeter"
                    :placeholder="dropdownAbstractMeter[0]"
                    :options="dropdownAbstractMeter"
                    @change="validateButton"
                  />
                </template>
              </ren-input-wrapper>
            </div>
            <div class="card flex flex-wrap gap-3 field grid box">
              <p>Domain list</p>
              <ren-input-wrapper>
                <template #content>
                  <Dropdown v-model="domain" :placeholder="dropdownDomain[0]" :options="dropdownDomain" @change="validateButton" />
                </template>
              </ren-input-wrapper>
            </div>
            <div class="card flex flex-wrap gap-3 field grid box">
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
            <div class="card flex flex-wrap gap-3 field grid box">
              <!-- <InputText class="" v-model="conditionMeter" type="text" :placeholder="'Condition to calculate the meter'" @input="validateCondition" /> -->
              <InputText
                v-model="conditionMeter"
                class="inputTextCondition"
                type="text"
                :placeholder="'Condition to calculate the meter'"
                @input="validateCondition"
              />
              <Button label="+" @click="openCalculationsCondition()" />
              <!-- <p v-if="isValidInputCondition">The input is valid.</p> -->
            </div>
            <div class="card flex justify-content-center">
              <Checkbox v-model="checked" :binary="true" />
            </div>
            <div class="card flex flex-wrap gap-5 field grid box">
              <Button :disabled="buttonDisabled" label="Save" @click="addAbstractMeter" />
              <Button :disabled="!abstracMeterExists" label="Delete" @click="deleteAbstractMeterFunc" />
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
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
export default {
  name: "AbstracMetersView",
  components: {
    AbstractMetersCalculation,
  },
  data() {
    return {
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
      conditionCheckPressed: false,
      abstractValudId: null,
      elementTextFormula: null,
      elementTextCondition: null,
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
      if (this.conditionCheckPressed) {
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
  },
};
</script>
<style scoped lang="scss">
.template_container {
  margin: 100px 200px;
  text-align: center;
}
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.box {
  flex: 1;
  //border: 1px white; /* Optional: Add borders for visualization */
  text-align: center; /* Optional: Align text in the center */
}
</style>
