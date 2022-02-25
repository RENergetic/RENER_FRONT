<template>
  <div class="flex heatdemand">
    <div class="flex-none flex align-items-center justify-content-center">
      <span
        v-if="demand.icon != null"
        id="tileicon"
        :style="'background-image: url(' + icons[demand.icon] + ')'"
      ></span>
    </div>

    <div class="flex-none flex align-items-center justify-content-start flex-wrap">
      <div class="flex col-12" style="height: 2rem">
        <h3>{{ demand.msg }}</h3>
      </div>
      <div class="flex col-12 description">{{ demand.description }}</div>
    </div>
    <div class="flex-none flex align-items-center justify-content-center">
      <i v-if="demand.up" class="pi pi-arrow-up-right"></i>
      <i v-else class="pi pi-arrow-down-right"></i>
    </div>
  </div>
</template>
<script>
export default {
  name: "HeatDemand",
  components: {},
  props: {
    demand: {
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

  methods: {},
};
</script>

<style lang="scss">
.heatdemand {
  i {
    font-size: 2rem;
    margin-left: 0.75rem;
  }
  .description {
    font-size: 1rem;
    font-style: italic;
  }
}

#tileicon {
  width: 5rem;
  height: 5rem;
  // display: inherit;
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  margin-right: 1rem;
}
</style>
