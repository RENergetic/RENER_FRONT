<template>
  <Card class="demand-box ren-control-bg">
    <template #content>
      <div class="flex">
        <div class="flex align-items-center justify-content-center">
          <!-- {{ demand }} -->
          <span
            v-if="demand.demand_definition.tile == null"
            id="demandicon"
            :style="'background-image: url(' + getIcon(action) + ');width:7.5rem;'"
          ></span>
          <span v-if="demand.demand_definition.tile != null" id="demandtile" @click="tileClick()">
            <!-- {{ demand.tile }} -->
            <InformationTileData
              :key="demand.demand_definition.tile.id"
              :style="'height:7.5rem;width:7.5rem;margin-right: 1rem;'"
              :tile="demand.demand_definition.tile"
              :pdata="pdata"
              :settings="{ legend: false, title: false }"
            />
          </span>
        </div>

        <div class="flex-grow-1 flex flex-column justify-content-center flex-wrap">
          <div class="flex align-content-end flex-wrap">
            <div class="message">{{ $t(`enums.demand_action.${action}`) }}</div>
          </div>
          <div class="flex align-content-start flex-wrap">
            <div class="flex align-items-center justify-content-center">{{ demand.demand_definition.message }}</div>
          </div>
        </div>
        <div class="flex-none flex align-items-center justify-content-center">
          <i v-if="demandIncrease" class="pi pi-arrow-up-right"></i>
          <i v-else-if="demandDecrease" class="pi pi-arrow-down-right"></i>
          <!-- TODO: set empty icon ??? <i v-else class="pi pi-arrow-down-right"></i> -->
        </div>
      </div>
    </template>
  </Card>
</template>
<script>
import InformationTileData from "@/components/dashboard/informationpanel/informationtile/InformationTileData.vue";
import { DemandActionType } from "@/plugins/model/Enums.js";
export default {
  name: "UserDemand",
  components: { InformationTileData },
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
      actionType: this.demand.demand_definition.action_type
        ? this.demand.demand_definition.action_type.toLowerCase()
        : null,
      action: this.demand.demand_definition.action.toLowerCase(),
    };
  },
  computed: {
    demandIncrease() {
      return this.actionType == DemandActionType.INCREASE;
    },
    demandDecrease() {
      return this.actionType == DemandActionType.DECREASE;
    },
  },
  watch: {},

  methods: {
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
  },
};
</script>

<style lang="scss">
.demand-box {
  margin-top: 0.5rem;
  width: 100%;
  // border: solid;

  i {
    font-size: 2rem;
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
