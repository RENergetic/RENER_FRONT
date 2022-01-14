<template>
  <div class="grid-stack-item" v-bind="gridStackAttributes">
    <div class="grid-stack-item-content">
      {{ widget }}
    </div>
  </div>
</template>
<script>
// let initialWidgets = [
//   {
//     id: "widget0",
//     text: "first widget",
//     x: 0,
//     y: 0,
//     // layout: {
//     //   x: 0,
//     //   y: 0,
//     //   width: 4,
//     //   height: 2,
//     // },
//   },
//   {
//     id: "widget1",
//     text: "second widget",
//     x: 4,
//     y: 0,
//     // layout: {
//     //   x: 4,
//     //   y: 0,
//     //   width: 4,
//     //   height: 4,
//     // },
//   },
// ];
export default {
  props: {
    widget: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    gridStackAttributes() {
      return {
        id: this.widget.id,
        "data-gs-id": this.widget.id,
        "data-gs-x": this.widget.x,
        "data-gs-y": this.widget.y,
        "data-gs-width": 2,
        "data-gs-height": 1,
      };
    },
  },
};
</script>
<style>
.grid-stack-item {
  margin: 10px;
}
.grid-stack-item-content {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #3182ce;
  background-color: #bee3f8;
  font-weight: 600;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
</style>
