<template>
  <!-- todo: readall button  ren-control-bg? -->
  <Card class="notification-box">
    <template #content>
      <div class="flex">
        <!-- <div class="flex align-items-center justify-content-center"></div> -->
        <!-- {{ notification }}  -->
        <!-- {{ notification.measurement }} -->
        <!-- {{ messageParams }} -->
        <div class="flex-grow-1 flex flex-column justify-content-center flex-wrap">
          <span v-if="$te('notifications.' + notification.message, 'en')">
            {{ $t("notifications." + notification.message, messageParams) }}
          </span>
          <span v-else>
            {{ notification.message }}
          </span>
          <div v-if="notification.dashboard" class="flex flex-grow-1">
            <i
              v-if="notification.dashboard"
              v-tooltip="$t('view.go_to_dashboard')"
              class="pi pi-arrow-circle-right"
              @click="navigate(notification.dashboard.url)"
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

  computed: {
    messageParams: function () {
      let unit = this.notification.measurement ? this.notification.measurement.type.unit : "";
      return {
        asset_name: this.notification.asset ? this.notification.asset.name : "No asset",
        timestamp: this.notification.timestamp ? this.$ren.utils.parseUnixTimestamp(this.notification.timestamp) : "No timestamp",
        value: this.notification.value ? `${this.$ren.utils.roundValue(this.notification.value)} ${unit}` : "No value",
      };
    },
  },
  watch: {},
  methods: {
    navigate(url) {
      window.open(url, "_blank");
    },
  },
};
</script>

<style lang="scss">
.notification-box {
  // max-width: 90%;
  padding-right: 1.5rem;
  width: 100%;
  margin-top: 0.5rem;
  i {
    font-size: 1.5rem;
    margin-left: 0.75rem;
  }

  .notification-icon {
    i {
      font-size: 2.5rem;
    }
  }
  .p-card-body {
    padding: 0.5rem !important;
    .p-card-content {
      padding: 0.5rem 0;
    }
  }
}
</style>
