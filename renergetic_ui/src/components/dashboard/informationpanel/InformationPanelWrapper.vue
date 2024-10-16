<template>
  <!-- {{ paneldata }} -->
  <!-- {{ $store.getters["view/panelAsset"](panel.id, assetId) }} -->
  <!-- ff{{ filter }}dd -->
  <RenSpinner ref="spinner" :lock="true" style="width: 100%; min-height: 15rem">
    <template #content>
      <InformationPanel
        v-if="mPanel"
        :edit="editMode"
        :panel-data="panelData"
        :panel="mPanel"
        :locked="locked"
        :settings="panelSettings"
        :asset-id="assetId"
        :filter="mFilter"
        @timeseries-update="onTimeseriesUpdate"
        @update:tile="onTileUpdate"
      />
    </template>
  </RenSpinner>
  <div v-if="mPanel && mPanel.props.qrcode">
    <QRCode v-model="mPanel.props.qrcode" :position="mPanel.props.qrcodePosition" :size="mPanel.props.qrcodeSize" />
  </div>
</template>
<script>
import InformationPanel from "./InformationPanel.vue";
import { DeferredFunction } from "@/plugins/renergetic/utils.js";
// import { GridStack } from "gridstack";
import LoopRunner from "@/plugins/utils/loop_runner.js";
import QRCode from "@/components/miscellaneous/QRCode.vue";
import { TileTypes, NotificationContext } from "@/plugins/model/Enums.js";
// THEN to get HTML5 drag&drop
// import "gridstack/dist/h5/gridstack-dd-native";
// import "gridstack/dist/gridstack.min.css";
export default {
  name: "InformationPanelWrapper",
  components: {
    InformationPanel,
    QRCode,
    // ManageSensors,
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
  emits: ["update", "update:tile"],
  data() {
    return {
      mNotifications: [],
      mFilter: this.filter ? this.filter : this.$store.getters["settings/parsedFilter"](this.filterKey),
      grid: null,
      notificationDialog: false,
      // editDialog: false,
      selectedItem: null,
      mPanel: null,
      manageSensorsDialog: false,
      panelData: null,
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
    // gridItems: function () {
    //   return this.grid != null ? this.grid.getGridItems() : [];
    // },
  },
  watch: {
    manageSensorsDialog: function (newValue) {
      if (!newValue) this.mPanel.tiles[this.selectedItem.index] = this.selectedItem.tile;
    },
    panel: function (newValue) {
      if (newValue != null) {
        // console.info("panel change");
        console.debug(newValue);

        if (this.autoReload) {
          if (this.loopRunner != null) this.loopRunner.stop();
          // this.$store.getters["settings/panel"].refreshTime ? this.$store.getters["settings/panel"].refreshTime : 60000;
          let refreshTime = Math.max(this.panelSettings.refreshTime ? this.panelSettings.refreshTime : 60000, 60000);
          this.loopRunner = LoopRunner.init(this.loadData, refreshTime);
          this.loopRunner.start();
        } else {
          this.loadData();
        }
      }
    },
    "panel.id": function (newValue, oldValue) {
      if (newValue != null) {
        console.info(`Panel id change: ${newValue} - ${oldValue}`);
      }
    },
    filter: {
      handler: function () {
        if (this.deferredFilter) this.deferredFilter.run();
      },
      deep: true,
    },
  },
  beforeUnmount() {
    if (this.loopRunner) {
      this.loopRunner.stop();
    }
    this.mPanel = null;
  },
  async mounted() {
    var _this = this;
    var f = async () => {
      console.debug("deffered start");
      _this.mFilter = _this.filter ? _this.filter : _this.$store.getters["settings/parsedFilter"](_this.filterKey);

      console.debug(_this.mFilter);
      if (_this.loopRunner) {
        _this.loopRunner.reset();
      }
      await _this.loadData();
    };
    this.deferredFilter = new DeferredFunction(f, 1000);
    // this.$store.getters["settings/panel"].refreshTime ? this.$store.getters["settings/panel"].refreshTime : 60000;
    let refreshTime = this.panelSettings.refreshTime;

    if (refreshTime > 0 && this.autoReload) {
      this.loopRunner = LoopRunner.init(this.loadData, refreshTime);
      this.loopRunner.start();
    } else {
      this.loadData();
    }
  },
  methods: {
    onTileUpdate(ev) {
      var idx = ev.index;
      if (this.mPanel._tiles && ev.tile.id == this.mPanel._tiles[idx].id) {
        // alert(ev.tile.id == this.mPanel._tiles[idx].id);
        //dont update inferred measurements
        let t = JSON.parse(JSON.stringify(ev.tile));
        t.measurements = this.mPanel._tiles[idx].measurements; //replace with original templates/queries
        for (var m of ev.tile.measurements) {
          if (m._inferred == false) {
            t.measurements.push(m);
          }
        }
        ev.tile = t;
        // console.error(ev);
        this.$emit("update:tile", ev);
      } else {
        console.error("panel tile order has changed: " + JSON.stringify(ev));
        console.debug(this.mPanel);
      }
      // this.$emit("update:tile", ev);
    },
    onTimeseriesUpdate(evt) {
      console.error("onTimeseriesUpdate TODO:");
      console.error(evt);
    },
    async mSetChartData(measurements, panelData, filter) {
      // console.error(measurements);
      panelData["timeseries"] = await this.$ren.dataApi.getMeasurementTimeseries(measurements, filter);

      return panelData;
    },
    async loadData() {
      if (this.panel.id != null && this.$refs.spinner) {
        // console.info("panel load data: " + this.panel.id);
        this.$refs.spinner.run(async () => {
          console.info("wait for panel data: " + this.panel.id + " " + this.panel.is_template);
          await this.$ren.dataApi.getPanelData(this.panel.id, this.assetId, this.mFilter).then(async (resp) => {
            console.debug(resp);
            var panelData = resp && resp.data ? resp.data : {};
            if (resp.panel != null) {
              // console.error(this.panel);
              resp.panel._tiles = this.panel.tiles;
              this.mPanel = resp.panel;
              // this.mPanel = this.panel.is_template || resp.panel != null ? resp.panel : this.panel;
            } else {
              this.mPanel = this.panel;
            }

            var chartDict = {};
            this.mPanel.tiles
              .filter((tile) => tile.type == TileTypes.chart)
              .forEach((tile) => tile.measurements.forEach((m) => (chartDict[m.id] = m)));
            // for (let tile of this.mPanel.tiles) {
            //   if (tile.type == TileTypes.chart) {
            //     for (let m of tile.measurements) {
            //       chartDict[m.id] = m;
            //     }
            //   }
            // }

            let chartMeasurements = Object.values(chartDict);
            //load chart data
            if (chartMeasurements.length > 0) panelData = await this.mSetChartData(chartMeasurements, panelData, this.filter);
            let getPrevData = false;
            //TODO: add possibility to add multiple/different time ranges in the one dashboard

            for (let tile of this.mPanel.tiles) {
              //check if any tiles requires previous data
              if (this.panelSettings.compare_interval_type == "none") {
                tile.props.compare_with_previous = false;
              } else if (tile.props.compare_with_previous) {
                //feature? different intervals per tile? TODO:
                let prevFilter = this.compareIntervalDateFilter(
                  this.mFilter,
                  this.panelSettings.compare_interval_type ? this.panelSettings.compare_interval_type : "previous",
                  //tODO: add compare_interval_number to the ui, currently its always null and cant be changed
                  this.panelSettings.compare_interval_number ? this.panelSettings.compare_interval_number : 1,
                );
                tile.props.compare_with_previous_filter_obj = prevFilter;
                getPrevData = true;
                // break;
              }
            }

            if (getPrevData && this.panelSettings.compare_interval_type != "none") {
              console.info("Load Previous data ");
              var prevFilter = this.compareIntervalDateFilter(
                this.mFilter,
                this.panelSettings.compare_interval_type ? this.panelSettings.compare_interval_type : "previous",
                //tODO: add compare_interval_number to the ui, currently its always null and cant be changed
                this.panelSettings.compare_interval_number ? this.panelSettings.compare_interval_number : 1,
              );
              await this.$ren.dataApi.getPanelData(this.panel.id, this.assetId, prevFilter).then(async (resp) => {
                panelData.previous = resp.data;
                // var panelData = resp.data;
              });

              chartDict = {};
              this.mPanel.tiles
                .filter((tile) => tile.type == TileTypes.chart && tile.props.compare_with_previous)
                .forEach((tile) => tile.measurements.forEach((m) => (chartDict[m.id] = m)));
              let chartMeasurements = Object.values(chartDict);
              if (chartMeasurements.length > 0) panelData.previous = await this.mSetChartData(chartMeasurements, panelData.previous, prevFilter);
            }

            this.panelData = panelData;
            // timeseriesData = await this.$ren.dataApi.getTimeseries(null, this.tile.id, this.assetId, this.filter);
            console.info("Panel data loaded");
            console.debug(panelData);
          });
        });
      }
    },
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
  },
};
</script>

<style lang="scss"></style>
