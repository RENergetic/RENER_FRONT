<template>
  <Card>
    <template #title>
      {{ $t("view.add_dashboard") }}
    </template>

    <template #content>
      <!--name-->
      <div style="width: 30rem">
        <div class="p-field p-grid">
          <label for="dasboardName" class="p-col-fixed">
            {{ $t("model.dashboard.name") }}
          </label>
          <div class="p-col">
            <InputText id="dasboardName" v-model="name" />
          </div>
        </div>
        <!--url-->
        <div class="p-field p-grid">
          <label for="dasboardUrl" class="p-col-fixed">
            {{ $t("model.dashboard.url") }}
          </label>
          <div class="p-col">
            <InputText id="dasboardUrl" v-model="url" />
          </div>
        </div>
        <div class="p-field p-grid">
          <label for="dasboardLabel" class="p-col-fixed">
            {{ $t("model.dashboard.label") }}
          </label>
          <div class="p-col">
            <InputText id="dasboardLabel" v-model="label" />
          </div>
        </div>

        <div class="p-field p-grid">
          <div class="p-col">
            <Button :label="$t('view.button.submit')" @click="submit" />
          </div>
          <div class="p-col">
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
  // props: {
  //   dashboard: {
  //     type: Object,
  //     default: () => null,
  //   },
  // },
  emits: ["UpdateMenu"],
  data() {
    return { name: "", url: "", label: "", editmode: false };
  },
  // watch: {
  //   dashboard: function (newval) {
  //     if (newval != null && newval.id != null) {
  //       // let id = this.$route.params.id; raise exception if both are set

  //       this.editmode = true;
  //       this.name = newval.name;
  //       this.url = newval.url;
  //       this.label = newval.label;
  //     } else {
  //       this.editmode = false;
  //       this.clear();
  //     }
  //   },
  // },
  mounted() {
    let id = this.$route.params.dashboard_id;
    if (id != null) {
      //load dashboard object from api
      /*
        this.name = dashboard.name;
        this.url = dashboard.url;
        this.label = dashboard.label;
      */
      this.editmode = true;
      alert("TODO:");
    }
  },
  methods: {
    clear() {
      this.name = "";
      this.url = "";
      this.label = "";
    },
    cancel() {
      alert("todo");
    },

    async submit() {
      if (!this.editmode) {
        var dashboard = { name: this.name, label: this.label, url: this.url };
        await this.$ren.dashboardApi.add(dashboard).then((id) => {
          dashboard.id = id;
          this.$store.commit("view/dashboardsAdd", dashboard);
          this.$emit("UpdateMenu", null);
          this.$router.back();
        });
        //tODO: catch error
      }
      if (this.editmode) {
        //TODO: update
      }
    },
  },
};
</script>

<style lang="scss"></style>
