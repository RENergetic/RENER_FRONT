<template>
  <!-- {{ mSettings }} -->

  <div v-if="measurement" :class="'flex justify-content-center ' + tileOrientationClass" :style="tileStyle">
    <div
      v-if="mSettings.tile.icon_visibility && mSettings.tile.icon"
      id="tileicon"
      class="flex flex-none flex-column align-items-center justify-content-center"
    >
      <!-- {{ mSettings.tile.icon }} -->
      <font-awesome-icon :icon="mSettings.tile.icon" />
    </div>

    <div v-if="mSettings.tile.template" class="flex flex-column align-items-center justify-content-center tilecontent">
      <span id="value" :style="color">
        <h3>{{ $t(`tile_templates.${tile.name}`, { value: `${$ren.utils.roundValue(value)} ${unit} ` }) }}</h3>
      </span>
    </div>
    <div
      v-else-if="mSettings.tile.icon_visibility && mSettings.tile.icon"
      class="flex flex-column align-items-center justify-content-center tilecontent"
    >
      <span id="label" :style="color"> {{ mSettings.tile.label ? mSettings.tile.label : `${measurementlabel}: ` }} </span>
      <span id="value" :style="color">
        <h2>{{ $ren.utils.roundValue(value) }} {{ unit }}<RenValueCompare :value-diff="prevDiff" /></h2>
      </span>
    </div>
    <div v-else :class="'flex flex-column align-items-center justify-content-center tilecontent' + tileOrientationClass">
      <span id="label" :style="color"> {{ mSettings.tile.label ? mSettings.tile.label : `${measurementlabel}: ` }} </span>
      <span id="value" :style="color">
        <h2>{{ $ren.utils.roundValue(value) }} {{ unit }}<RenValueCompare :value-diff="prevDiff" /></h2>
      </span>
    </div>
  </div>
  <div v-else>{{ $t("view.no_panel_measurements") }}</div>
  <!-- {{ tile.props }} -->
  <!-- <div v-if="measurement.description">description: {{ measurement.description }}</div> -->
</template>
<script>
export default {
  name: "InformationTileSingle",
  props: {
    // edit: { type: Boolean, default: false },
    tile: {
      type: Object,
      default: () => ({}),
    },
    pdata: {
      type: Object,
      default: () => ({}),
    },
    settings: { type: Object, default: () => ({}) },
    conversionSettings: { type: Object, default: () => ({}) },
  },

  data() {
    let measurement = this.getTileMeasurement();
    return {
      mSettings: this.settings,
      measurement: measurement,
    };
  },
  computed: {
    unit: function () {
      if (this.measurement == null) return "";
      return this.$ren.utils.getUnit(this.measurement, this.settings.panel, this.conversionSettings);
    },
    color: function () {
      let color = this.measurementColor; //this.$ren.utils.measurementColor(this.measurement, this.value);
      return `color:${color.color}`;
    },
    tileStyle: function () {
      // let color = this.mSettings.tile.measurement_background
      //   ? this.$ren.utils.measurementBackgroundColor(this.measurement, this.mSettings.tile, this.value)
      //   : "none";
      let color = this.tileMeasurementBackgroundColor;
      return `height: 100%;background:${color} `;
    },
    value: function () {
      if (this.mSettings.tile.aggregate_values) {
        let accu = 0.0;
        for (let m of this.tile.measurements) {
          accu += this.$ren.utils.getConvertedValue(m, this.pdata, this.mSettings);
        }
        return accu;
      }

      if (this.measurement == null) return "";
      return this.$ren.utils.getConvertedValue(this.measurement, this.pdata, this.mSettings);
    },
    prevDiff: function () {
      if (!this.mSettings.tile.compare_with_previous || !this.pdata.previous) {
        return null;
      }
      if (this.mSettings.tile.aggregate_values) {
        let accu = 0.0;
        for (let m of this.tile.measurements) {
          accu += this.$ren.utils.getValue(m, this.pdata.previous);
        }
        return this.value - accu;
      }
      if (this.measurement == null) return null;
      return this.value - this.$ren.utils.getValue(this.measurement, this.pdata.previous);
    },
  },

  // methods: {},
};
</script>

<style lang="scss" scoped>
#tileicon {
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

  #tileicon {
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

  #tilecontent {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 0%;
  }

  #tileicon {
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

h2 {
  margin: 0;
  display: flex;
}
</style>
