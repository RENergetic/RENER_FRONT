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
  emits: ["UpdateMenu"],
  data() {
    return { name: "", url: "", label: "" };
  },

  watch: {},
  created() {},
  mounted() {},
  methods: {
    async submit() {
      var dashboard = { name: this.name, label: this.label, url: this.url };
      await this.$ren.dashboardApi.add(dashboard).then((id) => {
        dashboard.id = id;
        this.$store.commit("view/dashboardsAdd", dashboard);
        this.$emit("UpdateMenu", null);
        this.$router.back();
      });
      //tODO: catch error
    },
  },
};
</script>

<style lang="scss"></style>
