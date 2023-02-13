<template>
  <div v-if="demands" style="height: 100%" class="flex flex-column align-items-start align-content-start">
    <h3 v-if="title">{{ $t("view.demand_list") }}:</h3>
    <template v-for="d in demands" :key="d">
      <UserDemand :demand="d" :pdata="pdata"></UserDemand>
    </template>
  </div>
  <div v-else>
    <h4 v-if="title">{{ $t("view.no_demand_list") }}</h4>
  </div>
</template>
<script>
import UserDemand from "./UserDemand.vue";
export default {
  name: "DemandList",
  components: { UserDemand },
  props: {
    userId: {
      type: Number,
      default: null,
    },
    title: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return { demands: [], pdata: {} };
  },
  computed: {},
  watch: {},
  async mounted() {
    let demands = this.$store.getters["view/demands"];
    if (demands) {
      this.demands = demands;
    } else {
      this.demands = await this.$ren.userApi.getDemand();
    }
    let pdata = this.$store.getters["view/data"];
    if (pdata) {
      this.pdata = pdata;
    } else {
      this.pdata = await this.$ren.dataApi.getDemandData(this.demands);
    }
  },

  methods: {},
};
</script>

<style lang="scss">
// .heatdemand {
//   padding: 0.5rem;
//   i {
//     font-size: 2rem;
//     margin-left: 0.75rem;
//   }
//   .description {
//     font-size: 1rem;
//     font-style: italic;
//   }
//   .message {
//     font-size: 1.5rem;
//     font-weight: 600;
//   }
// }
// #demandicon {
//   width: 5rem;
//   height: 5rem;
//   // display: inherit;
//   background-size: contain;
//   background-repeat: no-repeat;
//   background-position: center;
//   margin-right: 1rem;
// }
h3,
h4 {
  width: 100%;
  color: white;
  margin-bottom: 0.25rem;
  margin-top: 1.5rem;
}
</style>
