<template>
  <Card class="col-12" style="width: 90%; margin: auto; margin-top: 1rem">
    <template #content>
      <RenSpinner ref="spinner" :lock="true" style="margin: auto; max-width: 80rem">
        <!--  max-width: 80vw -->
        <template #content>
          <InformationPanelList v-model:filters="filters" :panel-list="panelList" @reload="loadAssets" />
        </template>
      </RenSpinner>
    </template>
  </Card>
</template>
<script>
// import { MapArea } from "../../plugins/model/Area";

import InformationPanelList from "@/components/dashboard/informationpanel/InformationPanelList.vue";

//initial canvas size
// const sceneWidth = 900;
// const sceneHeight = 450;

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
