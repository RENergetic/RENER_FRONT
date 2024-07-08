<template>
  <!-- {{ demands }} -->
  <div class="flex flex-column align-items-start align-content-start">
    <div v-if="mDemands && mDemands.length > 0" class="demands-wrapper">
      <h3 v-if="title">{{ $t("view.demand_list") }}:</h3>

      <template v-for="d in mDemands" :key="d">
        <UserDemand :demand="d" :pdata="pdata"></UserDemand>
      </template>
    </div>
    <div v-else>
      <h4 v-if="title">{{ $t("view.no_demand_list") }}</h4>
    </div>
    <div v-if="demandsFuture && demandsFuture.length > 0" class="demands-wrapper">
      <h3 v-if="title">{{ $t("view.demand_list_future") }}:</h3>

      <template v-for="d in demandsFuture" :key="d">
        <UserDemand :demand="d" :pdata="pdata"></UserDemand>
      </template>
    </div>
    <div v-if="demandsPast && demandsPast.length > 0" class="demands-wrapper">
      <h3 v-if="title">{{ $t("view.demand_list_past") }}:</h3>

      <template v-for="d in demandsPast" :key="d">
        <UserDemand :demand="d" :pdata="pdata"></UserDemand>
      </template>
    </div>
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
  emits: ["update"],
  // emits: ["update"],
  data() {
    return { mDemands: [], pdata: {}, demandsPast: [], demandsFuture: [] };
  },
  computed: {},
  watch: {
    demands: function (newValue) {
      this.mDemands = newValue;
    },
  },
  async mounted() {
    await this.loadDemands();
  },

  methods: {
    async loadDemands() {
      if (this.demands) {
        this.mDemands = this.demands;
      } else {
        let demands = this.$store.getters["view/demands"];
        if (demands) {
          this.mDemands = demands;
        } else this.mDemands = await this.$ren.userApi.getDemand(); //TODO: check it
        this.demandsFuture = this.$store.getters["view/demandsFuture"];
        this.demandsPast = this.$store.getters["view/demandsPast"];
      }
      let pdata = this.$store.getters["view/data"];
      pdata = this.$ren.utils.convertDemandData(this.mDemands, pdata, this.$store.getters["settings/conversion"]);

      this.pdata = pdata;
      this.$emit("update", this.mDemands);
    },
  },
};
</script>

<style lang="scss">
.demands-wrapper {
  width: inherit;
}

h3,
h4 {
  width: 100%;
  // color: white;
  margin-bottom: 0.25rem;
  margin-top: 1.5rem;
}
</style>
