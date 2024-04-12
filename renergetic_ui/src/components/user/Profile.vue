<template>
  <RenSpinner ref="spinner" :lock="true" style="margin: auto; width: 100%">
    <!-- max-width: 80vw; -->
    <template #content>
      <UserForm v-if="user" v-model:edit="edit" :user="user" @save="onSave" />
      <Panel v-if="user" class="user-roles" toggleable collapsed>
        <template #header>
          <span v-if="user.roles"> {{ $t("model.user.roles") }}:</span>
          <span v-else> {{ $t("view.no_roles") }}</span>
        </template>

        <div class="col-12">
          <li v-for="role in user.roles" :key="role" class="field">{{ role }}</li>
        </div>
      </Panel>
      <Panel v-if="user" class="ren-settings" toggleable>
        <template #header>
          <span>{{ $t("view.locale_settings") }}:</span>
        </template>

        <LocaleSettings :submit="true"></LocaleSettings>
      </Panel>
      <Panel v-if="user" class="ren-settings" toggleable>
        <template #header>
          <span> {{ $t("view.home_settings") }}:</span>
        </template>
        <HomeSettings :submit="true"></HomeSettings>
      </Panel>
      <Panel v-if="user" toggleable class="ren-settings">
        <template #header>
          <span> {{ $t("view.conversion_settings") }}:</span>
        </template>

        <ConversionSettings :submit="true"></ConversionSettings>
      </Panel>

      <Panel v-if="user" toggleable class="ren-settings">
        <template #header>
          <span> {{ $t("view.panel_settings") }}:</span>
        </template>
        <PanelSettings :submit="true"></PanelSettings>
      </Panel>
      <Panel v-if="user" toggleable class="ren-settings">
        <template #header>
          <span> {{ $t("view.filter_settings") }}:</span>
        </template>
        <BasicFilterSettings :submit="true" />
      </Panel>

      <Panel v-if="user" toggleable class="ren-settings">
        <template #header>
          <span> {{ $t("view.public_dashboard_filter_settings") }}:</span>
        </template>
        <BasicFilterSettings :setting-key="'public'" :submit="true" />
      </Panel>
      <Panel v-if="user" toggleable class="ren-settings">
        <template #header>
          <span> {{ $t("view.private_dashboard_filter_settings") }}:</span>
        </template>
        <BasicFilterSettings :setting-key="'private'" :submit="true" />
      </Panel>
      <Panel v-if="user" toggleable collapsed>
        <template #header>
          <span> {{ $t("view.delete") }} </span>
        </template>

        <div class="col-12">
          <ren-input v-model="deleteText" :text-label="'view.type_delete'" />
          <ren-submit :disabled="deleteText != 'DELETE'" @submit="confirmDeleteUser" />
        </div>
      </Panel>
    </template>
  </RenSpinner>
  <!-- {{ $store.getters["auth/current"] }} -->
  <!-- {{ user }} -->
  <!-- {{ $store.getters["settings"] }} -->
</template>
<script>
import UserForm from "@/components/user/UserForm.vue";
import HomeSettings from "@/components/miscellaneous/settings/HomeSettings.vue";
import LocaleSettings from "@/components/miscellaneous/settings/LocaleSettings.vue";
import ConversionSettings from "@/components/miscellaneous/settings/ConversionSettings.vue";
import PanelSettings from "@/components/miscellaneous/settings/PanelSettings.vue";
import BasicFilterSettings from "@/components/miscellaneous/settings/BasicFilterSettings.vue";

export default {
  name: "Profile",
  components: { UserForm, ConversionSettings, HomeSettings, LocaleSettings, PanelSettings, BasicFilterSettings },
  data() {
    return {
      // data: this.$store.getters["auth/current"],
      user: null,
      deleteText: null,
      edit: false,
    };
  },
  watch: {},
  async mounted() {
    await this.$refs.spinner.run(async () => {
      this.user = await this.$ren.userApi.getProfile();
      // console.warn(this.user);
    });
  },
  methods: {
    async onSave(user) {
      await this.$refs.spinner.run(async () => {
        console.error(user);
        let success = await this.$ren.userApi.updateProfile(user);
        if (success) this.$emitter.emit("information", { message: this.$t("information.user_updated") });
        this.user = await this.$ren.userApi.getProfile();
      });
    },

    async deleteProfile() {
      await this.$refs.spinner.run(async () => {
        await this.$ren.userApi.deleteProfile();
        this.$keycloak.logout();
        this.$router.push("/");
      });
    },
    confirmDeleteUser() {
      this.$confirm.require({
        message: this.$t("view.delete_profile_message"),
        header: this.$t("view.delete_profile"),
        icon: "pi pi-exclamation-triangle",
        accept: () => this.deleteUser(),
        reject: () => this.$confirm.close(),
      });
    },
  },
};
</script>
<style lang="scss">
.p-panel-header {
  font-size: 1.5rem;
  font-weight: 700;
}
.p-card,
.p-panel-toggleable {
  margin-bottom: 1rem;
}
.p-card {
  padding: 1rem;
}
</style>
