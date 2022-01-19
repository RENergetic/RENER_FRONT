<template>
  <div>
    TODO: list notifications
    {{ mNotifications }}
  </div>
</template>
<script>
// THEN to get HTML5 drag&drop
export default {
  name: "Dashboard",
  components: {},
  props: {
    notifications: {
      type: Array,
      default: () => null,
    },
    tileId: {
      type: Number,
      default: null,
    },
    areaId: {
      type: Number,
      default: null,
    },
    dateInterval: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      mNotifications: [],
      grid: null,
      locked: false,
      editTile: null,
      editDialog: false,
    };
  },
  computed: {},
  watch: {
    notifications: function (newValue) {
      this.mNotifications = newValue;
    },
  },
  async created() {
    if (this.notifications == null) {
      //todo:
      this.$ren.measurementApi
        .getInformationPanel(this.$route.params.id)
        .then((notifications) => {
          this.mNotifications = notifications;
        });
    } else {
      this.mNotifications = this.notifications;
    }
    //todo: catch
  },

  methods: {},
};
</script>

<style lang="scss"></style>
