<template>
  <div class="card">
    <!--name-->
    <div class="p-field p-grid">
      <label for="dasboardName" class="p-col-fixed">
        {{ $t("dashboard.name") }}
      </label>
      <div class="p-col">
        <InputText id="dasboardName" v-model="name" />
      </div>
    </div>
    <!--url-->
    <div class="p-field p-grid">
      <label for="dasboardUrl" class="p-col-fixed">
        {{ $t("dashboard.url") }}
      </label>
      <div class="p-col">
        <InputText id="dasboardUrl" v-model="url" />
      </div>
    </div>
    <div class="p-field p-grid">
      <label for="dasboardLabel" class="p-col-fixed">
        {{ $t("dashboard.label") }}
      </label>
      <div class="p-col">
        <InputText id="dasboardLabel" v-model="label" />
      </div>
    </div>

    <div class="p-field p-grid">
      <div class="p-col">
        <!-- <Button label="Submit" /> -->
      </div>
      <div class="p-col">
        <Button :label="$t('view.button.submit')" @click="submit" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Dashboard",
  components: {},
  data() {
    return { name: "", url: "", label: "" };
  },

  watch: {},
  created() {},
  mounted() {},
  methods: {
    async submit() {
      var dashoard = { name: this.name, label: this.label, url: this.url };
      this.$ren.dashboardApi.add(dashoard).then((id) => {
        dashoard.id = id;
        this.$store.commit("view/dashboardsAdd", dashoard);
        //todo: emit event
      });
    },
  },
};
</script>

<style lang="scss"></style>
