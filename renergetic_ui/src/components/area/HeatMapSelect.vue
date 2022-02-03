<template>
  <Dialog
    v-model:visible="heatMapDialog"
    :style="{ width: '75vw' }"
    :maximizable="true"
    :modal="true"
    :dismissable-mask="true"
  >
    <div class="grid">
      <!-- {{ heatMapList }} -->
      <div class="col-8">
        <Card>
          <template #title> {{ $t("view.heatmap_list") }} </template>
          <template #content>
            <Listbox
              v-model="selectedArea"
              :options="heatMapList"
              option-label="label"
            >
              <template #option="slotProps">
                <div class="flex">
                  <div>{{ slotProps.option.label }}</div>
                  <i
                    class="pi pi-chevron-circle-right"
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
  </Dialog>
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
i.pi {
  margin-left: 0.25rem;
}
.flex > div {
  flex-grow: 1;
}
</style>
