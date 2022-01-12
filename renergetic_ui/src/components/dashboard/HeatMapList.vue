<template>
  <div class="p-grid">
    {{ heatMapList }}
    <div class="p-col-8">
      <Card>
        <template #title> HeatMap view </template>
        <template #content>
          <Listbox
            v-model="selectedArea"
            :options="heatMapList"
            style="width: 15rem"
            option-label="label"
          >
            <template #option="slotProps">
              <div class="p-d-flex p-ai-center country-item">
                <div>{{ slotProps.option.label }}</div>
                <i
                  class="pi pi-times"
                  style="fontsize: 2rem"
                  @click="view(slotProps.option)"
                />
              </div>
            </template>
          </Listbox>
        </template>
      </Card>
    </div>
  </div>
</template>
<script>
import Listbox from "primevue/listbox";
// import { MapArea } from "../../plugins/model/Area";

import Card from "primevue/card";
export default {
  name: "HeatMapList",
  components: { Card, Listbox },
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
    view(selected) {
      let to = `/dashboard/heatmap/view/${selected.id}`;
      this.$router.push(to);
    },
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
