import { v4 as uuidv4 } from "uuid";
import { QueryBuilder } from "./ren_api/wrapper_api";
import { RenRoles } from "../model/Enums";
class DeferredFunction {
  timeoutInstance = null;
  timeout = null;
  deferredF = null;
  constructor(deferredF = null, timeout = 1500) {
    this.deferredF = deferredF;
    this.timeout = timeout;
  }
  _clear() {
    if (this.timeoutInstance) {
      clearTimeout(this.timeoutInstance);
    }
    this.timeoutInstance = null;
  }
  /**
   *
   * @param {*} deferredF deferred function
   * @param {*} timeout
   */
  run(deferredF = this.deferredF, timeout = this.timeout) {
    // let f = deferredF ? deferredF : this.deferredF;
    var _this = this;
    if (this.timeoutInstance) {
      _this._clear();
    }
    var wrapper = () => {
      // console.info("emitFilter");
      deferredF();
      _this._clear();
    };
    this.timeoutInstance = setTimeout(wrapper, timeout);
  }
  /**
   *
   * @param {*} deferredF deferred function
   * @param {*} timeout
   */
  runAsync(deferredF = this.deferredF, timeout = this.timeout) {
    var _this = this;
    if (this.timeoutInstance) {
      _this._clear();
    }
    var wrapper = async () => {
      await deferredF();
      _this._clear();
    };
    this.timeoutInstance = setTimeout(wrapper, timeout);
  }
}

export default class RenUtils {
  vueInstance = null;
  host = document.location.origin;
  constructor(vueInstance) {
    this.vueInstance = vueInstance;
  }
  get app() {
    return this.vueInstance.config.globalProperties;
  }
  uuid() {
    return uuidv4();
  }
  /**
   * get default value if null/undefined
   */
  default(value, defaultValue = undefined) {
    return value !== null && value !== undefined ? value : defaultValue;
  }
  currentDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + "/" + dd + "/" + yyyy + " " + today.getHours() + ":" + today.getMinutes();
    return today;
  }
  // saveSettings(settingsKey, settings) {
  //   this.app.$store.commit(settingsKey, settings);
  //   let allSettings = this.app.$store.getters["settings"];
  //   this.app.$ren.userApi
  //     .setSettings(allSettings)
  //     .then(() => this.app.$emitter.emit("information", { message: this.app.$t("information.settings_saved") }));
  // }
  async saveSettings() {
    let allSettings = this.app.$store.getters["settings"];
    let _this = this;

    let settings = await _this.app.$ren.userApi.setSettings(allSettings).then((settings) => {
      _this.app.$emitter.emit("information", { message: _this.app.$t("information.settings_saved") });
      return settings;
    });
    // console.info(settings);
    this.app.$store.commit("settings", settings);
  }

  localPanel(id, assetId) {
    let panel = null;
    if (assetId != null) {
      panel = this.app.$store.getters["view/assetPanel"](id, assetId);
      if (!panel.is_template) {
        let index = this.app.$store.getters["view/informationPanelsMap"][id];
        if (index != null) {
          panel = this.app.$store.getters["view/informationPanels"][index];
        }
      }
    } else {
      let index = this.app.$store.getters["view/informationPanelsMap"][id];
      if (index != null) {
        panel = this.app.$store.getters["view/informationPanels"][index];
      }
    }
    // console.info(panel);
    return panel;
  }

  async loadSettings() {
    let settings = await this.app.$ren.userApi.getSettings();
    console.info(settings);
    this.app.$store.commit("settings", settings);
  }

  /**
   *
   * @param {*} flags  - e.g. RenRoles.REN_ADMIN | RenRoles.REN_TECHNICAL_MANAGER | RenRoles.REN_ADMIN
   * @returns
   */
  checkAccess(flags) {
    return (flags & this.app.$store.getters["auth/renRole"]) != 0;
  }
  /**
   * reload basic app data
   */
  async reloadStore() {
    console.info("reload user data");
    let isAuthenticated = this.app.$store.getters["auth/isAuthenticated"];
    if (!isAuthenticated) {
      console.error("TODO: handle not logged in user");
      return;
    }
    var currentRole = this.app.$store.getters["auth/renRole"];

    await this.loadSettings();

    // console.info(this.app.$store.getters["auth/renRole"]);
    let q = new QueryBuilder();
    q.measurementTypes();
    q.panels();
    if ((RenRoles.REN_ADMIN | RenRoles.REN_MANAGER | RenRoles.REN_TECHNICAL_MANAGER) & currentRole) {
      q.dashboards();
    }
    if ((RenRoles.REN_VISITOR | RenRoles.REN_USER) & currentRole) {
      q.assets().assetPanels();
    }
    if ((RenRoles.REN_MANAGER | RenRoles.REN_TECHNICAL_MANAGER) & currentRole) {
      q.assetMetaKeys();
    }
    if ((RenRoles.REN_USER | RenRoles.REN_MANAGER) & currentRole) {
      q.demands();
    }
    let _this = this;
    await this.app.$ren.wrapperApi.get(q.build()).then((data) => {
      _this.app.$store.commit("view/wrapper", data);
    });
  }
  // async reloadDashboard() {
  //   await this.app.$ren.dashboardApi.list().then((dashboards) => {
  //     this.app.$store.commit("view/dashboards", dashboards);
  //   });
  // }
  parseUnixTimestamp(timestamp) {
    var ts = new Date(timestamp);
    var dd = String(ts.getDate()).padStart(2, "0");
    var MM = String(ts.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = ts.getFullYear();
    var mm = ts.getMinutes();
    var hh = ts.getHours();
    if (mm < 10) mm = `0${mm}`;
    if (hh < 10) hh = `0${hh}`;
    let parsed = MM + "/" + dd + "/" + yyyy + " " + hh + ":" + mm;
    return parsed;
  }

  knobColors(measurement) {
    if (measurement.type.color) {
      let color = measurement.measurement_details.color ? measurement.measurement_details.color : measurement.type.color;
      // console.info(measurement);
      // console.info(color);
      if (color.length == 7) {
        return [`#${color.slice(1)}FF`, `#${color.slice(1)}40`];
      }
      return [`#${color.slice(1, color.length - 2)}FF`, `#${color.slice(1, color.length - 2)}40`];
    }
  }

  measurementBackgroundColor(measurement /*,alpha*/) {
    //tODO add alpha supprot
    let alpha = "80";
    if (measurement.type.color) {
      let color = measurement.measurement_details.color ? measurement.measurement_details.color : measurement.type.color;
      // console.info(measurement);
      // console.info(color);
      if (color.length == 7) {
        return `#${color.slice(1)}${alpha}`;
      }
      return `#${color.slice(1, color.length - 2)}${alpha}`;
    }
  }
  measurementColor(measurement, value) {
    let alpha = value ? 1.0 : 0.5;
    let color = measurement.measurement_details.color ? measurement.measurement_details.color : measurement.type.color;
    return { alpha: alpha, color: color };
  }

  aggKey(measurement, settings) {
    let key = `${measurement.type.base_unit}_${measurement.aggregation_function}`;
    if (settings.groupByDirection) {
      key += `_${measurement.direction}`;
    }
    if (settings.groupByMeasurement) {
      key += `_${measurement.name}`;
    }
    if (settings.groupByDomain) {
      key += `_${measurement.domain}`;
    } else {
      switch (measurement.domain) {
        case "heat":
        case "electricity":
          key += "_he";
          break;
        default:
          key += "_none";
      }
    }
    return key;
  }
  getUnit(measurement, panelSettings, conversionSettings) {
    if (panelSettings.relativeValues) {
      return "%";
    }
    let mt = conversionSettings[measurement.type.physical_name];
    // console.info(conversionSettings);
    return mt ? mt : measurement.type.unit;
  }

  convertPanelData(panel, pData, settings) {
    var mDict = {};
    //TODO: initialize this dictionary in the vuex store
    let cp = JSON.parse(JSON.stringify(pData));
    if (panel && panel.tiles) {
      for (let tile of panel.tiles) {
        for (let m of tile.measurements) {
          mDict[m.id] = m;
        }
      }
    }
    //TODO: convert min, max, prediction etc
    // console.info(pData);
    for (let mId in mDict) {
      let m = mDict[mId];
      var newUnit = settings[m.type.physical_name];
      // console.info(m.type.physical_name + " " + newUnit);
      if (newUnit) {
        let value = pData.current[m.aggregation_function][m.id];
        let newV = this.app.$store.getters["view/convertValue"](m.type, value, newUnit);
        cp.current[m.aggregation_function][m.id] = newV;
      }
    }
    // console.info(cp);
    return cp;
  }
  calcPanelRelativeValues(panel, pData, settings) {
    var accuDict = {};

    // var aggDict = { current: { last: {} }, predictions: pData.predictions };
    //TODO: aggregate also predictions - not only current values
    //TODO: include min values
    var mDict = {};
    //TODO: initialize this dictionary in the vuex store
    if (panel && panel.tiles) {
      for (let tile of panel.tiles) {
        if (tile.props && !tile.props.ignore_grouping) {
          for (let m of tile.measurements) {
            //TODO: ignore percentage type ?
            if (m.type.base_unit != "%") mDict[m.id] = m;
          }
        }
      }
    }

    for (let mId in mDict) {
      let m = mDict[mId];
      let key = this.aggKey(m, settings);
      // let key = `${m.name}_${m.direction}_${m.domain}_${m.type.base_unit}`;
      let factor = m.type.factor;
      let value = pData.current[m.aggregation_function][m.id] / factor; //todo: raise exception if value not found
      accuDict = this.valueAccu(key, value, m.type.base_unit, accuDict);
    }
    pData.max = {};
    for (let mId in mDict) {
      let m = mDict[mId];
      // let key = `${m.name}_${m.direction}_${m.domain}_${m.type.base_unit}`;
      let key = this.aggKey(m, settings);
      let factor = m.type.factor;
      // let value = pData.current.last[m.id] * factor;
      // let aggValue = this.valueAgg(key, value, m.type.base_unit, accuDict);
      // pData.current.last[m.id] = aggValue;
      if (!pData.current.min) {
        pData.current.min = {};
      }
      pData.current.min[m.id] = 0;
      // if (!pData.current.max) {
      //   pData.current.max = {};
      // }
      // pData.current.max[m.id] = accuDict[key].accu * factor;
      if (!pData.max[m.aggregation_function]) {
        pData.max[m.aggregation_function] = {};
      }
      if (!pData.max[m.aggregation_function][m.id]) {
        pData.max[m.aggregation_function][m.id] = {};
      }
      pData.max[m.aggregation_function][m.id] = accuDict[key].accu * factor;
    }

    return pData;
  }
  valueAccu(key, value, baseUnit, dict) {
    if (dict[key] == null) {
      dict[key] = { accu: value, counter: 0 };
      return dict;
    }
    switch (baseUnit) {
      case "W":
      case "Wh":
        dict[key].accu += value;
        break;
      default:
        console.error(`measurement type accu not defined for ${baseUnit}, ${key}`);
        break;
    }
    return dict;
  }
  valueAgg(key, value, baseUnit, dict) {
    switch (baseUnit) {
      case "W":
      case "Wh":
        return dict[key].accu != 0 ? (value / dict[key].accu) * 100.0 : 0.0;
      default:
        console.error(`measurement type agreggation not defined for ${baseUnit}, ${key}`);
        break;
    }
    return dict;
  }
}

export { DeferredFunction };
