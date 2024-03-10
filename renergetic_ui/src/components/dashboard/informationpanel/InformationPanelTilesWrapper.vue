<template>
  <ren-input-wrapper :text-label="null" wrapper-style="max-width: inherit" style="position: sticky; bottom: 0.25rem; margin-right: 4rem">
    <template #content>
      <Button :label="$t('view.button.edit_tiles')" style="float: left; max-width: 20rem" icon="pi pi-plus-circle" @click="tilesDialog = true" />
    </template>
  </ren-input-wrapper>
  <Dialog
    v-model:visible="tilesDialog"
    :closable="false"
    :style="{ width: '100vw', height: '100vh', maxHeight: '100vh' }"
    :modal="true"
    :dismissable-mask="false"
    :show-header="false"
  >
    <div class="grid ren flex" style="height: 100%; overflow: auto; padding-top: 0.5rem">
      <!-- :key="selectedRecommendation.id + (compareWith ? compareWith.id : '')" -->
      <div class="col-3 flex flex-column" style="height: 100%">
        <Listbox
          v-if="panelStructure.tiles"
          v-model="mSelecteTile"
          class="flex-grow-1"
          :options="panelStructure.tiles"
          style="width: 100%; overflow: auto; margin-bottom: 0.75rem"
        >
          <template #option="tileItem">
            <!-- {{ tileItem }} -->
            <span :class="'badge-sm state ' + tileColor(tileItem.option)" />
            <span style="margin-right: 0.5rem" class="font-bold white-space-nowrap">
              {{
                tileItem.option.label
                  ? tileItem.option.label
                  : tileItem.option.name
                  ? tileItem.option.name
                  : `Tile ${tileItem.option.id ? tileItem.option.id : tileItem.option.tempId}`
              }}
            </span>
            <div style="flex-wrap: wrap">
              <span>
                {{ $t("view.measurements_static") }}: <span class="badge state ok">{{ tileCountMeasurements(tileItem.option) }}</span>
              </span>
              <span>
                {{ $t("view.measurements_dynamic") }}:
                <span v-if="!isTemplate" class="badge state warning">{{ tileCountEmpty(tileItem.option) }}</span>
                <span v-else class="badge state ok">{{ tileCountEmpty(tileItem.option) }}</span>
              </span>
            </div>
            <!-- <div><Button icon="pi pi-trash" class="p-button-rounded p-button-danger" style="float: right" @click="deleteTile(tileItem.index)" /></div> -->
            <div style="flex-grow: 1"></div>
          </template>
        </Listbox>

        <Button :label="$t('view.button.add_tile')" class="flex-grow-0 ren-button" style="width: 100%" icon="pi pi-plus-circle" @click="addTile" />
        <Button
          v-if="selectedTile"
          icon="pi pi-trash"
          class="p-button-danger ren-button"
          :label="$t('view.button.delete_selected_tile')"
          style="float: right"
          @click="deleteTile(selectedTile)"
        />
        <Button
          v-else
          icon="pi pi-trash"
          class="p-button-danger ren-button"
          :label="$t('view.button.delete_selected_tile')"
          style="float: right"
          :disabled="true"
        />
        <Button :label="$t('view.button.cancel')" class="flex-grow-0 ren-button" style="width: 100%" @click="tilesDialog = false" />
      </div>
      <div class="col-9 flex flex-column" style="height: 100%">
        <!-- <AccordionTab v-if="selectedTile">
          <template #header>
            <span :class="'badge state ' + tileColor(selectedTile)" />
            <span style="margin-right: 0.5rem" class="font-bold white-space-nowrap">
              {{ tile.label ? tile.label : tile.name ? tile.name : `Tile ${selectedTile.id}` }}
            </span>
            <div>
              {{ $t("view.measurements_static") }}: <span class="badge state ok">{{ tileCountMeasurements(selectedTile) }}</span>
            </div>
            <div>
              {{ $t("view.measurements_dynamic") }}:
              <span v-if="!isTemplate" class="badge state warning">{{ tileCountEmpty(selectedTile) }}</span>
              <span v-else class="badge state ok">{{ tileCountEmpty(selectedTile) }}</span>
            </div>
            <div style="flex-grow: 1">
              <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" style="float: right" @click="deleteTile(selectedTile)" />
            </div>
          </template> -->
        <!-- {{ selectedTile }} -->
        <information-panel-tile-form
          v-if="selectedTile"
          :key="selectedTile.id ? selectedTile.id : selectedTile.tempId"
          v-model="selectedTile"
          class="flex flex-grow-1"
        />
        <!-- </AccordionTab> -->
      </div>
    </div>
    <!-- 
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
    </Accordion> -->
  </Dialog>
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
      tilesDialog: false,
      inferMeasurements: false,
      activeTile: null,
      selectedTile: null,
      mSelecteTile: null,
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
    mSelecteTile: {
      handler: function (v) {
        if (v != null) {
          this.selectedTile = v;
        } else {
          this.mSelecteTile = this.selectedTile;
        }
      },
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
    // deleteTile(idx) {
    //   this.panelStructure.tiles.splice(idx, 1);
    //   // this.$emit("update:modelValue", this.panelStructure); -> watcher should emmit this
    // },
    deleteTile(tile) {
      if (tile.id) {
        this.panelStructure.tiles = this.panelStructure.tiles.filter((it) => it.id != tile.id);
      } else {
        this.panelStructure.tiles = this.panelStructure.tiles.filter((it) => it.tempId != tile.tempId);
      }

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
        tempId: this.$ren.utils.currentTimestamp() - maxY,
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
.p-accordion-content {
  max-height: 70vh;
}
</style>
