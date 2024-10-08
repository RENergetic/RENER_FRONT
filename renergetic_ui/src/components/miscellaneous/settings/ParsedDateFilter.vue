<template>
  <span v-if="dateFrom">{{ dateFrom }}</span>
  <span v-if="dateTo">{{ dateTo }}</span>
  <!-- {{ $store.getters["settings/filter"] }} -->
</template>

<script>
export default {
  name: "ParsedDateFilter",
  components: {},
  props: { filter: { type: Object, default: null } },
  data() {
    let mFilter = this.filter ? this.filter : this.$store.getters["settings/parsedFilter"]();
    return {
      mFilter: mFilter,
    };
  },
  computed: {
    dateFrom: function () {
      if (this.mFilter.from) {
        let d = new Date(this.mFilter.from).toLocaleString();
        return this.$t("view.data_date_from", { date: d });
      }
      return null;
    },
    dateTo: function () {
      if (this.mFilter.to) {
        let d = new Date(this.mFilter.to).toLocaleString();
        return this.$t("view.data_date_to", { date: d });
      }
      return null;
    },
  },

  async created() {},
  methods: {},
};
</script>
<style scoped lang="scss"></style>
