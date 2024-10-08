<template>
  <Card v-if="mModel" class="ren">
    <!-- <template #title> </template> -->
    <template #content>
      <div>
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
      <ren-submit :cancel-button="true" :disabled="v$.$invalid" @cancel="cancel" @submit="submit" />
      <label v-if="tagExists" class="state error" width="10rem">{{ $t("error.tag_exists") }}</label>
    </template>
  </Card>
</template>

<script>
//TODO: on owner select
import { useVuelidate } from "@vuelidate/core";
import { maxLength, required, minLength } from "@/plugins/validators.js"; //required,

export default {
  name: "TagForm",
  components: {},
  props: {
    modelValue: {
      type: Object,
      default: () => ({}),
    },
    tags: {
      type: Array,
      default: () => [],
    },
    edit: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "cancel", "submit"],
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return {
      mModel: this.modelValue ? this.modelValue : {},
      filteredTags: [],
      tagExists: false,
    };
  },
  validationConfig: {
    $lazy: true,
  },
  computed: {},
  watch: {
    mModel: {
      handler: function (/*newVal*/) {
        if (this.tagExists) {
          this.tagExists = false;
        }
      },
      deep: true,
    },
  },
  validations() {
    return {
      mModel: {
        key: { maxLength: maxLength(30), required: required, minLength: minLength(2) },
        value: { maxLength: maxLength(30), required: required, minLength: minLength(2) },
      },
    };
  },
  methods: {
    filterTag(evt) {
      this.filteredTags = [];
      let q = evt && evt.query ? evt.query : "";
      if (q && q.length > 1) this.filteredTags = this.tags.filter((it) => it.includes(q));
      else {
        this.filteredTags = [...this.tags];
      }
    },
    onTagKeySelect() {
      // this.$emit("update:modelValue", this.mModel);
    },
    async submit() {
      if (!this.edit) {
        let tag = await this.$ren.managementApi.getTag(this.mModel.key, this.mModel.value);
        if (tag) {
          this.tagExists = true;
        }
      }
      if (!this.tagExists) {
        this.$emit("update:modelValue", this.mModel);
        this.$emit("submit", this.mModel);
      }
    },
    cancel() {
      this.$emit("cancel", this.model);
    },
  },
};
</script>

<style scoped lang="scss"></style>
