<template>
  <!-- class="col-12"   max-width: 80vw -->
  <Card style="margin: auto; margin-top: 0.5rem">
    <template #content>
      <div class="grid">
        <!-- :key="selectedRecommendation.id + (compareWith ? compareWith.id : '')" -->
        <div class="col-8">
          <HDRRecomendation v-if="selectedRecommendation" :recommendation="selectedRecommendation" :comparewith="compareWith" />
          <h2 v-else>{{ $t("view.select_recommendation") }}</h2>
        </div>
        <div class="col-4">
          <RenSpinner ref="spinner" :lock="true">
            <template #content>
              <HDRRecomendationList v-model="selectedRecommendation" v-model:comparewith="compareWith" :recommendation-list="recommendationList" />
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
      assetAdd: false,
      assetList: [],
      recommendationList: [],
      selectedRecommendation: null,
      compareWith: null,
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
