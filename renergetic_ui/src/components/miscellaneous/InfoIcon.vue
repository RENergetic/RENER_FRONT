<template>
  <OverlayPanel ref="InfoPanel" style="max-width: 25rem" append-to="body" :show-close-icon="showCloseIcon">
    <h3 v-if="header" class="info-header"><slot ref="header" name="header" /></h3>
    <div class="info-content"><slot name="content" /></div>
  </OverlayPanel>
  <div v-if="!showIcon" @mouseleave="$refs.InfoPanel.toggle" @mouseover="$refs.InfoPanel.toggle">
    <slot name="body" />
  </div>
  <i
    v-if="showIcon"
    id="infoicon"
    class="pi pi-info-circle"
    style="fontsize: 2rem"
    @mouseleave="$refs.InfoPanel.toggle"
    @mouseover="$refs.InfoPanel.toggle"
    @click="$refs.InfoPanel.toggle"
  />
</template>

<script>
import OverlayPanel from "primevue/overlaypanel";
/**
 * slots:
 * - header - popup header
 * - content - popup content
 * - body - content instead of default icon
 * props:
 * - showIcon: bool - use default default icon or provide custom `body`
 * - showCloseIcon:bool - popup close button visibility
 */
export default {
  name: "InfoIcon",
  components: { OverlayPanel },
  props: {
    showCloseIcon: { type: Boolean, default: false },
    showIcon: { type: Boolean, default: true },
  },
  data() {
    return {
      isHeader: !!this.$slots.header,
      isContent: !!this.$slots.content,
    };
  },
  updated: function () {
    this.isHeader = !!this.$slots.header;
    this.isContent = !!this.$slots.content;
  },
  methods: {},
};
</script>

<style scoped lang="scss">
#infoicon {
  vertical-align: top;
  margin-left: 0.2rem;
}
// .info-header {
// }
// .info-content {
// }
</style>
