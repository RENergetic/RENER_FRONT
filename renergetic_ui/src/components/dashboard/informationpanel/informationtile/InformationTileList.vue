<template>
  <div :class="'flex justify-content-center ' + tileOrientationClass">
    <div
      v-if="mSettings.tile.icon_visibility && mSettings.tile.icon"
      class="flex flex-none flex-column align-items-center justify-content-center tileicon"
    >
      <font-awesome-icon :icon="mSettings.tile.icon" />
    </div>
    <div class="flex flex-column align-items-center justify-content-center tilecontent" style="padding: 0 0.5rem">
      <InformationTileMeasurementList
        v-if="mData != null"
        :tile="mTile"
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
      mData: null,
      mSettings: this.settings,
      mTile: this.tile,
    };
  },
  beforeMount() {
    this.aggregate();
  },
  methods: {
    aggregate: function () {
      if (this.mSettings.tile.group_by_asset || this.mSettings.tile.group_by_domain || this.mSettings.tile.group_by_direction) {
        let groupedMeasurements = this.$ren.utils.groupValues(this.tile.measurements, this.pdata, this.mSettings);
        groupedMeasurements = Object.values(groupedMeasurements);
        console.debug(groupedMeasurements);

        console.warn("TODO: set local labels and colors");
        this.mData = this.pdata;
        for (let gm of groupedMeasurements) {
          this.mData.current[gm.aggregation_function][gm.id] = gm.value;
        }
        this.mTile = JSON.parse(JSON.stringify(this.mTile));
        this.mTile.measurements = groupedMeasurements;
      } else {
        this.mData = this.pdata;
        this.mTile = this.tile;
      }
    },
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
  flex-direction: row !important;
}
.horizontal-tile {
  span {
    float: left;
    margin-right: 0.5rem;
    text-align: center;
  }

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
  flex-direction: column !important;
}
.vertical-tile {
  span {
    float: left;
    width: 100%;
    text-align: center;
  }
  //

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
