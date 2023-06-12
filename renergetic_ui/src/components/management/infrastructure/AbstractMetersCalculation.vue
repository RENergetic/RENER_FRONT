<template>
  <Dialog v-model:visible="dialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <Card>
      <template #title>{{ $t("view.add_asset_category") }}</template>
      <template #content>
        <InputText v-model="formulaMeter" type="text" :placeholder="'Condition to calculate the meter'" />
        <ren-input-wrapper :text-label="'Domain list (Dropdown)'">
          <template #content>
            <Dropdown v-model="domain" :placeholder="'Domain list (dropdown)'" :options="dropdownDomain" />
          </template>
        </ren-input-wrapper>
        <ren-input-wrapper :text-label="'Domain list (Dropdown)'">
          <template #content>
            <Dropdown v-model="domain" :placeholder="'Domain list (dropdown)'" :options="dropdownDomain" />
          </template>
        </ren-input-wrapper>
        <div>
          <div>
            <h1>Tags</h1>
            <InputText v-model="formulaMeter" type="text" :placeholder="'Condition to calculate the meter'" />
            <Button label="-" />
          </div>
          <div>
            <ren-input-wrapper :text-label="'Domain list (Dropdown)'">
              <template #content>
                <Dropdown v-model="domain" :placeholder="'Domain list (dropdown)'" :options="dropdownDomain" />
              </template>
            </ren-input-wrapper>
            <InputText v-model="formulaMeter" type="text" :placeholder="'Condition to calculate the meter'" />
            <Button label="-" />
          </div>
        </div>
        <!-- Only one option can be selected between filter by asset and filter by category -->
        <div class="card flex justify-content-center">
          <SelectButton v-model="value" :options="options" option-label="value" data-key="value" aria-labelledby="custom">
            <template #option="slotProps">
              <i :class="slotProps.option.icon"></i>
            </template>
          </SelectButton>
        </div>
        <ren-input-wrapper :text-label="'Domain list (Dropdown)'">
          <template #content>
            <Dropdown v-model="domain" :placeholder="'Domain list (dropdown)'" :options="dropdownDomain" />
          </template>
        </ren-input-wrapper>
        <Button label="Add" />
      </template>
    </Card>
  </Dialog>
</template>
<script>
export default {
  name: "AbstractMetersCalculation",
  data() {
    return {
      dialog: true,
      abstractMeterList: [],
      measurementNamesList: [],
      measurementTypesList: [],
    };
  },
  methods: {
    async open() {
      console.log("Función open");
      this.dialog = true;
      this.abstractMeterList = await this.$ren.managementApi.getAbstracMeterList();
      this.measurementNamesList = await this.$ren.managementApi.listMeasurement();
    },
    async prueba() {
      console.log("Función prueba");
      this.dialog = true;
      this.abstractMeterList = await this.$ren.managementApi.getAbstracMeterList();
      this.measurementNamesList = await this.$ren.managementApi.listMeasurement();
    },
  },
};
</script>
<style scoped lang="scss"></style>
