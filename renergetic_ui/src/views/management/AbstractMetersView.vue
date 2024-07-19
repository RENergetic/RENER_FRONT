<template>
  <Card class="ren-page-content">
    <template #title
      >{{ $t("view.abstract_meter_administration") }}
      <i v-tooltip="$t('view.not_configured_abstract_meters')" class="pi pi-search" @click="showNotConfigured"
    /></template>
    <template #content>
      <RenSpinner ref="spinner" :lock="true" style="min-width: 100%; display: flex; justify-content: center; width: 95vw; max-width: 70rem">
        <template #content>
          <AbstractMeterList v-if="abstractMeterTypes" :abstract-meter-types="abstractMeterTypes" />
          <!-- <asset-list v-model:filters="filters" :asset-list="assetList" @reload="loadAssets" /> -->
        </template>
      </RenSpinner>
    </template>
  </Card>
  <Dialog v-model:visible="notConfiguredDialog" :style="{ width: '90vw', height: '90vh', maxHeight: '100%' }" :modal="true">
    <Card class="ren-page-content">
      <template #content>
        <div>
          <ol>
            <li v-for="m in notConfigured" :key="m.name + m.domain + m.custom_name">
              {{ m.name }}:{{ m.domain }}<span v-if="m.custom_name">({{ m.custom_name }})</span>
            </li>
          </ol>
        </div>
      </template>
    </Card>
  </Dialog>
</template>
<script>
import AbstractMeterList from "@/components/management/infrastructure/AbstractMeterList.vue";

export default {
  name: "AbstracMetersView",
  components: {
    AbstractMeterList,
  },
  data() {
    return { abstractMeterTypes: [], notConfigured: [], notConfiguredDialog: false };
  },
  async mounted() {
    await this.$refs.spinner.run(async () => {
      this.abstractMeterTypes = await this.$ren.kpiApi.getAbstracMeterList();
      if (this.abstractMeterTypes) {
        this.abstractMeterTypes = this.abstractMeterTypes.filter((it) => it.meter != "Custom");
      }
    });
  },
  methods: {
    async showNotConfigured() {
      this.notConfigured = await this.$ren.kpiApi.getNotConfiguredAbstracMeters();
      this.notConfiguredDialog = true;
    },
  },
};
</script>
<style scoped lang="scss"></style>
