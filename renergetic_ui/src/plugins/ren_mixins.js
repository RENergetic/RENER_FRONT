import { RenRoles } from "@/plugins/model/Enums.js";
// RenMixins
export default {
  data() {
    return {
      RenRoles: RenRoles,
    }
  },
  computed: {

    unitLabel: function () {
      let measurement = 'measurement' in this ? this.measurement : null;
      return this.$ren.utils.unitLabel(measurement, this.settings.panel, this.conversionSettings);
    },
    tvMode: function () {
      return this.$route.meta.tvMode ? true : false;
    },
    isTileHorizontal: function () {
      try {
        let w =
          this.settings.panel && this.settings.panel.cellWidth
            ? this.settings.panel.cellWidth * this.tile.layout.w
            : (this.$parent.$el.parentElement.clientWidth * 0.9);
        let h =
          this.settings.panel && this.settings.panel.cellHeight
            ? this.settings.panel.cellHeight * this.tile.layout.h
            : this.$parent.$el.parentElement.clientHeight * 0.9;
        return w > h;
      } catch (ex) {
        if (this.$parent.$el == null) {
          return false
        }
        console.error(ex)
        return true;
      }
    },
    tileOrientationClass: function () {
      return this.isTileHorizontal ? 'horizontal-tile' : 'vertical-tile'
    },

    measurementColor: function () {
      let colorObj;
      if (!this.mSettings.tile.measurement_color) {
        if ('measurement' in this && this.measurement != null)
          colorObj = this.$ren.utils.measurementColor(this.measurement, this.value);
        else {
          colorObj = this.$ren.utils.measurementColor(null, null);
        }
      }
      else {
        colorObj = { color: this.mSettings.tile.measurement_color, alpha: this.value ? 1.0 : 1.0 - this.value / 2 }
      }
      return colorObj;
    },
    tileTitleColor: function () {
      let color = this.mSettings.tile.title_color;
      if (color == null) {
        if (('measurement' in this && this.measurement != null)) {
          color = this.$ren.utils.measurementColor(this.measurement, this.value).color;
        }
        else{
          color = "#d6ebff";
        }
      } 
      return color;
    },
    tileMeasurementBackgroundColor: function () {
      let alpha = this.bgAlpha ? this.bgAlpha : null
      console.warn("TODO: set tile background alpha")

      let measurement = 'measurement' in this ? this.measurement : null;
      let bgcolor = this.mSettings.tile.measurement_background
        ? this.$ren.utils.measurementBackgroundColor(measurement, this.mSettings.tile, alpha)
        : "none";// this.mSettings.tile.background?this.mSettings.tile.background:"none";
      return bgcolor
    },
  },

  methods: {
    parseDateFilter: function (filter) {
      let f = filter ? filter : {};
      let from = f.date_from;
      let to = f.date_to;
      var date = new Date();
      switch (f.timeIntervalType) {
        case "current_day":
          from = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
          to = null;
          break;
        case "last_24h":
          from = new Date().getTime() - 3600 * 24 * 1000;
          to = null;
          break;
        case "last_week":
          from = new Date().getTime() - 3600 * 24 * 1000 * 7;
          to = null;
          break;
        case "current_month":
          from = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
          to = null;
          break;
        case "previous_month":
          from = new Date(date.getFullYear(), date.getMonth() - 1, 1).getTime();
          to = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
          break;
        case "current_year":
          from = new Date(date.getFullYear(), 0, 1).getTime();
          to = null;
          break;
        case "previous_year":
          from = new Date(date.getFullYear() - 1, 0, 1).getTime();
          to = new Date(date.getFullYear(), 0, 1).getTime();
          break;
        default:
          if (from == null) from = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
          break;
      }
      filter.from = from;
      filter.to = to;
      return { from: from, to: to, predictionIntervalms: filter.predictionIntervalms }
    },


    measurementLabel: function (measurement) {
      if (measurement == null) return null
      let localKey;
      let label;
      if (measurement.label) {
        localKey = `model.measurement.labels.${measurement.label}`;
        label = measurement.label
      }
      else {
        localKey = `enums.measurement_name.${measurement.name}`;
        label = measurement.name
      }
      if (this.$te(localKey)) {
        return this.$t(localKey);
      }
      return label;

    },

    objectLabel: function (obj, tKey) {
      if (obj == null) return null
      if (obj.label && this.$te(`${tKey}.${obj.label}`)) {
        return this.$t(`${tKey}.${obj.label}`);
      }
      if (obj.name && this.$te(`${tKey}.${obj.name}`)) {
        return this.$t(`${tKey}.${obj.name}`);
      }
      return obj.label ? obj.label : obj.name

    },
    fieldLabel: function (field, tKey) {
      return field != null && this.$te(`${tKey}.${field}`) ? this.$t(`${tKey}.${field}`) : field
    },
    getTileMeasurement: function () {
      // console.error(this.tile)
      if (this.tile == null) return null;
      if (this.tile.measurements && this.tile.measurements.length > 1)
        console.warn("Length of measurement list is greater than one. ")
      return this.tile.measurements && this.tile.measurements.length > 0 ? this.tile.measurements[0] : null;
    },
    async deleteConfirm({ message, header = null, action }) {
      await this.$confirm.require({
        message: message,
        header: header ? header : this.$t("view.confirm_delete"),
        icon: "pi pi-exclamation-triangle",
        accept: async () => {
          await action()
        },
        reject: () => {
          this.$confirm.close();
        },
      });
    },

    tileContentSize1D() {
      let w =
        this.settings.panel && this.settings.panel.cellWidth
          ? this.settings.panel.cellWidth * this.tile.layout.w
          : this.$parent.$el.parentElement.clientWidth * 0.9;
      let h =
        this.settings.panel && this.settings.panel.cellHeight
          ? this.settings.panel.cellHeight * this.tile.layout.h
          : this.$parent.$el.parentElement.clientHeight * 0.9;
      if (!h) {
        h = window.innerHeight * 0.95 / 12 * this.tile.layout.h;
      }
      if (!w) {
        w = window.innerWidth * 0.95 / 12 * this.tile.layout.w;
      }
      let minD = Math.min(w, h);
      console.debug("cell height: " + this.settings.panel.cellHeight + ":  " + w + "," + h)
      console.debug(this.settings.panel)
      return minD
    },
    /**
     * 
     * @param {name,path} 
     * @returns true if current route matches 
     */
    checkPath({ name = null, path = null, params = null }) {
      if (params != null && this.$route.params != null) {
        let rparams = this.$route.params;
        if (rparams.size !== params.size) {
          return false;
        }
        for (let k in params) {
          if (!((rparams[k] == null && params[k] == null) || (rparams[k] != null && params[k] != null))
            || ((rparams[k] + "") != (params[k] + ""))
          ) {
            return false;
          }
        }
      }
      if (name != null) {
        if (this.$route.matched != null && this.$route.matched.name != null)
          return this.$route.matched.name == name;
        if (this.$route.name != null)
          return this.$route.name == name;
      }
      if (path != null) {
        if (this.$route.matched != null && this.$route.matched.path == path)
          return true;
        if (this.$route.path == path) {
          return true;
        }
      }
      return false;
    },


    /**
     * 
     * @param {*} s1 -  settings object  
     * @param {*} s2 - settings to merge with
     * @param {*} mode- merge/override mode: 'fixed' =  s2, 'override' = s2<=s1, 'default' = s1, 'merge' and others - s2+s1
     * @returns  final settings for the panel 
     */
    mergeSettings(s1, s2, mode) {
      s1 = s1 == null ? {} : s1;
      s2 = s2 == null ? {} : s2;
      let mSettings;
      switch (mode) {
        case "fixed":
          mSettings = { ...s2 };
          break;
        case "override":
          mSettings = { ...s2, ...s1 };
          break;
        case "default":
          mSettings = { ...s1 };
          break;
        case "merge":
        default:
          mSettings = { ...s2 };
          for (let k in s1) {
            if (!(k in mSettings) || mSettings[k] == null) {
              mSettings[k] = s1[k];
            }
          }
          break;
      }
      return mSettings;
    },
    /**
       * 
       * @param {*} settings - user's panel settings 
       * @param {*} panel - panel model
       * @returns  final settings for the panel 
       */
    effectiveOverrideMode(settings, panel) {
      let overrideMode = panel.props && panel.props.overrideMode ? panel.props.overrideMode : false;

      let role = RenRoles.REN_ADMIN | RenRoles.REN_MANAGER | RenRoles.REN_TECHNICAL_MANAGER;

      if (role & this.$store.getters["auth/renRole"] && settings.ignoreOverrideMode) {
        overrideMode = "override";
      }
      else {
        overrideMode = overrideMode ? "fixed" : "merge"
      }

      return overrideMode;
    },
    /**
     * 
     * @param {*} settings - user's panel settings 
     * @param {*} panel - panel model
     * @returns  final settings for the panel 
     */
    computePanelSettings(settings, panel) {
      // let mSettings = {};
      // if (settings == null) {
      //   mSettings = {};
      // } else {
      //   mSettings = settings;
      // }
      // if (panel.props) {
      //   let overrideMode = panel.props.overrideMode;
      //   let role = RenRoles.REN_ADMIN | RenRoles.REN_MANAGER | RenRoles.REN_TECHNICAL_MANAGER;
      //   if (role & this.$store.getters["auth/renRole"] && mSettings.ignoreOverrideMode) {
      //     mSettings = { ...panel.props, ...mSettings };
      //   } else
      //     switch (overrideMode) {
      //       case "fixed":
      //         mSettings = panel.props;
      //         break;
      //       case "override":
      //         mSettings = { ...panel.props, ...mSettings };
      //         break;
      //       case "default":
      //         mSettings = settings;
      //         break;
      //       default:
      //         mSettings = { ...panel.props };

      //         for (let k in settings) {
      //           if (!(k in mSettings) || mSettings[k] == null) {
      //             mSettings[k] = settings[k];
      //           }
      //         }
      //         break;
      //     }
      // }
      // // mSettings.legend = mSettings.legend != null ? mSettings.legend : true;
      // // mSettings.legend = mSettings.legend != null ? mSettings.legend : null;
      if (panel == null) {
        return {}
      }
      let overrideMode = this.effectiveOverrideMode(settings, panel)
      console.debug("settings override mode: " + overrideMode)
      let mSettings = this.mergeSettings(settings, panel.props, overrideMode)
      mSettings.asset_id = this.assetId;
      // settings.title = settings.title != null ? settings.title : true;
      // settings.color = settings.color != null ? settings.color : "#d6ebff"; 
      mSettings.fontSize = mSettings.fontSize != null ? mSettings.fontSize : `${2.0}rem`;;
      return mSettings;
    }
  }
};
