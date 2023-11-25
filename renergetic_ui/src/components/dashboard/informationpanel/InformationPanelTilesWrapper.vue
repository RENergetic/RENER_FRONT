<template>
  <!-- {{ panelStructure }} -->
  <Accordion v-if="panelStructure" v-model:activeIndex="activeTile" class="ren">
    <AccordionTab v-for="(tile, idx) in panelStructure.tiles" :key="idx">
      <template #header>
        <span :class="'badge state ' + tileColor(tile)" />
        <span style="margin-right: 0.5rem" class="font-bold white-space-nowrap">
          {{ tile.label ? tile.label : tile.name ? tile.name : `${idx}` }}
        </span>
        <div>
          {{ $t("view.static_measurements") }}: <span class="badge state ok">{{ tileCountMeasurements(tile) }}</span>
        </div>
        <div>
          {{ $t("view.dynamic_measurements") }}:
          <span v-if="!isTemplate" class="badge state warning">{{ tileCountEmpty(tile) }}</span>
          <span v-else class="badge state ok">{{ tileCountEmpty(tile) }}</span>
        </div>
      </template>
      <information-panel-tile-form v-model="panelStructure.tiles[idx]" />
    </AccordionTab>
  </Accordion>
</template>

<script>
import InformationPanelTileForm from "./InformationPanelTileForm.vue";
export default {
  name: "InformationPanelTilesWrapper",
  components: { InformationPanelTileForm },
  props: {
    modelValue: {
      type: Object,
      default: () => ({ tiles: [] }),
    },
    isTemplate: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      inferMeasurements: false,
      activeTile: null,

      addMode: this.modelValue == null || this.modelValue.name == null,
      // mPanelStructure: null,
      panelStructure: this.modelValue,
      labelWarning: null,
      importPanelDialog: false,
      hasFiles: false,
      submittedPanelJSON: null,
    };
  },
  watch: {
    panelStructure: {
      handler: function (s) {
        console.info(s);
        this.$emit("update:modelValue", s);
      },
      deep: true,
      immediate: false,
    },
    // modelValue: {
    //   handler: function (s) {
    //     this.panelStructure = s;
    //   },
    //   deep: true,
    //   immediate: false,
    // },
  },
  async mounted() {},
  methods: {
    tileColor(tile) {
      if (this.isTemplate || tile.measurements.length == 0) {
        return "";
      }
      let hasMeasurementId = false;
      let hasEmpty = false;
      for (let m of tile.measurements) {
        if (m.id) {
          hasMeasurementId = true;
        } else {
          hasEmpty = true;
        }
      }
      if (hasMeasurementId && hasEmpty) {
        return "warning";
      }
      if (!hasMeasurementId && hasEmpty) {
        return "error";
      }
      return "ok";
    },
    tileCountMeasurements(tile) {
      let mCount = 0;
      if (tile.measurements.length == 0) {
        return mCount;
      }
      for (let m of tile.measurements) {
        if (m.id) {
          mCount++;
        }
      }
      return mCount;
    },
    tileCountEmpty(tile) {
      let mCount = 0;
      if (tile.measurements.length == 0) {
        return mCount;
      }
      for (let m of tile.measurements) {
        if (!m.id) {
          mCount++;
        }
      }
      return mCount;
    },
  },
};
</script>

<style lang="scss" scoped>
.p-accordion-content {
  padding-bottom: 0 !important;
  padding-top: 0 !important;
}
</style>
