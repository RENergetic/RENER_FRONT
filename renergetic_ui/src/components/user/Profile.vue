<template>
  <RenSpinner ref="spinner" :lock="true" style="margin: auto; width: 100%">
    <!-- max-width: 80vw; -->
    <template #content>
      <UserForm v-if="user" v-model:edit="edit" :user="user" />
      <Card v-if="user" class="user-roles">
        <template #title>
          <span v-if="user.roles"> {{ $t("model.user.roles") }}:</span>
          <span v-else> {{ $t("view.no_roles") }}</span>
        </template>
        <template #content>
          <div class="col-12">
            <li v-for="role in user.roles" :key="role" class="field">{{ role }}</li>
          </div>
        </template>
      </Card>
      <Card v-if="user" class="ren-settings">
        <template #title>
          <span> {{ $t("view.locale_settings") }}:</span>
        </template>
        <template #content>
          <LocaleSettings :submit="true"></LocaleSettings>
        </template>
      </Card>
      <Card v-if="user" class="ren-settings">
        <template #title>
          <span> {{ $t("view.home_settings") }}:</span>
        </template>
        <template #content>
          <HomeSettings :submit="true"></HomeSettings>
        </template>
      </Card>
      <Card v-if="user" class="ren-settings">
        <template #title>
          <span> {{ $t("view.conversion_settings") }}:</span>
        </template>
        <template #content>
          <ConversionSettings :submit="true"></ConversionSettings>
        </template>
      </Card>

      <Card v-if="user" class="ren-settings">
        <template #title>
          <span> {{ $t("view.panel_settings") }}:</span>
        </template>
        <template #content>
          <PanelSettings :submit="true"></PanelSettings>
        </template>
      </Card>
    </template>
  </RenSpinner>
  <!-- {{ user }} -->
  <!-- {{ $store.getters["settings"] }} -->
  <!-- <div>Auth data {{ data }}aa</div> -->
</template>
<script>
import UserForm from "@/components/user/UserForm.vue";
import HomeSettings from "@/components/miscellaneous/settings/HomeSettings.vue";
import LocaleSettings from "@/components/miscellaneous/settings/LocaleSettings.vue";
import ConversionSettings from "@/components/miscellaneous/settings/ConversionSettings.vue";
import PanelSettings from "@/components/miscellaneous/settings/PanelSettings.vue";

export default {
  name: "Profile",
  components: { UserForm, ConversionSettings, HomeSettings, LocaleSettings, PanelSettings },
  data() {
    return {
      data: this.$store.getters["auth/current"],
      user: undefined,
      edit: false,
    };
  },
  watch: {},
  async mounted() {
    await this.$refs.spinner.run(async () => {
      this.user = await this.$ren.userApi.getProfile();
    });
  },
  methods: {},
};
</script>
<style lang="scss">
.p-card {
  margin-bottom: 1rem;
  padding: 1rem;
}
</style>
