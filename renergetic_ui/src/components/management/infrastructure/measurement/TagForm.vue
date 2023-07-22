<template>
  <InfoIcon :show-icon="false">
    <template #content>
      <!-- some info -->
    </template>
  </InfoIcon>
  <!-- {{ mModel }} -->
  <Card v-if="mModel">
    <!-- <template #title> </template> -->
    <template #content>
      <div class="ren">
        <ren-input-wrapper :text-label="'model.tag.key'" :invalid="v$.mModel.key.$invalid" :errors="v$.mModel.key.$silentErrors">
          <template #content>
            <AutoComplete v-model="mModel.key" dropdown dropdown-mode="current" :suggestions="filteredTags" @complete="filterTag" />
            <!-- {{ filteredTags }} -->
          </template>
        </ren-input-wrapper>
        <!-- <ren-input v-model="mModel.key" :text-label="'model.tag.name'" :invalid="v$.mModel.key.$invalid" :errors="v$.mModel.key.$silentErrors" /> -->
        <ren-input
          v-model="mModel.value"
          :text-label="'model.tag.value'"
          :invalid="v$.mModel.value.$invalid"
          :errors="v$.mModel.value.$silentErrors"
        />
      </div>
    </template>
  </Card>

  <ren-submit :cancel-button="true" :disabled="v$.$invalid" @cancel="cancel" @submit="submit" />
</template>

<script>
//TODO: on owner select
import { useVuelidate } from "@vuelidate/core";
import { maxLength, required, minLength } from "@/plugins/validators.js"; //required,

import InfoIcon from "@/components/miscellaneous/InfoIcon.vue";
export default {
  name: "TagForm",
  components: { InfoIcon },
  props: {
    modelValue: {
      type: Object,
      default: () => ({ measurements: [] }),
    },
    tags: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["update:modelValue", "cancel"],
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return {
      mModel: this.modelValue ? this.modelValue : { measurements: [] },
      filteredTags: [],
      // assetTypes: this.$store.getters["view/assetTypes"],
      // assetTypes: [
      //   { value: "room", label: this.$t("model.asset.asset_types.room") },
      //   { value: "pv", label: this.$t("model.asset.asset_types.pv") },
      // ],
    };
  },
  validationConfig: {
    $lazy: true,
  },
  validations() {
    return {
      mModel: {
        key: { maxLength: maxLength(30), required: required, minLength: minLength(3) },
        value: { maxLength: maxLength(30), required: required, minLength: minLength(2) },
      },
    };
  },
  computed: {},
  methods: {
    filterTag(evt) {
      this.filteredTags = [];
      let q = evt && evt.query ? evt.query : "";
      if (q && q.length > 1) this.filteredTags = this.tags.filter((it) => it.includes(q));
      else {
        this.filteredTags = [...this.tags];
      }
    },
    submit() {
      this.$emit("update:modelValue", this.mModel);
    },
    cancel() {
      this.$emit("cancel", this.model);
    },
  },
};
</script>

<style scoped lang="scss"></style>
