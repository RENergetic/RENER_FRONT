<template>
  <div :class="'flex justify-content-center ' + tileOrientationClass">
    <div
      v-if="mSettings.tile.icon_visibility && mSettings.tile.icon"
      class="flex flex-none flex-column align-items-center justify-content-center tileicon"
    >
      <font-awesome-icon :icon="mSettings.tile.icon" />
    </div>
    <div v-if="mSettings.tile.template" class="flex flex-column align-items-center justify-content-center tilecontent">
      <InformationTileMeasurementList
        :tile="tile"
        :pdata="pdata"
        :settings="mSettings"
        :conversion-settings="conversionSettings"
        @select="onMeasurementSelect"
      />
    </div>
  </div>
</template>
<script>
import InformationTileMeasurementList from "./components/InformationTileMeasurementList.vue";
export default {
  name: "InformationTileList",
  components: { InformationTileMeasurementList },
  props: {
    tile: { type: Object, default: () => ({}) },
    pdata: { type: Object, default: () => ({}) },
    settings: { type: Object, default: () => ({}) },
    conversionSettings: { type: Object, default: () => ({}) },
  },
  emits: ["select"],
  data() {
    return {
      mSettings: this.settings,
      mTile: this.tile,
    };
  },
  methods: {
    iconVisibility: function () {
      return (this.mSettings && this.mSettings.tile ? this.mSettings.tile.icon_visibility : true) && this.mSettings.tile.icon;
    },
  },
};
</script>
<style lang="scss">
.tileicon {
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  // padding: 5%;
  padding: 0.5rem;

  svg {
    height: 100%;
  }
}

.horizontal-tile {
  span {
    float: left;
    margin-right: 0.5rem;
    text-align: center;
  }
  flex-direction: row !important;

  .tilecontent {
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0%;
  }

  .tileicon {
    height: 90%;
    // height: 4.5rem;
    width: 45%;
    max-width: 7rem;
    margin: auto;

    svg {
      max-width: 7rem;
      max-height: 7rem;
    }
  }
}

.vertical-tile {
  span {
    float: left;
    width: 100%;
    text-align: center;
  }
  flex-direction: column !important;

  .tileicon {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 0%;
  }

  .tileicon {
    width: 100%;
    // height: 4.5rem;
    height: 45%;
    max-height: 7rem;

    svg {
      max-width: 7rem;
      max-height: 7rem;
    }
  }
}
</style>
