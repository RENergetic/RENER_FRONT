<template>
  <Card class="ren-page-content">
    <template #title>{{ $t("view.abstract_meter_administration") }}</template>
    <template #content>
      <RenSpinner ref="spinner" :lock="true" style="min-width: 100%; display: flex; justify-content: center; width: 95vw; max-width: 70rem">
        <template #content>
          <AbstractMeterList v-if="abstractMeterTypes" :abstract-meter-types="abstractMeterTypes" />
          <!-- <asset-list v-model:filters="filters" :asset-list="assetList" @reload="loadAssets" /> -->
        </template>
      </RenSpinner>
    </template>
  </Card>
</template>
<script>
import AbstractMeterList from "@/components/management/infrastructure/AbstractMeterList.vue";

export default {
  name: "AbstracMetersView",
  components: {
    AbstractMeterList,
  },
  data() {
    return { abstractMeterTypes: [] };
  },
  async mounted() {
    await this.$refs.spinner.run(async () => {
      this.abstractMeterTypes = await this.$ren.kpiApi.getAbstracMeterList();
    });
  },
  methods: {},
};
</script>
<style scoped lang="scss"></style>
