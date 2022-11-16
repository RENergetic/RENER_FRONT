<template>
  <Dialog
    v-model:visible="mNotifications"
    :style="{ width: '75vw' }"
    :maximizable="false"
    :modal="true"
    :dismissable-mask="true"
  >
    <NotificationList></NotificationList>
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
import DashboardForm from "../dashboard/grafana/DashboardForm.vue";
import LocaleSettings from "@/components/miscellaneous/settings/LocaleSettings.vue";
export default {
  name: "Dialogs",
  components: {
    Dialog,
    NotificationList,
    DashboardForm,
    LocaleSettings,
  },
  props: {
    notifications: {
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
  emits: ["update:dashboard", "update:notifications", "UpdateMenu", "update:locales"],
  data() {
    return {
      mNotifications: this.notifications,
      mAddDashboard: this.addDashboard,
      mLocales: this.locales,
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
    //notifications
    mLocales: {
      handler(newVal, oldValue) {
        if (oldValue == null && newVal == null) {
          return;
        }
        this.$emit("update:locales", newVal);
      },
      // immediate: true,
    },
    mNotifications: {
      handler(newVal, oldValue) {
        if (oldValue == null && newVal == null) {
          return;
        }
        this.$emit("update:notifications", newVal);
      },
      // immediate: true,
    },
    notifications: {
      handler(newVal) {
        this.mNotifications = newVal;
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
  methods: {
    async onSave(dashboard) {
      await this.$ren.dashboardApi.add(dashboard).then((dashboardReq) => {
        this.mAddDashboard = false;
        this.$store.commit("view/dashboardsAdd", dashboardReq);
        this.$emit("UpdateMenu", null);
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
