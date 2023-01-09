<template>
  <!-- todo: readall button ? -->
  <Card class="notification-box ren-control-bg">
    <template #content>
      <div class="flex">
        <!-- <div class="flex align-items-center justify-content-center"></div> -->

        <div class="flex-grow-1 flex flex-column justify-content-center flex-wrap">
          <span v-if="$te('notifications.' + notification.message)">
            {{ $t("notifications." + notification.message) }}
          </span>
          <span v-else>
            {{ notification.message }}
          </span>
          <div v-if="notification.dashboard" class="flex flex-grow-1">
            <!-- {{ $t("view.go_to_dashboard") }} -->
            <i
              v-if="notification.dashboard"
              v-tooltip="$t('view.go_to_dashboard')"
              class="pi pi-arrow-circle-right"
              @click="$router.push(`/dashboard/view/${notification.dashboard.id}`)"
            />
          </div>
        </div>
        <div class="col-2 flex-none flex align-items-center justify-content-center notification-icon">
          <i v-if="notification.type == 'warning'" class="pi pi-exclamation-triangle"></i>
          <i v-if="notification.type == 'information'" class="pi pi-info-circle"></i>
          <i v-if="notification.type == 'error'" class="pi pi-times-circle"></i>
          <i v-if="notification.type == 'anomaly'" class="pi pi-times-circle"></i>
        </div>
      </div>
    </template>
  </Card>

  <!-- <div class="grid col-12">
    <div class="col-8 flex flex-column justify-content-center flex-wrap">
      <div class="flex align-content-end flex-wrap"></div>
      <div class="flex align-content-start flex-wrap">
        <div class="flex align-items-center justify-content-center">
          {{ notification.message }}
          <div v-if="notification.dashboard" class="flex flex-grow-1">
            {{ $t("view.go_to_dashboard") }}
            <i
              v-if="notification.dashboard"
              v-tooltip="$t('view.go_to_dashboard')"
              class="pi pi-arrow-circle-right"
              @click="$router.push(`/dashboard/view/${notification.dashboard.id}`)"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="col-2 flex-none flex align-items-center justify-content-center">
      <i v-if="notification.type == 'warning'" class="pi pi-exclamation-triangle"></i>
      <i v-if="notification.type == 'info'" class="pi pi-info-circle"></i>
      <i v-if="notification.type == 'error'" class="pi pi-times-circle"></i>
    </div>
  </div> -->
</template>
<script>
export default {
  name: "NotificationItem",
  components: {},
  props: {
    notification: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},

  methods: {},
};
</script>

<style lang="scss">
.notification-box {
  max-width: 90%;
  width: 90vw;
  margin-top: 0.5rem;
  .p-card-body {
    padding: 0.5rem !important;
    .p-card-content {
      padding: 0.5rem 0;
    }
  }
}

.notification-icon {
  font-size: 2.5rem;
}
</style>
