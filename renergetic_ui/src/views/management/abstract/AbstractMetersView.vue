<template>
  <div class="template_container">
    <AbstractMetersCalculation ref="abstractMetersCalculation" />
    <h1>Abstract meters management</h1>
    <!--
    <p>Value from meter: {{ abstractMeterGlobal }}</p>
    <p>Value from domain: {{ domainGlobal }}</p>
    <p>Vale from existance: {{ abstracMeterExists }}</p>
    -->
    <ren-input-wrapper :text-label="'Abstract meter list'">
      <template #content>
        <Dropdown v-model="abstractMeter" :placeholder="dropdownAbstractMeter[0]" :options="dropdownAbstractMeter" @change="validateButton" />
      </template>
    </ren-input-wrapper>
    <ren-input-wrapper :text-label="'Domain list'">
      <template #content>
        <Dropdown v-model="domain" :placeholder="dropdownDomain[0]" :options="dropdownDomain" @change="validateButton" />
      </template>
    </ren-input-wrapper>
    <div class="card flex flex-wrap gap-3 field grid">
      <InputText v-model="formulaMeter" type="text" :placeholder="'Formula to calculate the meter'" @input="validateFormula" />
      <Button label="+" @click="openCalculationsFormula()" />
      <p v-if="isValidInputFormula">The input is valid.</p>
      <p v-else>The input is not valid.</p>
    </div>
    <!--
  <div>Checkbox</div>
  <div class="card flex justify-content-center">
    <Checkbox v-model="checked" :binary="true" />
  </div>
  <div class="card flex flex-wrap gap-3 field grid">
    <label><input id="cbox1" type="checkbox" value="checked" /> Este es mi primer checkbox</label><br />
  </div>
  card flex justify-content-center
  -->
    <div class="card flex flex-wrap gap-3 field grid">
      <InputText v-model="conditionMeter" type="text" :placeholder="'Condition to calculate the meter'" @input="validateCondition" />
      <Button label="+" @click="openCalculationsCondition()" />
      <p v-if="isValidInputCondition">The input is valid.</p>
      <p v-else>The input is not valid.</p>
    </div>
    <div class="card flex flex-wrap gap-3 field grid">
      <Button :disabled="buttonDisabled" label="Save" @click="addAbstractMeter" />
      <Button :disabled="!abstracMeterExists" label="Delete" @click="deleteAbstractMeter" />
    </div>
  </div>
</template>
<script>
import AbstractMetersCalculation from "@/components/management/infrastructure/AbstractMetersCalculation.vue";
//import AbstractMetersCalculation from "./AbstractMetersCalculation.vue";
export default {
  name: "AbstracMetersView",
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
    };
  },
  async created() {
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
    console.log("Initial globals->" + this.abstractMeterGlobal + ":" + this.domainGlobal);
    //console.log(this.dropdownAbstractMeter);
  },
  methods: {
    /*
    openCalculationsFormula() {
      //console.error(this.$refs.abstractMetersCalculation);
      console.log(this.$refs.abstractMetersCalculation);
      console.log("Prueba");
      this.$refs.abstractMetersCalculation.open();
    },
    openCalculationsCondition() {
      //console.error(this.$refs.abstractMetersCalculation);
      console.log(this.$refs.abstractMetersCalculation);
      console.log("Prueba");
      this.$refs.abstractMetersCalculation.prueba();
    },
    */
    validateFormula() {
      this.isValidInputFormula = this.validateText(this.formulaMeter);
      this.validateButton();
    },
    validateCondition() {
      this.isValidInputCondition = this.validateText(this.conditionMeter);
      this.validateButton();
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
      // eslint-disable-next-line prettier/prettier
      if (this.conditionCheckPressed) {
        this.buttonDisabled = !(this.isValidInputFormula && this.isValidInputCondition);
      } else {
        //this.buttonDisabled = !/*((this.abstractMeter != null) && (this.domain != null) &&*/ this.isValidInputFormula/*)*/;
        this.buttonDisabled = !this.isValidInputFormula;
      }
      console.log("Initial globals 2->" + this.abstractMeterGlobal + ":" + this.domainGlobal);
      if (this.abstractMeter != null && this.abstractMeterGlobal != this.abstractMeter) {
        this.abstractMeterGlobal = this.abstractMeter;
      }
      if ((this.domain != null || this.domain != "") && this.domainGlobal != this.domain) {
        this.domainGlobal = this.domain;
      }
      console.log("Check globals: " + this.abstractMeterGlobal + ":" + this.domainGlobal);
      console.log((this.abstractMeter != null) + " " + (this.domain != null) + " " + this.isValidInputFormula + " " + this.isValidInputCondition);
      console.log(this.buttonDisabled);
      if (this.buttonDisabled) {
        console.log("The button cannot be pressed");
      } else {
        console.log("The button can be pressed");
      }
      console.log(this.buttonDisabled);
      this.variableExistanceChecker();
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
        this.abstractValudId = abstractValue.id;
        console.log(this.abstractMeterGlobal.replace(/\s/g, "").split(":")[0] + ":" + this.domainGlobal + "- Exists");
      } else {
        this.abstracMeterExists = false;
        this.abstractValudId = null;
        console.log(this.abstractMeterGlobal.replace(/\s/g, "").split(":")[0] + ":" + this.domainGlobal + "- Doesn´t exist");
      }
    },
    async deleteAbstractMeter() {
      console.log(this.abstractMeterGlobal, this.domainGlobal);
      this.variableExistanceChecker();
    },
  },
};
</script>
<style scoped lang="scss">
.template_container {
  margin: 100px 200px;
}
</style>
