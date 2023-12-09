<template>
  <!-- <h3 v-if="title">{{ $t("view.notification_list") }}:</h3> -->

  <!-- :filters="mFilters"
      :filter-display="hiddenFilters ? null : 'row'"
      responsive-layout="scroll"
      :global-filter-fields="['name', 'label', 'type.name', 'category.label']"
      selection-mode="single"
      :selection="selectedAsset"
      :meta-key-selection="false"
      @filter="onFilter"
      @row-unselect="$emit('onSelect', null)"
      @update:selection="onSelect" -->
  <DataTable v-if="notificationList" id="-notification-list" :value="notificationList" :lazy="true" data-key="id" class="sticky-header">
    <template #header>
      <NotificationFilter class="ren-card" style="height: 6rem; margin: 0" :submit-button="false" :columns="3" @update="$emit('reload')" />
    </template>
    <Column field="id" :header="$t('model.notification.id')"></Column>
    <Column field="type" :header="$t('model.notification.type')">
      <template #body="slotProps">
        <div class="col-2 flex-none flex align-items-center justify-content-center notification-icon">
          <i v-if="slotProps.data.type == 'warning'" class="pi pi-exclamation-triangle"></i>
          <i v-if="slotProps.data.type == 'information'" class="pi pi-info-circle"></i>
          <i v-if="slotProps.data.type == 'error'" class="pi pi-times-circle"></i>
          <i v-if="slotProps.data.type == 'anomaly'" class="pi pi-times-circle"></i>
        </div>
      </template>
    </Column>
    <Column field="message" :header="$t('model.notification.message')">
      <template #body="slotProps">
        <span v-if="$te('notifications.' + slotProps.data.message, 'en')">
          {{ $t("notifications." + slotProps.data.message, messageParams(slotProps.data)) }}
        </span>
        <span v-else> {{ slotProps.data.message }} </span>
      </template>
    </Column>
    <Column field="notification_code" :header="$t('model.notification.notification_code')"></Column>
    <Column field="notification_timestamp" :header="$t('model.notification.notification_timestamp')">
      <template #body="slotProps"> {{ new Date(slotProps.data.notification_timestamp).toLocaleString() }} </template>
    </Column>
    <Column field="date_from" :header="$t('model.notification.date_from')">
      <template #body="slotProps"> {{ new Date(slotProps.data.date_from).toLocaleString() }} </template></Column
    >
    <Column field="date_to" :header="$t('model.notification.date_to')">
      <template #body="slotProps"> {{ new Date(slotProps.data.date_to).toLocaleString() }} </template>
    </Column>
    <Column field="asset" :header="$t('model.notification.asset')">
      <template #body="slotProps">
        <span v-if="slotProps.data.asset">
          {{ slotProps.data.asset.label }}
        </span>
        <span v-else class="disabled"> {{ $t("model.notification.no_asset") }}</span>
      </template>
    </Column>
    <Column field="dashboard" :header="$t('model.notification.dashboard')">
      <template #body="slotProps">
        <i
          v-if="slotProps.data.dashboard"
          v-tooltip="$t('view.go_to_dashboard')"
          class="pi pi-arrow-circle-right"
          @click="navigate(slotProps.data.dashboard.url)"
        />
        <span v-else class="disabled"> {{ $t("model.notification.no_dashboard") }}</span>
      </template>
    </Column>
    <Column field="measurement" :header="$t('model.notification.measurement')">
      <template #body="slotProps">
        <span v-if="slotProps.data.measurement">
          <span v-for="measurement in [printMeasurement(slotProps.data.measurement)]" :key="measurement">
            {{ measurement.label }} ({{ measurement.asset.label }})
          </span>
        </span>
        <span v-else> {{ $t("view.no_notification_measurement") }} </span>
      </template>
    </Column>
    <Column field="value" :header="$t('model.notification.value')"> </Column>
  </DataTable>
  <!-- information_tile_id todo: -->
</template>
<script>
import NotificationFilter from "@/components/miscellaneous/settings/NotificationFilter.vue";
export default {
  name: "NotificationList",
  components: { NotificationFilter },
  props: {
    notificationList: {
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
  emits: ["update", "reload"],
  data() {
    return {
      // mNotifications: [],
    };
  },
  computed: {},
  watch: {
    // notifications: function (newValue) {
    //   this.mNotifications = newValue;
    // },
  },
  async mounted() {},

  methods: {
    messageParams(notification) {
      let unit = notification.measurement && notification.measurement.type.unit != "any" ? notification.measurement.type.unit : "";
      return {
        asset_name: notification.asset ? (notification.asset.label ? notification.asset.label : notification.asset.name) : this.$t("view.no_asset"),
        timestamp: notification.timestamp ? this.$ren.utils.parseUnixTimestamp(notification.timestamp) : this.$t("view.no_timestamp"),
        value: notification.value ? `${Math.round(notification.value * 1000) / 1000.0} ${unit}` : this.$t("view.no_value"),
      };
    },
    printMeasurement(measurement) {
      if (measurement) {
        return {
          asset: {
            label: measurement.asset ? (measurement.asset.label ? measurement.asset.label : measurement.asset.name) : this.$t("view.no_asset"),
          },
          label: measurement.label ? measurement.label : measurement.name,
        };
      }
      return null;
    },
  },
};
</script>

<style lang="scss">
#-notification-list.sticky-header {
  .p-datatable-header ~ .p-datatable-wrapper .p-datatable-thead {
    top: 6rem;
  }
  .p-datatable-header {
    height: unset;
  }
}
// h3,
// h4 {
//   width: 100%;
//   color: white;
//   margin-bottom: 0.25rem;
//   margin-top: 1.5rem;
// }
</style>
