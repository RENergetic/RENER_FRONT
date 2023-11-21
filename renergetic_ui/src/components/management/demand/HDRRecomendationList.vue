<template>
  <Panel :header="$t('view.current_request')" toggleable> todo: </Panel>
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
</template>
<script>
export default {
  name: "HDRRecomendationList",
  components: {},
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
  },
};
</script>

<style lang="scss"></style>
