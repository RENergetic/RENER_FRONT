<template>
  <Card class="col-12" style="width: 90%; margin: auto; margin-top: 1rem">
    <template #content>
      <NotificationFilter class="ren-card" :submit-button="false" :columns="3" @update="onSettingsUpdate()" />
      <RenSpinner ref="spinner" :lock="true" style="margin: auto; max-width: 80rem">
        <template #content>
          <NotificationList v-model:filters="filters" :notification-list="notificationList" @reload="loadData" />
        </template>
      </RenSpinner>
    </template>
  </Card>
</template>
<script>
import NotificationList from "@/components/management/notification/NotificationList.vue";
import NotificationFilter from "@/components/miscellaneous/settings/NotificationFilter.vue";

export default {
  name: "NotificationListView",
  components: { NotificationList, NotificationFilter },
  data() {
    return {
      filters: null,
      notificationList: [],
    };
  },
  watch: {
    filters: function () {
      //TODO pass newval ?
      this.loadData();
    },
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    onSettingsUpdate() {},
    async loadData() {
      //todo: add some filters
      this.$refs.spinner.run(async () => {
        this.notificationList = await this.$ren.managementApi.listNotifications();
      });
    },
  },
};
</script>

<style lang="scss"></style>
