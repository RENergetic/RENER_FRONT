<template>
  <OverlayPanel v-if="!floating" ref="InfoPanel" style="max-width: 25rem" append-to="body" :show-close-icon="showCloseIcon">
    <h3 v-if="header" class="info-header"><slot ref="header" name="header" /></h3>
    <div class="info-content"><slot name="content" /></div>
  </OverlayPanel>
  <Dialog v-else v-model:visible="helpDialog" :dismissable-mask="true" :style="{ maxHeight: '100%' }" :modal="true">
    <Card class="ren-page-content" style="width: max-content">
      <template #content>
        <slot name="content" />
      </template>
    </Card>
  </Dialog>
  <div v-if="!showIcon" @mouseleave="$refs.InfoPanel.toggle" @mouseover="$refs.InfoPanel.toggle">
    <slot name="body" />
    <slot name="infoicon" />
  </div>

  <i
    v-if="showIcon"
    id="infoicon"
    class="pi pi-info-circle"
    style="font-size: 1.5rem"
    @mouseleave="!floating ? $refs.InfoPanel.toggle : empty"
    @mouseover="!floating ? $refs.InfoPanel.toggle : empty"
    @click="!floating ? $refs.InfoPanel.toggle : show()"
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
    floating: { type: Boolean, default: false },
  },
  data() {
    return {
      isHeader: !!this.$slots.header,
      isContent: !!this.$slots.content,
      helpDialog: false,
    };
  },
  updated: function () {
    this.isHeader = !!this.$slots.header;
    this.isContent = !!this.$slots.content;
  },
  methods: {
    empty() {},
    show() {
      this.helpDialog = true;
    },
  },
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
