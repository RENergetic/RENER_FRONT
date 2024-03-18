<template>
  <div v-if="slotProps" :class="'grid-stack-item ren'" v-bind="gridStackAttributes">
    <div :class="'grid-stack-item-content ' + state" :style="background">
      <div class="tile-bar">
        <Button
          v-if="edit"
          id="menu-toggle"
          :class="'p-button-rounded p-button-text edit-button'"
          aria-haspopup="true"
          icon="pi pi-pencil"
          @click="$emit('edit', slotProps)"
        />
        <!-- <Button notifications for tile
          v-if="notificationVisible"
          id="notification"
          :class="'p-button-rounded p-button-text bell-button '"
          aria-haspopup="true"
          icon="pi pi-bell"
          @click="$emit('notification', slotProps)"
        /> -->
      </div>
      <InformationTile
        :tile="tile"
        :pdata="tileData"
        :filter="filter"
        :settings="mSettings"
        @preview-tile="onPreview"
        @timeseries-update="onTimeseriesUpdate"
      />
    </div>
  </div>
</template>
<script>
import InformationTile from "./InformationTile.vue";
//InformationTile grid wrapper
export default {
  name: "InformationTileGridWrapper",
  components: { InformationTile },
  props: {
    edit: { type: Boolean, default: true },
    slotProps: {
      type: Object,
      default: () => ({}),
    },
    pdata: {
      type: Object,
      default: () => ({}),
    },
    settings: {
      type: Object,
      default: () => ({}),
    },
    filter: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  emits: ["edit", "notification", "timeseries-update", "preview-tile"],
  data() {
    return {
      mSettings: this.settings,
      tileData: this.pdata, //&& this.pdata.data ? this.pdata.data : {},
    };
  },
  computed: {
    fontSize: function () {
      let size = this.mSettings != null && this.mSettings.fontSize != null ? this.mSettings.fontSize : 2.0;
      return `${size}rem`;
    },
    tile: function () {
      return this.slotProps.tile;
    },
    tileClass: function () {
      if (this.tile.type == "panel") {
        return "block tile";
      }
      return "block";
    },
    background: function () {
      if (this.tile.props) {
        return "background: " + this.tile.props.background;
      }
      return "";
    },
    notificationVisible: function () {
      //default visible
      return !(this.mSettings != null && !this.mSettings.notificationVisibility);
    },
    state: function () {
      // return state class
      // let state = this.tile == null || this.tile.state == null ? "unknown" : this.tile.state;
      let state = this.pdata && this.pdata.state ? this.pdata.state[this.tile.id] : "unknown";
      if (state.toLowerCase() == "ok") {
        return "";
      }
      if (state) return `state ${state.toLowerCase()}`;
      //state not provided to the exists tile (e.g. tile not saved yet in the backend)
      return `state unknown`;
    },

    col: function () {
      return this.tile == null || this.tile.col == null ? 2 : this.tile.col;
    },
    layout: function () {
      return this.tile != null && this.tile.layout != null ? this.tile.layout : (() => ({}))();
    },
    gridStackAttributes() {
      //TODO: other attributes?
      //https://github.com/gridstack/gridstack.js/tree/master/doc#grid-attributes
      // example with an old version https://codesandbox.io/s/grid-stack-js-integration-with-vuejs-72mrn?file=/src/App.vue
      return {
        id: this.tile.id,
        "gs-id": this.tile.id,
        "gs-x": this.layout.x,
        "gs-y": this.layout.y,
        "gs-w": this.layout.w,
        "gs-h": this.layout.h,
      };
    },
  },
  watch: {
    pdata: {
      handler: function (newValue) {
        this.tileData = newValue; //&& newValue.data ? newValue.data : {};
      },
      deep: true,
    },
    // settings: {
    //   handler: function (newValue) {
    //     this.mSettings = newValue;
    //   },
    //   deep: true,
    // },
  },
  methods: {
    onPreview() {
      this.$emit("preview-tile", this.tile);
    },
    onTimeseriesUpdate(evt) {
      this.$emit("timeseries-update", evt);
    },
  },
};
</script>

<style lang="scss">
.edit-button {
  position: absolute;
  right: 0;
  top: 0;
}
.bell-button {
  position: absolute;
  left: 0;
  top: 0;
}
.grid-stack-item {
  margin: 10px;
}
.grid-stack-item-content {
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #d6ebff;
  padding: 0;
  // background-color: #bee3f8;
  font-weight: 600;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  // background: #870000; /* fallback for old browsers */
  // background: -webkit-linear-gradient(to bottom, #190a05, #870000); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to bottom, #190a05, #870000);
  max-height: 100%;
  width: 100%;
  text-shadow: 1px 1px 0 #333, -1px -1px 0 #333, 1px -1px 0 #333, -1px 1px 0 #333, 2px 2px 4px rgba(0, 0, 0, 0.15);
  // display: flex;
  // flex-direction: column;
  // align-items: flex-end;
}
.tile {
  height: 100%;
  width: 100%;
}
.tile-bar {
  padding: 0.3rem;
}
.grid-stack-item {
  margin: 0;
}
.grid-stack-item-content {
  inset: 10px;
}
</style>
