<template>
  <!-- todo: readall button  ren-control-bg? -->
  <Card class="notification-box">
    <template #content>
      <div class="flex">
        <!-- <div class="flex align-items-center justify-content-center"></div> -->
        <!-- {{ notification }}  -->
        <!-- {{ notification.measurement }} -->

        <div class="flex-grow-1 flex flex-column justify-content-center flex-wrap">
          <span v-if="$te('notifications.' + notification.message, 'en')">
            {{ $t("notifications." + notification.message, messageParams) }} {{ updateTime }}
          </span>
          <span v-else>
            {{ notification.message }}
          </span>
          <div class="flex flex-grow-1">
            <div class="ntoification-timestamp">{{ updateTime }}</div>
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
    console.error(this.notification);
    return {};
  },

  computed: {
    updateTime: function () {
      return this.$ren.utils.parseUnixTimestamp(this.notification.notification_timestamp);
    },

    messageParams: function () {
      let unit = this.notification.measurement && this.notification.measurement.type.unit != "any" ? this.notification.measurement.type.unit : "";

      return {
        measurement_label: this.notification.measurement
          ? this.notification.measurement.label
            ? this.notification.measurement.label
            : this.notification.measurement.name
          : "No measurement",
        asset_name: this.notification.asset ? this.notification.asset.name : "No asset",
        timestamp: this.notification.notification_timestamp
          ? this.$ren.utils.parseUnixTimestamp(this.notification.notification_timestamp)
          : "No timestamp",
        value: this.notification.value ? `${this.$ren.utils.roundValue(this.notification.value)} ${unit}` : "No value",
        date_from: this.notification.date_from ? this.$ren.utils.parseUnixTimestamp(this.notification.date_from) : " *** ",
        date_to: this.notification.date_to ? this.$ren.utils.parseUnixTimestamp(this.notification.date_to) : " *** ",
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
  .notification-timestamp {
    font-size: 0.8rem;
  }
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
