<template>
  <div>
    <BIconThreeDotsVertical
      id="menu-toggle"
      type="button"
      label="Toggle"
      aria-haspopup="true"
      aria-controls="overlay_menu"
      :class="position"
      @click="toggle"
    />
    <Menu id="overlay_menu" ref="menu" :model="items" :popup="true" />
  </div>
</template>

<script>
import Menu from "primevue/menu";
import { BIconThreeDotsVertical } from "bootstrap-icons-vue";
export default {
  name: "DotMenu",
  components: {
    Menu,
    BIconThreeDotsVertical,
  },
  props: {
    model: {
      type: Object,
      default: () => ({}),
    },
    position: {
      type: String,
      default: "top right",
    },
  },
  data() {
    return {};
  },
  watch: {},

  async created() {},
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#menu-toggle {
  font-size: 1rem;
  z-index: 1002;
  position: absolute;
}
.topright {
  top: 1rem;
}
.right {
  right: 1rem;
}
</style>
