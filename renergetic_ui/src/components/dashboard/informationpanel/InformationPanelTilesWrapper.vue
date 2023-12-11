<template>
  <ren-input-wrapper :text-label="null" wrapper-style="max-width: inherit">
    <template #content>
      <Accordion v-if="panelStructure" v-model:activeIndex="activeTile" class="ren">
        <AccordionTab v-for="(tile, idx) in panelStructure.tiles" :key="idx">
          <template #header>
            <span :class="'badge state ' + tileColor(tile)" />
            <span style="margin-right: 0.5rem" class="font-bold white-space-nowrap">
              {{ tile.label ? tile.label : tile.name ? tile.name : `Tile ${idx}` }}
            </span>
            <div>
              {{ $t("view.measurements_static") }}: <span class="badge state ok">{{ tileCountMeasurements(tile) }}</span>
            </div>
            <div>
              {{ $t("view.measurements_dynamic") }}:
              <span v-if="!isTemplate" class="badge state warning">{{ tileCountEmpty(tile) }}</span>
              <span v-else class="badge state ok">{{ tileCountEmpty(tile) }}</span>
            </div>
            <div style="flex-grow: 1">
              <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" style="float: right" @click="deleteTile(idx)" />
            </div>
          </template>
          <information-panel-tile-form v-model="panelStructure.tiles[idx]" />
        </AccordionTab>
      </Accordion>
    </template>
  </ren-input-wrapper>

  <ren-input-wrapper :text-label="null" wrapper-style="max-width: inherit" style="position: sticky; bottom: 0.25rem; margin-right: 4rem">
    <template #content>
      <Button :label="$t('view.button.add')" style="float: right" icon="pi pi-plus-circle" @click="addTile" />
    </template>
  </ren-input-wrapper>
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
    deleteTile(idx) {
      this.panelStructure.tiles.splice(idx, 1);
      // this.$emit("update:modelValue", this.panelStructure); -> watcher should emmit this
    },
    addTile() {
      let maxY = 0;
      for (let t of this.panelStructure.tiles) {
        if (t.layout.y + t.layout.h > maxY) {
          maxY = t.layout.y + t.layout.h;
        }
      }
      let tile = {
        layout: {
          x: 0,
          h: 3,
          w: 3,
          y: maxY,
        },
        measurements: [],
        type: "single",
      };
      this.panelStructure.tiles.push(tile);
      // this.$emit("update:modelValue", this.panelStructure); -> watcher should emmit this
    },
    // async deleteTile(tile) {
    //   let mDashboard = dashboard ? dashboard : this.dashboard;
    //   if (mDashboard == null) {
    //     return;
    //     //todo: log error ?
    //   }
    //   await this.$confirm.require({
    //     message: this.$t("view.dashboard_delete_confirm", {
    //       label: mDashboard.label ? mDashboard.label : mDashboard.name,
    //     }),
    //     header: this.$t("view.dashboard_delete"),
    //     icon: "pi pi-exclamation-triangle",
    //     accept: async () => {
    //       this.$store.commit("view/dashboardsDel", mDashboard.id);
    //       let res = await this.deleteConfirmed(mDashboard.id);
    //       if (res) this.$emit("delete", mDashboard);
    //     },
    //     reject: () => {
    //       this.$confirm.close();
    //     },
    //   });
    // },
  },
};
</script>

<style lang="scss" scoped>
.p-accordion-content {
  padding-bottom: 0 !important;
  padding-top: 0 !important;
}
.ren .ren-inputwrapper > .p-accordion {
  max-width: 100%;
}
.p-accordion-tab {
  max-height: 70vh;
}
</style>
