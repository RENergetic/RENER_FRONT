<template>
  <Dialog v-model:visible="mNotificationDialog" :style="{ width: '75vw' }" :maximizable="false" :modal="true" :dismissable-mask="true">
    <NotificationList @update="onNotificationUpdate($event)"></NotificationList>
  </Dialog>
  <Dialog v-model:visible="mDemandDialog" :maximizable="false" :modal="true" :dismissable-mask="true">
    <div style="padding: 0 2rem">
      <DemandList style="width: 50rem; margin: auto" @update="onDemandUpdate($event)"></DemandList>
    </div>
  </Dialog>

  <Dialog v-model:visible="mAddDashboard" :style="{ width: '50vw' }" :modal="true" :dismissable-mask="true">
    <DashboardForm @save="onSave" @cancel="mAddDashboard = false"></DashboardForm>
  </Dialog>
  <!-- <Dialog v-model:visible="mAddUser" :style="{ width: '50vw' }" :modal="true" :dismissable-mask="true">
    <UserForm @save="onUserSave" @cancel="mAddUser = false" />
  </Dialog> -->
  <Dialog v-model:visible="mLocales" :style="{ width: '50vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <LocaleSettings></LocaleSettings>
  </Dialog>
  <Dialog v-model:visible="mVersionDialog" :style="{ width: '50vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <h3>{{ $t("view.app_version", [$ren.utils.version()]) }}</h3>
  </Dialog>
</template>

<script>
import NotificationList from "@/components/user/NotificationList.vue";
import DemandList from "@/components/user/demand/DemandList.vue";
import DashboardForm from "../dashboard/grafana/DashboardForm.vue";
import LocaleSettings from "@/components/miscellaneous/settings/LocaleSettings.vue";
import { RenRoles } from "@/plugins/model/Enums";
// import UserForm from "@/components/admin/UserForm.vue";
//TODO: add some spinner?

export default {
  name: "MenuDialogs",
  components: {
    DemandList,
    NotificationList,
    DashboardForm,
    LocaleSettings,
    // UserForm,
  },
  props: {
    notificationDialog: {
      type: Boolean,
      default: false,
    },
    demandDialog: {
      type: Boolean,
      default: false,
    },
    addDashboard: {
      type: Boolean,
      default: false,
    },
    addUser: {
      type: Boolean,
      default: false,
    },

    locales: {
      type: Boolean,
      default: false,
    },
    versionDialog: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    "update:dashboard",
    "update:notificationDialog",
    "update:demandDialog",
    "update:locales",
    "update:notifications",
    "update:user",
    "update:versionDialog",
    // "update:demands",
  ],
  data() {
    return {
      mNotificationDialog: this.notificationDialog,
      mDemandDialog: this.demandDialog,
      mAddDashboard: this.addDashboard,
      mLocales: this.locales,
      mVersionDialog: this.versionDialog,
      mAddUser: this.addUser,
      notifications: [],
    };
  },

  watch: {
    //dashboard
    mAddDashboard: {
      handler(newVal, oldValue) {
        if (oldValue == null && newVal == null) {
          return;
        }
        this.$emit("update:dashboard", newVal);
      },
      immediate: true,
    },

    addDashboard: {
      handler(newVal) {
        this.mAddDashboard = newVal;
      },
      immediate: true,
    },
    mAddUser: {
      handler(newVal, oldValue) {
        if (oldValue == null && newVal == null) {
          return;
        }
        this.$emit("update:user", newVal);
      },
      immediate: true,
    },
    addUser: {
      handler(newVal) {
        this.mAddUser = newVal;
      },
      immediate: true,
    },
    mLocales: {
      handler(newVal, oldValue) {
        if (oldValue == null && newVal == null) {
          return;
        }
        this.$emit("update:locales", newVal);
      },
      // immediate: true,
    },
    mVersionDialog: {
      handler(newVal, oldValue) {
        if (oldValue == null && newVal == null) {
          return;
        }
        this.$emit("update:versionDialog", newVal);
      },
      // immediate: true,
    },

    mNotificationDialog: {
      handler(newVal, oldValue) {
        if (oldValue == null && newVal == null) {
          return;
        }
        this.$emit("update:notificationDialog", newVal);
      },
      // immediate: true,
    },
    mDemandDialog: {
      handler(newVal, oldValue) {
        if (oldValue == null && newVal == null) {
          return;
        }
        this.$emit("update:demandDialog", newVal);
      },
      // immediate: true,
    },
    notificationDialog: {
      handler(newVal) {
        this.mNotificationDialog = newVal;
      },
      immediate: true,
    },
    demandDialog: {
      handler(newVal) {
        this.mDemandDialog = newVal;
      },
      immediate: true,
    },
    locales: {
      handler(newVal) {
        this.mLocales = newVal;
      },
      immediate: true,
    },
    versionDialog: {
      handler(newVal) {
        this.mVersionDialog = newVal;
      },
      immediate: true,
    },
  },
  async created() {
    if (
      (RenRoles.REN_ADMIN | RenRoles.REN_USER | RenRoles.REN_MANAGER | RenRoles.REN_TECHNICAL_MANAGER | RenRoles.REN_STAFF) &
      this.$store.getters["auth/renRole"]
    ) {
      let notifications = await this.$ren.userApi.getNotifications();
      this.onNotificationUpdate(notifications);
    }
  },
  methods: {
    async onSave(dashboard) {
      await this.$ren.dashboardApi.add(dashboard).then((dashboardReq) => {
        this.mAddDashboard = false;
        this.$store.commit("view/dashboardsAdd", dashboardReq);
        this.$emitter.$emit("update-menu");
      });
    },
    // async onUserSave(o) {
    //   await this.$ren.userApi.addUser(o).then((user) => {
    //     this.$emitter.emit("information", { message: this.$t("information.user_created", { user: user.username }) });
    //     this.mAddUser = false;
    //     // this.$emitter.$emit("update-menu")
    //   });
    // },
    onNotificationUpdate(notifications) {
      if (notifications) this.$emit("update:notifications", notifications);
      else this.$emit("update:notifications", []);
    },
    // onDemandUpdate(demands) {
    //   if (demands) this.$emit("update:demands", demands);
    //   else this.$emit("update:demands", []);
    // },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
