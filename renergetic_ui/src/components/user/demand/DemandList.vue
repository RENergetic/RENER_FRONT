<template>
  <template v-for="d in demands" :key="d">
    <HeatDemand v-if="d != null && d.type == 'heat'" :demand="d"></HeatDemand>
  </template>
</template>
<script>
import HeatDemand from "./HeatDemand.vue";
export default {
  name: "DemandList",
  components: { HeatDemand },
  props: {},
  data() {
    return { demands: [] };
  },
  computed: {},
  watch: {},
  async mounted() {
    //TODO: userId
    let userID = 0;
    this.demands = await this.$ren.userApi.getDemad(userID);
  },

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
  .message {
    font-size: 1.5rem;
    font-weight: 600;
  }
}
#demandicon {
  width: 5rem;
  height: 5rem;
  // display: inherit;
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  margin-right: 1rem;
}
</style>
