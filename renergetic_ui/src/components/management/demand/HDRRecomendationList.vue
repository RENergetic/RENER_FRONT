<template>
  <Panel :header="$t('view.current_request')" toggleable>
    todo:
    <Button :label="$t('view.button.set_hdr')" @click="hdrRequestDialog = true" />
  </Panel>
  <Panel :header="$t('view.select_base_recommendation')" toggleable>
    <Dropdown
      v-model="selectedCompareWith"
      style="width: 100%"
      show-clear
      :options="recommendationList"
      option-label="tag.value"
      :placeholder="$t('view.base_recommendation')"
    />
  </Panel>
  <Panel :header="$t('view.recommendation_list')" toggleable>
    <Listbox v-if="recommendationList" v-model="selectedRecommendation" :options="recommendationList" style="width: 100%">
      <template #option="slotProps">
        <div class="flex align-items-center">
          <i class="pi pi-chevron-right" style="font-size: 1rem" /> {{ slotProps.option.tag.value }}({{ slotProps.option.id }})
        </div>
      </template>
    </Listbox>
  </Panel>
  <Dialog v-model:visible="hdrRequestDialog" :style="{ width: '50vw' }" :maximizable="false" :modal="true" :dismissable-mask="true">
    <HDRRequestForm @update="onHDR" @cancel="hdrRequestDialog = false" />
  </Dialog>
</template>
<script>
import HDRRequestForm from "@/components/management/demand/HDRRequestForm.vue";
export default {
  name: "HDRRecomendationList",
  components: { HDRRequestForm },
  props: {
    modelValue: {
      type: Object,
      default: null,
    },
    comparewith: {
      type: Object,
      default: null,
    },

    recommendationList: { type: Array, default: () => [] },
  },
  emits: ["update:modelValue", "select", "update:comparewith"], //"reload",
  data() {
    return {
      hdrRequestDialog: false,
      selectedRecommendation: this.modelValue,
      selectedCompareWith: this.comparewith ? this.comparewith : this.recommendationList ? this.recommendationList[0] : null,
    };
  },
  watch: {
    selectedRecommendation: function (value) {
      this.onSelect(value);
    },
    selectedCompareWith: function (value) {
      this.$emit("update:comparewith", value);
    },
  },
  methods: {
    // reload() {
    //   this.$emit("reload");
    // },
    onSelect(v) {
      this.$emit("select", v);
      this.$emit("update:modelValue", v);
    },
    onHDR(hdr) {
      //todo:
      console.error(hdr);
    },
  },
};
</script>

<style lang="scss"></style>
