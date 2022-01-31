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
</template>

<script>
import Dialog from "primevue/dialog";
import NotificationList from "../area/NotificationList.vue";

export default {
  name: "Dialogs",
  components: {
    Dialog,
    NotificationList,
  },
  props: {
    notifications: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:notifications"],
  data() {
    return {
      mNotifications: this.notifications,
    };
  },
  watch: {
    mNotifications: {
      handler(newVal, oldValue) {
        if (oldValue == null && newVal == null) {
          return;
        }
        this.$emit("update:notifications", newVal);
      },
      immediate: true,
    },
    notifications: {
      handler(newVal) {
        this.mNotifications = newVal;
      },
      immediate: true,
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
