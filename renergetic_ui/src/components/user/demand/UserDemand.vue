<template>
  <!-- <Card class="demand-box ren-control-bg"> -->
  <!-- <div class="demand-box ren-control-bg"> -->
  <!-- <template #content> -->
  <div class="demand-box ren-control-bg flex">
    <div
      class="flex flex-none align-items-center justify-content-center"
      :style="'height:9.5rem;width:9.5rem;margin-right: 1rem;position: relative;'"
    >
      <!-- {{ demand }} -->
      <span
        v-if="demand.demand_definition.tile == null"
        id="demandicon"
        :style="'background-image: url(' + getIcon(action) + ');width:7.5rem;'"
      ></span>
      <!-- <span v-if="demand.demand_definition.tile != null" id="demandtile" @click="tileClick()"> -->
      <!-- {{ demand.tile }} -->
      <!-- {{ demand.demand_definition.tile }} -->
      <InformationTile
        v-if="demand.demand_definition.tile != null"
        :key="demand.demand_definition.tile.id"
        :demand="true"
        :tile="mTile"
        :pdata="pdata"
        :settings="settings"
        :tile-preview="false"
        @preview-tile="onPreview"
      />
    </div>

    <div class="flex-grow-1 flex flex-column justify-content-center flex-wrap">
      <div v-if="demand.asset != null" class="flex align-content-end flex-wrap">
        <div class="flex">{{ demand.asset.label }}</div>
      </div>
      <div class="flex align-content-end flex-wrap">
        <div class="message">{{ $t(`enums.demand_action.${action}`) }}</div>
      </div>
      <div class="flex align-content-start flex-wrap">
        <!-- <div class="flex align-items-center justify-content-center">{{ demand.demand_definition.message }}</div> -->
        <div class="flex">{{ demand.demand_definition.message }}</div>
      </div>
      <div class="flex align-content-start flex-wrap">
        <div class="flex">{{ timeText }}</div>
      </div>
    </div>
    <!-- <div class="flex-none flex align-items-center justify-content-center"> -->
    <div class="col-2 flex-none flex align-items-center justify-content-center notification-icon">
      <i v-if="demandIncrease" class="pi pi-arrow-up-right"></i>
      <i v-else-if="demandDecrease" class="pi pi-arrow-down-right"></i>
      <!-- TODO: set empty icon ??? <i v-else class="pi pi-arrow-down-right"></i> -->
    </div>
  </div>
  <!-- </template>
  </Card> -->
  <!-- </div> -->
  <TileMeasurementPreview ref="dataPreview" />
</template>
<script>
import InformationTile from "@/components/dashboard/informationpanel/informationtile/InformationTile.vue";
import TileMeasurementPreview from "@/components/dashboard/informationpanel/informationtile/TileMeasurementPreview.vue";

import { DemandActionType } from "@/plugins/model/Enums.js";
export default {
  name: "UserDemand",
  components: { InformationTile, TileMeasurementPreview },
  props: {
    demand: {
      type: Object,
      default: () => {},
    },
    pdata: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      icons: {
        battery: require(`../../../assets/img/tileicons/battery.png`),
        electricity: require(`../../../assets/img/tileicons/electricity.png`),
        heat: require(`../../../assets/img/tileicons/heat.png`),
        default: require(`../../../assets/img/tileicons/default.png`),
      },
      actionType: this.demand.demand_definition.action_type ? this.demand.demand_definition.action_type.toLowerCase() : null,
      action: this.demand.demand_definition.action.toLowerCase(),
    };
  },
  computed: {
    settings() {
      return { legend: false, title: false, center: false, cellWidth: null, asset_id: this.demand.asset ? this.demand.asset.id : null };
    },
    demandIncrease() {
      return this.actionType == DemandActionType.INCREASE;
    },
    demandDecrease() {
      return this.actionType == DemandActionType.DECREASE;
    },
    mTile() {
      let tile = this.demand.demand_definition.tile ? this.demand.demand_definition.tile : {};
      var l = this.demand.demand_definition.tile.layout;
      l = l ? { w: 1, h: 1, ...l } : { w: 1, h: 1 };
      tile.layout = l;
      return tile;
    },
    timeText() {
      var dateStart = new Date(this.demand.demand_start);
      var dateStop = new Date(this.demand.demand_stop);
      var current = new Date();
      if (dateStart > current) {
        return this.$t("view.demand_starts_in") + " " + this.transformWithUnit(current, dateStart);
      } else if (dateStop < current) {
        return this.$t("view.demand_expired") + " " + this.transformWithUnit(dateStop, current) + " " + this.$t("view.demand_expired_suffix");
      } else {
        return this.$t("view.demand_current") + " " + this.transformWithUnit(current, dateStop);
      }
    },
  },
  methods: {
    onPreview() {
      this.$refs.dataPreview.open(this.mTile);
    },
    tileclick() {
      if (this.demand.demand_definition.tile && this.demand.demand_definition.tile.panel) {
        this.$router.push(`/panel/view/${this.demand.demand_definition.tile.panel.id}`);
      }
    },
    getIcon(demandAction) {
      //todo: make global enum
      switch (demandAction) {
        case "increase_temperature":
          return this.icons.heat;
        default:
          return this.icons.default;
      }
    },
    transformWithUnit(dateRef, dateComp) {
      var diff = dateComp - dateRef;
      var days = Math.floor(diff / 86400000);
      if (days > 0) {
        return days + " " + (days > 1 ? this.$t("view.demand_days") : this.$t("view.demand_day"));
      }
      var hours = Math.floor((diff % 86400000) / 3600000);
      if (hours > 0) {
        return hours + " " + (hours > 1 ? this.$t("view.demand_hours") : this.$t("view.demand_hour"));
      }
      var minutes = Math.round(((diff % 86400000) % 3600000) / 60000);
      return minutes + " " + (minutes > 1 ? this.$t("view.demand_minutes") : this.$t("view.demand_minutes"));
    },
  },
};
</script>

<style lang="scss">
.demand-box {
  padding-right: 1.5rem;
  margin-top: 0.5rem;
  width: 100%;
  // border: solid;

  i {
    font-size: 2.5rem;
    margin-left: 0.75rem;
  }
  .description {
    font-size: 1rem;
    font-style: italic;
  }
  .message {
    font-size: 1.5rem;
    font-weight: 600;
  }
}
* .demand-box:first-child {
  margin: 0;
}
#demandicon {
  width: 5rem;
  height: 5rem;
  // display: inherit;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-right: 1rem;
}
</style>
