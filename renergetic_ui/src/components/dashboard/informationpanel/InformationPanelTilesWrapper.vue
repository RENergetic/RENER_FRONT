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
      <div class="col-3 flex flex-column" style="height: 100%">
        <Listbox
          v-if="panelStructure.tiles"
          v-model="mSelectedTile"
          class="flex-grow-1"
          :options="panelStructure.tiles"
          style="width: 100%; overflow: auto; margin-bottom: 0.75rem"
        >
          <template #option="tileItem">
            <span :class="'badge-sm state ' + tileColor(tileItem.option)" />
            <span style="margin-right: 0.5rem" class="font-bold white-space-nowrap">
              {{ tileLabel(tileItem.option) }}
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
        <Button :label="$t('view.button.close')" class="flex-grow-0 ren-button" style="width: 100%" @click="tilesDialog = false" />
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
      mSelectedTile: null,
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
    // panelStructure: {
    //   handler: function (s) {
    //     this.$emit("update:modelValue", s);
    //   },
    //   deep: true,
    //   immediate: false,
    // },
    mSelectedTile: {
      handler: function (v) {
        if (v != null) {
          this.selectedTile = v;
        } else {
          this.mSelectedTile = this.selectedTile;
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
    tileLabel(tile) {
      return tile.label ? tile.label : tile.name ? tile.name : `Tile ${tile.id ? tile.id : tile.tempId}`;
    },
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
    async deleteTile(tile) {
      await this.deleteConfirm({
        message: this.$t("view.delete_tile", { label: this.tileLabel(tile) }),
        action: async () => {
          // this.mModel.measurements = this.mModel.measurements.filter((it) => it.id != m.id);
          if (tile.id) {
            this.panelStructure.tiles = this.panelStructure.tiles.filter((it) => it.id != tile.id);
          } else {
            this.panelStructure.tiles = this.panelStructure.tiles.filter((it) => it.tempId != tile.tempId);
          }
          this.$emit("update:modelValue", this.panelStructure);
        },
      });
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
      this.$emit("update:modelValue", this.panelStructure);
    },
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
