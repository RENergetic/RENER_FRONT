<template>
  <!-- todo: readall button ? -->
  <Card class="notification-box ren-control-bg">
    <template #content>
      <div class="flex">
        <div class="flex align-items-center justify-content-center"></div>

        <div class="flex-grow-1 flex flex-column justify-content-center flex-wrap">
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
        <!-- <div class="flex-none flex align-items-center justify-content-center">
          <i v-if="demandIncrease" class="pi pi-arrow-up-right"></i>
          <i v-else-if="demandDecrease" class="pi pi-arrow-down-right"></i> 
        </div> -->
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
  <!-- TODO: set empty icon ??? <i v-else class="pi pi-arrow-down-right"></i> -->
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
    return {
      icons: {
        battery: require(`@/assets/img/tileicons/battery.png`),
        electricity: require(`@/assets/img/tileicons/electricity.png`),
        heat: require(`@/assets/img/tileicons/heat.png`),
      },
    };
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
}
.heatdemand {
  i {
    font-size: 2rem;
    margin-left: 0.75rem;
  }
  .description {
    font-size: 1rem;
    font-style: italic;
  }
  .message {
    font-size: 1.5rem;
    font-weight: 600;
  }
}
#demandicon {
  width: 5rem;
  height: 5rem;
  // display: inherit;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-right: 1rem;
}
</style>
