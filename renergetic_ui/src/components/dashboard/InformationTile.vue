<template>
  <Card>
    <template v-if="mArea != null" #title>
      {{ $t("view.edit_area") }}
      <i class="pi pi-times" style="fontsize: 2rem" @click="deleteArea()" />
    </template>
    <template v-if="mArea != null" #content>
      <!-- {{ area.id }} -->
      <div class="p-field p-grid">
        <label for="heatmapLabel">
          {{ $t("heatmap.label") }}
        </label>
        <InputText id="heatmapLabel" v-model="mArea.label" />
      </div>
    </template>
  </Card>
</template>
<script>
import Card from "primevue/card";
export default {
  name: "InformationTile",
  components: { Card },
  props: {
    url: {
      type: String,
      default: null,
    },
  },
  // data() {
  //   return {};
  // },

  mounted() {},
  methods: {},
};
</script>

<style lang="scss">
#dashboard iframe {
  width: 100%;
  height: 100%;
}
#dashboard {
  position: relative;
  height: 100%;
  width: 100%;
  display: inline-block;
}
</style>
