<template>
  <div v-if="mNotifications && mNotifications.length > 0" style="height: 100%" class="flex flex-column align-items-center align-content-start">
    <h3 v-if="title">
      {{ $t("view.notification_list") }}
      (<span @click="$router.push({ name: 'NotificationList', path: '/management/notification' })">
        {{ $t("view.notification_history") }} <i v-tooltip="$t('view.go_to_notification_history')" class="pi pi-arrow-circle-right" /> </span
      >):
    </h3>
    <template v-for="n in mNotifications" :key="n.id">
      <NotificationItem :notification="n"></NotificationItem>
    </template>
  </div>
  <div v-else>
    <h3 v-if="title">
      {{ $t("view.no_notification_list") }}
      (<span @click="$router.push({ name: 'NotificationList', path: '/management/notification' })">
        {{ $t("view.notification_history") }} <i v-tooltip="$t('view.go_to_notification_history')" class="pi pi-arrow-circle-right" /> </span
      >):
    </h3>
  </div>
</template>
<script>
import NotificationItem from "@/components/management/notification/NotificationItem.vue";
// import { NotificationContext } from "@/plugins/model/Enums.js";
import { RenRoles } from "@/plugins/model/Enums";
export default {
  name: "UserNotificationList",
  components: { NotificationItem },
  props: {
    notifications: {
      type: Array,
      default: () => null,
    },
    title: {
      type: Boolean,
      default: true,
    },
    // objectId: { type: Number, default: null },
    // context: { type: String, default: NotificationContext.USER },
    // dateInterval: {
    //   type: Object,
    //   default: null,
    // },
  },
  emits: ["update"],
  data() {
    return {
      mNotifications: [],
    };
  },
  computed: {},
  watch: {
    notifications: function (newValue) {
      this.mNotifications = newValue;
    },
  },
  async mounted() {
    await this.loadNotifications();
  },

  methods: {
    async loadNotifications() {
      if (this.notifications != null) {
        this.mNotifications = this.notifications;
        return;
      }
      if (
        (RenRoles.REN_ADMIN | RenRoles.REN_USER | RenRoles.REN_MANAGER | RenRoles.REN_TECHNICAL_MANAGER | RenRoles.REN_STAFF) &
        this.$store.getters["auth/renRole"]
      ) {
        this.mNotifications = await this.$ren.userApi.getNotifications();
        this.$emit("update", this.mNotifications);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
h3,
h4 {
  width: 100%;
  color: white;
  margin-bottom: 0.25rem;
  margin-top: 1.5rem;
}
</style>
