<template>
  <Card style="margin: auto; margin-top: 0.5rem; max-width: 95vw">
    <template #title>{{ $t("menu.hdr_view") }}</template>
    <template #content>
      <div class="grid">
        <!-- :key="selectedRecommendation.id + (compareWith ? compareWith.id : '')" -->
        <div class="col-9">
          <HDRRecomendation
            v-if="selectedRecommendation"
            :key="reloadRecommendation"
            :hdr-request="hdrRequest"
            :recommendation="selectedRecommendation"
            :comparewith="compareWith"
          />
          <h2 v-else>{{ $t("view.select_recommendation") }}</h2>
        </div>
        <div class="col-3">
          <RenSpinner ref="spinner" :lock="true" style="width: 100%">
            <template #content>
              <HDRRecomendationList
                v-model="selectedRecommendation"
                v-model:comparewith="compareWith"
                v-model:hdr-request="hdrRequest"
                :recommendation-list="recommendationList"
              />
            </template>
          </RenSpinner>
        </div>
      </div>
    </template>
  </Card>
</template>
<script>
import HDRRecomendationList from "@/components/management/demand/HDRRecomendationList.vue";
import HDRRecomendation from "@/components/management/demand/HDRRecomendation.vue";

export default {
  name: "HDRView",
  components: {
    HDRRecomendationList,
    HDRRecomendation,
  },
  data() {
    return {
      hdrRequest: null,
      assetAdd: false,
      assetList: [],
      recommendationList: [],
      selectedRecommendation: null,
      compareWith: null,
      reloadRecommendation: false,
    };
  },
  watch: {
    // selectedRecommendation: {
    //   handler: async function (r) {
    //     if (r != null) {
    //       if (this.tagKey != r.tag.key) this.currentMeasurements = await this.$ren.managementApi.listTagMeasurements(r.tag.key, "no_tag");
    //     }
    //   },
    //   deep: true,
    // },
    hdrRequest: {
      handler: async function (r) {
        if (r != null) this.reloadRecommendation = !this.reloadRecommendation;
      },
      deep: true,
    },
  },

  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      await this.$refs.spinner.run(async () => {
        this.recommendationList = await this.$ren.hdrApi.getCurrentRecommendations();
      });
    },
  },
};
</script>

<style lang="scss"></style>
