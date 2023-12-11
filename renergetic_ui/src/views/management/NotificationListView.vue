<template>
  <Card class="ren-page-content" style="max-width: 90rem">
    <template #title>{{ $t("menu.manage_notifications") }}</template>
    <template #content>
      <!-- <Toolbar class="ren-toolbar ren-sticky">
        <template #start>
          <NotificationFilter class="ren-card" :submit-button="false" :columns="3" @update="onSettingsUpdate()" />
        </template>
      </Toolbar> -->
      <!-- <div class="ren-sticky">
        <NotificationFilter class="ren-card" :submit-button="false" :columns="3" @update="onSettingsUpdate()" />
      </div> -->
      <RenSpinner ref="spinner" :lock="true" style="min-width: 100%">
        <template #content>
          <NotificationList v-model:filters="filters" :notification-list="notificationList" @reload="loadData" />
        </template>
      </RenSpinner>
    </template>
  </Card>
</template>
<script>
import NotificationList from "@/components/management/notification/NotificationList.vue";
// import NotificationFilter from "@/components/miscellaneous/settings/NotificationFilter.vue";

export default {
  name: "NotificationListView",
  components: { NotificationList },
  data() {
    return {
      notificationList: [],
    };
  },
  watch: {
    // filters: function () {
    //   //TODO pass newval ?
    //   this.loadData();
    // },
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    async onSettingsUpdate() {
      this.loadData();
    },
    async loadData() {
      //todo: add some filters
      var filter = this.$store.getters["settings/parsedFilter"]("notification_filter");
      console.info(filter);
      this.$refs.spinner.run(async () => {
        this.notificationList = await this.$ren.managementApi.listNotifications(filter);
      });
    },
  },
};
</script>

<style lang="scss"></style>
