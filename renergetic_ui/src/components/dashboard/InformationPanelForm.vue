<template>
  <InfoIcon :show-icon="false">
    <template #content>
      <!-- some info -->
    </template>
  </InfoIcon>
  <div class="field grid">
    <label for="panelLabel" class="col-fixed" style="width: 5rem">
      {{ $t("model.panel.label") }}
    </label>
    <div class="col">
      <InputText id="panelLabel" v-model="mModel.label" :aria-readonly="!edit" />
    </div>
  </div>
  <div class="field grid">
    <label for="panelName" class="col-fixed" style="width: 5rem">
      {{ $t("model.panel.name") }}
    </label>
    <div class="col">
      <InputText id="panelName" v-model="mModel.name" :aria-readonly="!edit" />
    </div>
  </div>
  <div class="field grid">
    <div class="col">
      <Button :label="$t('view.button.submit')" @click="submit" />
    </div>
    <div class="col">
      <Button :label="$t('view.button.cancel')" @click="cancel" />
    </div>
  </div>

  <!-- change -->
</template>

<script>
export default {
  name: "InformationPanelForm",
  components: {},
  props: {
    edit: { type: Boolean, default: true },
    model: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["update:modelValue", "cancel", "save"],
  data() {
    return {
      mModel: this.model,
    };
  },
  computed: {
    parentLabel: function () {
      return this.mModel != null && this.mModel.parent != null ? this.mModel.parent.label : null;
    },
  },
  watch: {},
  methods: {
    submit() {
      this.mModel.tiles = [];
      this.$emit("update:modelValue", this.mModel);
      this.$emit("save", this.mModel);
    },
    cancel() {
      this.$emit("cancel", this.model);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
