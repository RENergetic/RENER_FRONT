<template>
  <!-- {{ $store.getters["view/measurementTypes"] }}  -->
  <!-- {{ $store.getters["settings/filter"] }} -->
  <!-- {{ pdata }} -->
  <!-- refreshTime: {{ $store.getters["settings/panel"].refreshTime }} -->
  <!-- {{ $store.getters["settings/panel"] }} -->
  <!-- panel: {{ panel.name }}{{ panel.id }} {{ assetId }} -->
  <RenSpinner ref="spinner" :lock="true" style="width: 100%; min-height: 15rem">
    <template #content>
      <InformationPanel
        v-if="mPanel"
        :edit="editMode"
        :pdata="pdata"
        :panel="mPanel"
        :locked="locked"
        :settings="panelSettings"
        :asset-id="assetId"
        :filter="mFilter"
        @edit="onEdit"
        @timeseries-update="onTimeseriesUpdate"
      />
    </template>
  </RenSpinner>
  <Dialog v-model:visible="editDialog" :style="{ width: '50vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <div class="field grid">
      <label for="assetType" class="col-fixed" style="width: 5rem">
        {{ $t("model.information_tile.type") }}
      </label>
      <div class="col">
        <Dropdown
          id="assetType"
          v-model="selectedItem.tile.type"
          :options="tileTypes"
          option-label="label"
          option-value="value"
          :placeholder="$t('view.select_tile_type')"
        />
      </div>
    </div>
    <div class="field grid">
      <Button :label="$t('view.button.manage_measurement')" icon="pi pi-plus" @click="() => (manageSensorsDialog = !manageSensorsDialog)" />
    </div>
    <div class="field grid">
      <Button :label="$t('view.button.submit')" icon="pi pi-plus" @click="saveGrid" />
    </div>
    <Dialog v-model:visible="manageSensorsDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
      <!-- {{ selectedTile.tile.measurements }} -->
      <ManageSensors v-model="selectedItem.tile.measurements"></ManageSensors>
    </Dialog>
  </Dialog>
</template>
<script>
// import NotificationList from "@/components/management/notification/NotificationList.vue";
import InformationPanel from "./InformationPanel.vue";
import ManageSensors from "../measurements/ManageSensors.vue";
import { DeferredFunction } from "@/plugins/renergetic/utils.js";
// import { GridStack } from "gridstack";
import LoopRunner from "@/plugins/utils/loop_runner.js";
import { TileTypes, NotificationContext } from "@/plugins/model/Enums.js";
// THEN to get HTML5 drag&drop
// import "gridstack/dist/h5/gridstack-dd-native";
// import "gridstack/dist/gridstack.min.css";
export default {
  name: "InformationPanelWrapper",
  components: {
    InformationPanel,
    ManageSensors,
    // NotificationList,
  },
  props: {
    assetId: {
      type: Number,
      default: null,
    },
    locked: {
      type: Boolean,
      default: true,
    },
    panel: {
      type: Object,
      default: () => null,
    },
    filter: {
      type: Object,
      default: null,
    },
    conversionSettings: {
      type: Object,
      default: () => {
        return {};
      },
    },
    autoReload: {
      type: Boolean,
      default: true,
    },
    panelSettings: {
      type: Object,
      default: () => {
        return {};
      },
    },
    filterKey: {
      type: String,
      default: "filter",
    },

    editMode: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update"],
  data() {
    return {
      mNotifications: [],
      mFilter: this.filter ? this.filter : this.$store.getters["settings/parsedFilter"](this.filterKey),
      grid: null,
      notificationDialog: false,
      editDialog: false,
      selectedItem: null,
      mPanel: null,
      manageSensorsDialog: false,
      pdata: null,
      deferredFilter: null,
      tileTypes: Object.entries(TileTypes).map((k) => {
        return { value: k[1], label: this.$t("enums.tile_type." + k[1]) };
      }),
      loopRunner: null,
      notificationContext: NotificationContext.TILE,
    };
  },
  computed: {
    tiles: function () {
      // return this.panel != null ? this.panel.tiles : [];
      return this.mPanel != null ? this.mPanel.tiles : [];
    },
    gridItems: function () {
      return this.grid != null ? this.grid.getGridItems() : [];
    },
  },
  watch: {
    manageSensorsDialog: function (newValue) {
      if (!newValue) this.mPanel.tiles[this.selectedItem.index] = this.selectedItem.tile;
    },
    panel: function (newValue) {
      if (newValue != null) {
        console.info("panel change");
        console.info(newValue);

        if (this.autoReload) {
          if (this.loopRunner != null) this.loopRunner.stop();
          let refreshTime = this.$store.getters["settings/panel"].refreshTime ? this.$store.getters["settings/panel"].refreshTime : 60000;

          this.loopRunner = LoopRunner.init(this.loadData, refreshTime);
          this.loopRunner.start();
        } else {
          this.loadData();
        }
      }
    },
    "panel.id": function (newValue, oldValue) {
      if (newValue != null) {
        console.info(newValue);
        console.info(oldValue);
      }
    },
    filter: {
      handler: function () {
        this.deferredFilter.run();
      },
      deep: true,
    },
  },
  created() {
    this.deferredFilter = new DeferredFunction(this.loadData, 1000);
  },
  async beforeMount() {
    if (!this.panel.is_template) {
      this.mPanel = this.panel;
    }
  },
  async mounted() {
    let refreshTime = this.$store.getters["settings/panel"].refreshTime ? this.$store.getters["settings/panel"].refreshTime : 60000;

    if (refreshTime > 0 && this.autoReload) {
      this.loopRunner = LoopRunner.init(this.loadData, refreshTime);
      this.loopRunner.start();
    } else {
      this.loadData();
    }
    // this.reloadGrid();
  },
  methods: {
    // reloadGrid() {
    //   if (this.grid != null) this.grid.destroy(false);
    //   let grid = GridStack.init({ float: true }, "#panel-grid-stack");
    //   if (this.locked) {
    //     grid.disable();
    //   } else {
    //     grid.enable();
    //   }
    //   grid.disable();
    //   this.grid = grid;
    // },
    onTimeseriesUpdate(evt) {
      console.error("onTimeseriesUpdate TODO:");
      console.error(evt);
    },
    async loadData() {
      if (this.panel.id != null) {
        console.info("panel load data: " + this.panel.id);
        this.$refs.spinner.run(async () => {
          console.info("wait for panel data: " + this.panel.id + " " + this.panel.is_template);
          await this.$ren.dataApi.getPanelData(this.panel.id, this.assetId, this.mFilter).then((resp) => {
            this.pdata = resp.data;
            if (this.panel.is_template) this.mPanel = resp.panel;
          });
        });
        // console.info("load data, is template: " + this.panel.is_template);
        // if (this.panel.is_template) {
        //   this.$refs.spinner.run(async () => {
        //     console.info("wait for panel data: " + this.panel.id + ": " + this.assetId);
        //     await this.$ren.dataApi.getPanelData(this.panel.id, this.assetId, this.mFilter).then((resp) => {
        //       this.mPanel = resp.panel;
        //       this.pdata = resp.data;
        //     });
        //   });
        //   // let resp = await this.$ren.dataApi.getPanelData(this.panel.id, this.assetId, filter);
        //   // this.mPanel = resp.panel;
        //   // this.pdata = resp.data;
        // } else {
        //   this.$refs.spinner.run(async () => {
        //     console.info("wait for panel data: " + this.panel.id);
        //     await this.$ren.dataApi.getPanelData(this.panel.id, null, this.mFilter).then((resp) => {
        //       this.pdata = resp.data;
        //     });
        //   });
        //   // let resp = await this.$ren.dataApi.getPanelData(this.panel.id, null, filter);
        //   // this.pdata = resp.data;
        // }
      }
      console.info("Panel data loaded");
    },
    // gridWidth(tile) {
    //   return tile.col == null ? 2 : tile.col;
    // },
    onEdit(evt) {
      //todo
      this.selectedItem = evt;
      this.editDialog = true;
    },

    saveGrid() {
      //TODO: save
      let nodes = this.gridItems;
      let tiles = this.tiles;
      nodes.forEach((node) => {
        let gridstackNode = node.gridstackNode;
        const tile = tiles.find((t) => t.id === gridstackNode.id);
        if (tile) {
          tile.layout = {
            x: gridstackNode.x,
            y: gridstackNode.y,
            w: gridstackNode.w,
            h: gridstackNode.h,
          };
        }
      });
      this.mPanel.tiles = tiles;
      this.$emit("update", this.mPanel);
    },

    // viewNotification(evt) {
    //   //TODO: load here notifications for tile
    //   this.selectedItem = evt;
    //   this.notificationDialog = true;
    // },
  },
};
</script>

<style lang="scss">
// #panel-grid-stack {
//   width: 100%;
//   position: absolute;
//   top: 0;
// }
</style>
