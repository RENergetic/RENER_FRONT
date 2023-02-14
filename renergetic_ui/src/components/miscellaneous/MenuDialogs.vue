<template>
  <Dialog
    v-model:visible="mNotificationDialog"
    :style="{ width: '75vw' }"
    :maximizable="false"
    :modal="true"
    :dismissable-mask="true"
  >
    <NotificationList @update="onNotificationUpdate($event)"></NotificationList>
  </Dialog>
  <Dialog
    v-model:visible="mDemandDialog"
    :style="{ width: '75vw' }"
    :maximizable="false"
    :modal="true"
    :dismissable-mask="true"
  >
    <DemandList @update="onDemandUpdate($event)"></DemandList>
  </Dialog>

  <Dialog
    v-model:visible="mAddDashboard"
    :style="{ width: '50vw' }"
    :maximizable="true"
    :modal="true"
    :dismissable-mask="true"
  >
    <DashboardForm @save="onSave" @cancel="mAddDashboard = false"></DashboardForm>
  </Dialog>
  <Dialog
    v-model:visible="mLocales"
    :style="{ width: '50vw' }"
    :maximizable="true"
    :modal="true"
    :dismissable-mask="true"
  >
    <LocaleSettings></LocaleSettings>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import NotificationList from "../management/notification/NotificationList.vue";
import DemandList from "@/components/user/demand/DemandList.vue";
import DashboardForm from "../dashboard/grafana/DashboardForm.vue";
import LocaleSettings from "@/components/miscellaneous/settings/LocaleSettings.vue";

export default {
  name: "MenuDialogs",
  components: {
    Dialog,
    DemandList,
    NotificationList,
    DashboardForm,
    LocaleSettings,
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
    locales: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    "update:dashboard",
    "update:notificationDialog",
    "update:demandDialog",
    "UpdateMenu",
    "update:locales",
    "update:notifications",
    // "update:demands",
  ],
  data() {
    return {
      mNotificationDialog: this.notificationDialog,
      mDemandDialog: this.demandDialog,
      mAddDashboard: this.addDashboard,
      mLocales: this.locales,
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
    mLocales: {
      handler(newVal, oldValue) {
        if (oldValue == null && newVal == null) {
          return;
        }
        this.$emit("update:locales", newVal);
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
  },
  async created() {
    this.onNotificationUpdate(await this.$ren.userApi.getNotifications());
  },
  methods: {
    async onSave(dashboard) {
      await this.$ren.dashboardApi.add(dashboard).then((dashboardReq) => {
        this.mAddDashboard = false;
        this.$store.commit("view/dashboardsAdd", dashboardReq);
        this.$emit("UpdateMenu", null);
      });
    },
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
