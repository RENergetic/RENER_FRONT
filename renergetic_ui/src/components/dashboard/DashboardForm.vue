<template>
  <Card>
    <template #title>
      {{ $t("view.add_dashboard") }}
    </template>

    <template #content>
      <!--name-->
      <div style="width: 30rem">
        <div class="field grid">
          <label for="dasboardName" class="col-fixed">
            {{ $t("model.dashboard.name") }}
          </label>
          <div class="col">
            <InputText id="dasboardName" v-model="mDashboard.name" />
          </div>
        </div>
        <!--url-->
        <div class="field grid">
          <label for="dasboardUrl" class="col-fixed">
            {{ $t("model.dashboard.url") }}
          </label>
          <div class="col">
            <InputText id="dasboardUrl" v-model="mDashboard.url" />
          </div>
        </div>
        <div class="field grid">
          <label for="dasboardLabel" class="col-fixed">
            {{ $t("model.dashboard.label") }}
          </label>
          <div class="col">
            <InputText id="dasboardLabel" v-model="mDashboard.label" />
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
      </div>
    </template>
  </Card>
</template>
<script>
//TODO: validate
import Card from "primevue/card";
export default {
  name: "DashboardAdd",
  components: { Card },
  props: {
    dashboard: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["update:modelValue", "save", "cancel"],
  data() {
    // this.$emit("update:modelValue", newVal);
    // this.$emit("save", newVal);
    return { mDashboard: this.dashboard };
  },
  watch: {
    mDashboard: {
      handler(newVal, oldValue) {
        if (oldValue == null && newVal == null) {
          return;
        }
        this.$emit("update:modelValue", newVal);
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {},
  methods: {
    clear() {
      this.mDashboard = {};
    },
    cancel() {
      this.$emit("cancel");
    },

    async submit() {
      this.$emit("save", this.mDashboard);
    },
  },
};
</script>

<style lang="scss"></style>
