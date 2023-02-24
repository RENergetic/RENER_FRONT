<template>
  <!-- {{ demands }} -->
  <div v-if="mDemands" style="height: 100%" class="flex flex-column align-items-start align-content-start">
    <h3 v-if="title">{{ $t("view.demand_list") }}:</h3>
    ff {{ mDemands }}aaa
    <template v-for="d in mDemands" :key="d">
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
    demands: {
      type: Array,
      default: () => null,
    },
    userId: {
      type: Number,
      default: null,
    },
    title: {
      type: Boolean,
      default: true,
    },
  },
  // emits: ["update"],
  data() {
    return { mDemands: [], pdata: {} };
  },
  computed: {},
  watch: {},
  async mounted() {
    if (this.demands) {
      this.mDemands = this.demands;
    } else {
      let demands = this.$store.getters["view/demands"];
      if (demands) this.mDemands = this.demands;
      else this.mDemands = await this.$ren.userApi.getDemand(); //TODO: check it
    }

    let pdata = this.$store.getters["view/data"];
    if (pdata) {
      this.pdata = pdata;
    } else {
      this.pdata = await this.$ren.dataApi.getDemandData(this.mDemands);
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
