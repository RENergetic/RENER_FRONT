<template class="p-col-2">
  <Card>
    <!-- :class="`p-col-${col}`" -->
    <template v-if="tile != null" #content>
      <div v-for="item in tile.items" :key="item.id">
        <InformationTileItem :tile-item="item"></InformationTileItem>
      </div>
    </template>
  </Card>
</template>
<script>
import Card from "primevue/card";
import InformationTileItem from "./InformationTileItem.vue";
export default {
  name: "InformationTile",
  components: { Card, InformationTileItem },
  props: {
    tile: {
      type: Object,
      default: () => null,
    },
  },
  // data() {
  //   return {};
  // },
  computed: {
    col: function () {
      return this.tile == null || this.tile.col == null ? 2 : this.tile.col;
    },
  },

  mounted() {},
  methods: {},
};
</script>

<style lang="scss"></style>
