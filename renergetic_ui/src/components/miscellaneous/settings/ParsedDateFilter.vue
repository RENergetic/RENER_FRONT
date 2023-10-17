<template>
  <div v-if="dateFrom">{{ dateFrom }}</div>
  <div v-if="dateTo">{{ dateTo }}</div>
  <!-- {{ $store.getters["settings/filter"] }} -->
</template>

<script>
export default {
  name: "ParsedDateFilter",
  components: {},
  props: {},
  data() {
    return {
      filter: this.$store.getters["settings/parsedFilter"](),
    };
  },
  computed: {
    dateFrom: function () {
      if (this.filter.from) {
        let d = new Date(this.filter.from).toLocaleString();
        return this.$t("view.data_date_from", { date: d });
      }
      return null;
    },
    dateTo: function () {
      if (this.filter.to) {
        let d = new Date(this.filter.to).toLocaleString();
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
