<template>
  <Card style="margin: auto; margin-top: 0.5rem; max-width: 95vw">
    <template #title>{{ $t("menu.manage_information_panels") }}</template>
    <template #content>
      <RenSpinner ref="spinner" :lock="true" style="width: 100%">
        <template #content>
          <InformationPanelList v-model:filters="filters" :panel-list="panelList" @reload="loadData" />
        </template>
      </RenSpinner>
    </template>
  </Card>
</template>
<script>
import InformationPanelList from "@/components/dashboard/informationpanel/InformationPanelList.vue";

export default {
  name: "InformationPanelListView",
  components: { InformationPanelList },
  data() {
    return {
      filters: null,
      panelList: [],
    };
  },
  watch: {
    filters: function () {
      //TODO pass newval ?
      this.loadData();
    },
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      //todo: add some filters
      this.$refs.spinner.run(async () => {
        await this.$ren.dashboardApi.listInformationPanel().then((list) => {
          this.panelList = list;
        });
      });
    },
  },
};
</script>

<style lang="scss"></style>
