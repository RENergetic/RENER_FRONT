<template>
  <div class="p-grid">
    <div class="p-col-8">
      <Card>
        <template #title> HeatMap view </template>
        <template #content>
          <Listbox
            v-model="selectedArea"
            :options="heatMapList"
            option-label="label"
            style="width: 15rem"
          >
            <template #optiongroup="slotProps">
              <div class="p-d-flex p-ai-center country-item">
                <div>{{ slotProps.option }}</div>
              </div>
            </template>
          </Listbox>
        </template>
      </Card>
    </div>
  </div>
</template>
<script>
// import Listbox from "primevue/listbox";
// import { MapArea } from "../../plugins/model/Area";

import Card from "primevue/card";
export default {
  name: "HeatMapList",
  components: { Card },
  data() {
    return {
      heatMapList: [],
      selectedArea: null,
    };
  },

  async mounted() {
    this.heatMapList = await this.$ren.dashboardApi.listHeatMap();
  },
  methods: {
    onClick() {},
  },
};
</script>

<style lang="scss">
#heatmap {
  max-width: 75%;
  max-height: 75vh;
}
#heatmapContainer {
  padding: 0.5rem;
}
</style>
