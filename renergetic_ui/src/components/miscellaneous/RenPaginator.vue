<template>
  <Paginator
    v-if="totalRows != null"
    v-model:first="mOffset"
    :class="mClass"
    :rows="limit"
    :total-records="totalRows"
    template="FirstPageLink PrevPageLink   PageLinks  CurrentPageReport  NextPageLink LastPageLink   "
  />
  <Paginator
    v-else
    v-model:first="mOffset"
    :class="mClass"
    :rows="limit"
    :total-records="mOffset + (currentRows ? 1 + currentRows : 0)"
    template="FirstPageLink PrevPageLink PageLinks NextPageLink    "
  />
  <!-- {{ mOffset }};{{ mOffset + 1 + (currentRows ? currentRows : limit) }};{{ currentRows }} -->
</template>
<script>
import Paginator from "primevue/paginator";
export default {
  name: "RenPaginator",
  components: { Paginator },
  props: {
    sticky: { default: false, type: Boolean },
    page: { default: null, type: Number },
    totalRows: { default: null, type: Number },
    offset: { default: 0, type: Number },
    limit: { default: 25, type: Number },
    currentRows: { default: 0, type: Number },
  },
  emits: ["update:offset", "update:page", "update", "created"],
  data() {
    let v = this.init();
    return {
      mPage: v.mPage,
      mOffset: v.mOffset,
    };
  },
  computed: {
    // mTotalRows: function () {
    //   return this.totalRows ? this.totalRows : this.mOffset + this.limit + this.currentRows;
    // },

    mClass: function () {
      if (this.sticky) {
        return "ren-sticky";
      }
      return "";
    },
  },
  watch: {
    mOffset: {
      handler(newVal, oldValue) {
        if (newVal != oldValue) {
          this.$emit("update:offset", newVal);
          this.$emit("update:page", newVal / this.limit);
          this.$emit("update", { offset: newVal, limit: this.limit, page: newVal / this.limit });
        }
      },
      immediate: false,
    },
    offset: {
      handler(newVal) {
        this.mOffset = newVal;
      },
      immediate: false,
    },

    // page: function (newVal, oldValue) {
    //   if (newVal != oldValue) {
    //     this.init();
    //   }
    // },
    // limit: function (newVal, oldValue) {
    //   if (newVal != oldValue) {
    //     this.init();
    //   }
    // },
    // offset: function (newVal, oldValue) {
    //   if (newVal != oldValue) {
    //     this.init();
    //   }
    // },
  },
  mounted() {
    // console.info("mounted");
    let v = this.init();
    this.mPage = v.mPage;
    this.mOffset = v.mOffset;
    this.$emit("created", { offset: this.mOffset, limit: this.limit, page: this.mOffset / this.limit });
  },
  methods: {
    init() {
      let mOffset;
      let mPage;
      if (this.page != null) {
        mOffset = this.limit * this.page;
        mPage = this.page;
      } else {
        mOffset = this.offset;
        mPage = this.offset / this.limit;
      }
      return { mPage: mPage, mOffset: mOffset };
    },
  },
};
</script>
<style scoped lang="scss"></style>
