<template>
  <div v-if="mNotifications" style="height: 100%" class="flex flex-column align-items-center align-content-start">
    <h3 v-if="title">{{ $t("view.notification_list") }}:</h3>
    <template v-for="n in mNotifications" :key="n.id">
      <NotificationItem :notification="n"></NotificationItem>
    </template>
  </div>
  <div v-else>
    <h4 v-if="title">{{ $t("view.no_notification_list") }}</h4>
  </div>
</template>
<script>
import NotificationItem from "./NotificationItem.vue";
// import { NotificationContext } from "@/plugins/model/Enums.js";
import { RenRoles } from "@/plugins/model/Enums";
export default {
  name: "NotificationList",
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

<style lang="scss">
h3,
h4 {
  width: 100%;
  color: white;
  margin-bottom: 0.25rem;
  margin-top: 1.5rem;
}
</style>
