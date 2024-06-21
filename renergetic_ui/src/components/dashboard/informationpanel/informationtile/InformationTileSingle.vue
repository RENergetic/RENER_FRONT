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
    <div v-if="mSettings.tile.template" id="tilecontent" class="flex flex-column align-items-center justify-content-center">
      <span id="value" :style="color">
        <h3>{{ $t(`tile_templates.${tile.name}`, { value: `${$ren.utils.roundValue(value)} ${unit} ` }) }}</h3>
      </span>
    </div>
    <div v-else id="tilecontent" class="flex flex-column align-items-center justify-content-center">
      <span id="label" :style="color"> {{ mSettings.tile.label }} </span>
      <span id="value" :style="color">
        <h2>{{ $ren.utils.roundValue(value) }} {{ unit }}</h2>
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
    return {
      mSettings: this.settings,
      measurement: this.getTileMeasurement(),
    };
  },
  computed: {
    unit: function () {
      return this.$ren.utils.getUnit(this.measurement, this.settings.panel, this.conversionSettings);
    },
    color: function () {
      let color = this.$ren.utils.measurementColor(this.measurement, this.value);
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
      return this.$ren.utils.getConvertedValue(this.measurement, this.pdata, this.mSettings);
      // try {
      //   if (this.mSettings.panel.relativeValues && this.measurement.type.base_unit != "%") {
      //     return (
      //       (this.pdata.current[this.measurement.aggregation_function][this.measurement.id] /
      //         this.pdata.max[this.measurement.aggregation_function][this.measurement.id]) *
      //       100.0
      //     );
      //   }
      //   return this.pdata.current[this.measurement.aggregation_function][this.measurement.id];
      // } catch (e) {
      //   return null;
      // }
    },
  },

  // methods: {},
};
</script>

<style lang="scss" scoped>
span {
  float: left;
  width: 100%;
  text-align: center;
}
#tileicon {
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  padding: 5%;
  svg {
    height: 100%;
  }
}
.horizontal-tile {
  flex-direction: row !important;
  #tilecontent {
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
}
</style>
