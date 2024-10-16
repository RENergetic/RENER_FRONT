export default {
  //#region private
  _hexExtractColor(colorHex) {
    if (!colorHex) return colorHex;
    return colorHex.length > 7 ? colorHex.substring(0, 7) : colorHex.substring(0, Math.min(colorHex.length, 9));
  },
  _componentToHex(c) {
    var hex = (Math.round(c) % 255).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  },

  _rgbToHex(r, g, b) {
    return "#" + this._componentToHex(r) + this._componentToHex(g) + this._componentToHex(b);
  },
  _getRandomColor() {
    //primary color alternatives
    let r = 148 + Math.random() * 60 - 30;
    let g = 186 + Math.random() * 60 - 30;
    let b = 57 + Math.random() * 60 - 30;
    return this._rgbToHex(r, g, b);
  },
  //#endregion
  knobColors(measurement) {
    // if (measurement.type.color) {
    let color = this.measurementColor(measurement).color;
    //measurement.measurement_details.color ? measurement.measurement_details.color : measurement.type.color;
    if (color.length == 7) {
      return [`#${color.slice(1)}FF`, `#${color.slice(1)}40`];
    }
    return [`#${color.slice(1, color.length - 2)}FF`, `#${color.slice(1, color.length - 2)}40`];
    // }
  },
  measurementColor(measurement, value) {
    if (measurement == null) {
      return { alpha: 1.0, color: "#94ba39" };
    }
    let alpha = value ? 1.0 : 1.0 - value / 2;
    if (!measurement.measurement_details) {
      console.warn("no measurement details return default measurementColor");
      console.warn(measurement);
      return { alpha: 1.0, color: "#94ba39" };
    }
    let color = measurement.measurement_details.color ? measurement.measurement_details.color : measurement.type.color;
    color = this._hexExtractColor(color);
    return { alpha: alpha, color: color ? color : this._getRandomColor() }; //"#94ba39"
  },
  measurementBackgroundColor(measurement, tileSettings, alphaValue) {
    if (measurement == null) {
      return "none";
    }
    // let alpha = alphaValue ? 0.75 : 0.75 - alphaValue * 0.5;

    let alphaHex = alphaValue ? Math.round(alphaValue * 255).toString(16) : Math.round(0.75 * 255).toString(16);
    if (tileSettings && tileSettings.background_mask == "none") {
      return "none";
    }
    let color;
    if (tileSettings && tileSettings.background_mask && alphaValue) {
      color = tileSettings.background_mask;
    } else {
      color = measurement.measurement_details.background ? measurement.measurement_details.background : null;
      if (color == null) {
        color = this.measurementColor(measurement, null).color;
        if (alphaValue > 0.75) alphaHex = Math.round(0.75 * 255).toString(16);
      }
    }
    // color = this._hexExtractColor(color);
    if (color.length == 7) {
      return `#${color.slice(1)}${alphaHex}`;
    }
    return `#${color.slice(1, color.length - 2)}${alphaHex}`;
  },

  setMeasurementLabel(measurement) {
    if (measurement.label) {
      let k = `model.measurement.labels.${measurement.label}`;
      if (this.app.$te(k)) {
        measurement._label = measurement.label;
        measurement.label = this.app.$t(k);
      } else {
        measurement._label = measurement.name;
      }
    } else {
      measurement.label = measurement.name;
    }

    return measurement;
  },
  unitLabel(measurement, panelSettings, conversionSettings) {
    let u = this.getUnit(measurement, panelSettings, conversionSettings);

    if (u == null) u = "";

    return u && u != "any" && u != "ratio" ? `[${u}]` : ``;
  },
  measurementLabel(measurement) {
    let labelKey = `model.measurement.labels.${measurement.label}`;
    if (measurement.label != null && this.app.$te(labelKey)) {
      return this.$t(labelKey);
    }
    let nameKey = `enums.measurement_name.${measurement.name}`;
    if (this.app.$te(nameKey)) {
      return this.app.$t(nameKey);
    }
    if (measurement.label != null) {
      return measurement.label;
    }
    return measurement.name;
  },
};
// valueAgg(key, value, baseUnit, dict) {
//   switch (baseUnit) {
//     case "W":
//     case "Wh":
//       return dict[key].accu != 0 ? (value / dict[key].accu) * 100.0 : 0.0;
//     default:
//       console.error(`measurement type agreggation not defined for ${baseUnit}, ${key}`);
//       break;
//   }
//   return dict;
// }};
