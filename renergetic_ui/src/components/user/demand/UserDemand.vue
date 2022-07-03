<template>
  <div class="flex heatdemand">
    <div class="flex align-items-center justify-content-center">
      <!-- {{ demand }} -->
      <span
        v-if="demand.tile == null"
        id="demandicon"
        :style="'background-image: url(' + getIcon(demand.action) + ');width:7.5rem;'"
      ></span>
      <span v-if="demand.tile != null" id="demandtile" @click="$router.push(`/panel/view/${demand.tile.panelId}`)">
        <!-- {{ demand.tile }} -->
        <InformationTileData
          :key="demand.tile.id"
          :style="'height:7.5rem;width:7.5rem;margin-right: 1rem;'"
          :tile="demand.tile"
          :pdata="pdata"
          :settings="{ legend: false }"
        />
      </span>
    </div>

    <div class="flex-none flex flex-column justify-content-center flex-wrap">
      <div class="flex align-content-end flex-wrap">
        <div class="message">{{ $t(`enums.demand_action.${demand.action}`) }}</div>
      </div>
      <div class="flex align-content-start flex-wrap">
        <div class="flex align-items-center justify-content-center">{{ demand.message }}</div>
      </div>
    </div>
    <div class="flex-none flex align-items-center justify-content-center">
      <i v-if="demand.action_type == 'increase'" class="pi pi-arrow-up-right"></i>
      <i v-if="demand.action_type == 'decrease'" class="pi pi-arrow-down-right"></i>
      <!-- TODO: set empty icon ??? <i v-else class="pi pi-arrow-down-right"></i> -->
    </div>
  </div>
</template>
<script>
import InformationTileData from "@/components/dashboard/informationpanel/informationtile/InformationTileData.vue";

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
      },
    };
  },
  computed: {},
  watch: {},

  methods: {
    getIcon(demandAction) {
      //todo: make global enum
      switch (demandAction) {
        case "increase_temperature":
          return this.icons.heat;
        default:
          return this.icons.heat;
      }
    },
  },
};
</script>

<style lang="scss">
.heatdemand {
  margin: 0.5rem;
  width: 100%;
  border: solid;

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
