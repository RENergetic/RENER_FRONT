import { RenRoles } from "@/plugins/model/Enums.js";
export default {
  data() {
    return {
      RenRoles: RenRoles,
    }
  },
  computed: {

    unitLabel: function () {
      return this.$ren.utils.unitLabel(this.measurement, this.settings.panel, this.conversionSettings);
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

    tileTitleColor: function () {
      let color = this.mSettings.tile.title_color;
      if (this.measurement != null && color == null) {
        color = this.$ren.utils.measurementColor(this.measurement, this.value).color;
      }
      return color;
    },
    tileBackgroundColor: function () {
      let bgcolor = this.mSettings.tile.measurement_background
        ? this.$ren.utils.measurementBackgroundColor(this.measurement, this.mSettings.tile, this.value)
        : "none";
      return bgcolor
    },
  },

  methods: {
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
    getTileMeasurement: function () {
      console.error(this.tile)
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
      let minD = Math.min(w, h);
      console.debug("cell height: " + this.settings.panel.cellHeight)
      console.debug(this.settings.panel)
      // console.error(this.$parent.$el)
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
     * @param {*} settings - user settings 
     * @param {*} panel - panel model
     * @returns  final settings for the panel 
     */
    computePanelSettings(settings, panel) {
      let mSettings = {};
      if (settings == null) {
        mSettings = {};
      } else {
        mSettings = settings;
      }
      if (panel.props) {
        let props = panel.props;
        let overrideMode = props.overrideMode;
        let role = RenRoles.REN_ADMIN | RenRoles.REN_MANAGER | RenRoles.REN_TECHNICAL_MANAGER;
        if (role & this.$store.getters["auth/renRole"] && mSettings.ignoreOverrideMode) {
          mSettings = { ...panel.props, ...mSettings };
        } else
          switch (overrideMode) {
            case "fixed":
              mSettings = panel.props;
              break;
            case "override":
              mSettings = { ...panel.props, ...mSettings };
              break;
            case "default":
              mSettings = settings;
              break;
            default:
              mSettings = { ...panel.props };

              for (let k in settings) {
                if (!(k in mSettings) || mSettings[k] == null) {
                  mSettings[k] = settings[k];
                }
              }
              break;
          }
      }
      // mSettings.legend = mSettings.legend != null ? mSettings.legend : true;
      // mSettings.legend = mSettings.legend != null ? mSettings.legend : null;
      mSettings.asset_id = this.assetId;
      // settings.title = settings.title != null ? settings.title : true;
      // settings.color = settings.color != null ? settings.color : "#d6ebff";
      let size = mSettings != null && mSettings.fontSize != null ? mSettings.fontSize : `${2.0}rem`;
      mSettings.fontSize = size;
      return mSettings;
    }
  }
};
