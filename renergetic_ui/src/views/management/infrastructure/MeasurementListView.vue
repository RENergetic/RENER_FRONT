<template>
  <Card class="ren-page-content">
    <template #title>
      {{ $t("menu.manage_measurements") }}
      <span style="float: right"> <Button :label="$t('view.button.manage_tags')" icon="pi pi-list" @click="tagListDialog = true" /></span>
    </template>
    <template #content>
      <RenSpinner ref="spinner" :lock="true" style="min-width: 100%">
        <template #content>
          <measurement-list v-model:filters="filters" :measurement-list="measurementList" @reload="loadMeasurements" />
        </template>
      </RenSpinner>
    </template>
  </Card>
  <Dialog v-model:visible="tagListDialog" :style="{ width: '75vw', height: '90vh' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <!-- {{ availableTags }}
    {{ availableTagsValues }} -->
    <TagManagement />
  </Dialog>
</template>
<script>
import MeasurementList from "@/components/management/infrastructure/measurement/MeasurementList.vue";
import TagManagement from "@/components/management/infrastructure/measurement/TagManagement.vue";
export default {
  name: "MeasurementListView",
  components: {
    MeasurementList,
    TagManagement,
  },
  data() {
    return { tagListDialog: false, filters: null, measurementList: [] };
  },

  watch: {
    filters: {
      handler: function () {
        this.loadMeasurements();
      },
      deep: true,
    },
  },
  mounted() {
    this.loadMeasurements();
  },
  methods: {
    async loadMeasurements(evt) {
      let offset = 0;
      let limit = 25;
      if (evt) {
        offset = evt.offset;
        limit = evt.limit;
      }
      let params = {};
      //  { "global": { "value": null },
      if (this.filters)
        params = {
          name: this.filters.name.value,
          type_id: this.filters["type.id"].value,
          type_physical_name: this.filters["type.physical_name"].value,
          asset_name: this.filters["asset.name"].value,
          domain: this.filters.domain.value,
          direction: this.filters.direction.value,
          sensor_name: this.filters.sensor_name.value,
          tag_key: this.filters.tag_key.value,
        };
      await this.$refs.spinner.run(async () => {
        await this.$ren.managementApi.listMeasurement({ params: params, offset: offset, limit: limit }).then((data) => {
          for (let m of data) {
            this.$ren.utils.setMeasurementLabel(m);
          }
          this.measurementList = data;
        });
      });
    },
  },
};
</script>

<style lang="scss"></style>
