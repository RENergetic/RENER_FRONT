<template>
  <InfoIcon :show-icon="false">
    <template #content>
      <!-- some info -->
    </template>
  </InfoIcon>

  <DataTable :value="assetList">
    <Column v-for="col of columns" :key="col" :field="col" :header="$t('model.asset.' + col)"></Column>
  </DataTable>
  <Button :label="$t('view.button.add')" @click="assetAdd = true" />
  <Dialog
    v-model:visible="assetAdd"
    :style="{ width: '75vw' }"
    :maximizable="true"
    :modal="true"
    :dismissable-mask="true"
  >
    <AssetForm @update:model-value="onCreate($event, 0)"></AssetForm>
  </Dialog>
</template>

<script>
import InfoIcon from "../../miscellaneous/InfoIcon.vue";
import AssetForm from "./AssetForm.vue";
export default {
  name: "AssetList",
  components: { InfoIcon, AssetForm },
  props: {},
  data() {
    return { assetAdd: false, assetList: [], columns: [] };
  },
  computed: {},
  watch: {},
  async created() {
    this.assetList = await this.$ren.infrastructureApi.assetList();
    if (this.assetList != null && this.assetList.length > 0) {
      this.columns = Object.keys(this.assetList[0]);
    }
  },
  methods: {
    onCreate(o, i) {
      alert(o);
      alert(i);
    },
    // async loadData() {
    //   await this.$ren.measurementApi.measurements(this.objects).then((data) => {
    //     this.data = data;
    //   });
    // },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
