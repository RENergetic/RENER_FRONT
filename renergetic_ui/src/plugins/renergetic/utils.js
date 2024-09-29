import { v4 as uuidv4 } from "uuid";
import { QueryBuilder } from "./ren_api/wrapper_api";
import { RenRoles } from "../model/Enums";
import MeasurementUtils from "../utils/measurement_utils";
import MeasurementDataUtils from "../utils/measurement_data_utils";
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

class RenUtils {
  vueInstance = null;
  host = document.location.origin;
  constructor(vueInstance) {
    this.vueInstance = vueInstance;
    Object.assign(this, MeasurementUtils);
    Object.assign(this, MeasurementDataUtils);
  }
  version() {
    return process.env.VUE_APP_VERSION;
  }
  toPrimeFilter(filterDict) {
    if (filterDict == null) {
      return {};
    }
    return Object.fromEntries(Object.entries(filterDict).map((it) => [it[0], { value: it[1] }]));
  }

  fromPrimeFilter(primeFilterDict) {
    if (primeFilterDict == null) {
      return {};
    }
    return Object.fromEntries(Object.entries(primeFilterDict).map((it) => [it[0], it[1].value]));
  }
  get app() {
    return this.vueInstance.config.globalProperties;
  }
  uuid() {
    return uuidv4();
  }
  toJSON(obj, pretty = false) {
    return pretty ? JSON.stringify(obj, null, "\t") : JSON.stringify(obj, null, "");
  }

  downloadJSON(obj, filename, pretty = false) {
    var json = pretty ? JSON.stringify(obj, null, "\t") : JSON.stringify(obj);
    var file = new Blob([json], { type: "application/json" });
    var downloadLink = document.createElement("a");
    downloadLink.download = filename + ".json";
    downloadLink.href = window.URL.createObjectURL(file);
    downloadLink.style.display = "none";

    document.body.appendChild(downloadLink);
    downloadLink.click();
  }
  readJSONFile(file) {
    return new Promise((resolve, reject) => {
      let content = "";
      const reader = new FileReader();
      // Wait till complete
      reader.onloadend = function (e) {
        content = e.target.result;
        const result = JSON.parse(content); //content.split(/\r\n|\n/);
        resolve(result);
      };
      reader.onerror = function (e) {
        reject(e);
      };
      reader.readAsText(file);
    });
  }
  /**
   * get default value if null/undefined
   */
  default(value, defaultValue = undefined) {
    return value !== null && value !== undefined ? value : defaultValue;
  }
  dateString(ts = null) {
    if (ts == null) {
      return null;
    }
    var dateObj = new Date(ts);
    var dd = String(dateObj.getDate()).padStart(2, "0");
    var mm = String(dateObj.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = dateObj.getFullYear();
    dateObj = mm + "/" + dd + "/" + yyyy + " " + dateObj.getHours() + ":" + dateObj.getMinutes();
    return dateObj;
  }
  currentDate() {
    return this.dateString(new Date().getTime());
    // var today = new Date();
    // var dd = String(today.getDate()).padStart(2, "0");
    // var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    // var yyyy = today.getFullYear();
    // today = mm + "/" + dd + "/" + yyyy + " " + today.getHours() + ":" + today.getMinutes();
    // return today;
  }
  currentTimestamp() {
    return new Date().getTime();
  }
  openNewTab(path) {
    var parser = document.createElement("a");
    parser.href = location;
    parser.origin;
    window.open(`${parser.origin}${path}`, "_blank");
  }
  // saveSettings(settingsKey, settings) {
  //   this.app.$store.commit(settingsKey, settings);
  //   let allSettings = this.app.$store.getters["settings"];
  //   this.app.$ren.userApi
  //     .setSettings(allSettings)
  //     .then(() => this.app.$emitter.emit("information", { message: this.app.$t("information.settings_saved") }));
  // }
  async saveSettings() {
    // console.error("saveSettings");
    let allSettings = this.app.$store.getters["settings"];
    let _this = this;

    let settings = await _this.app.$ren.userApi.setSettings(allSettings).then((settings) => {
      _this.app.$emitter.emit("information", { message: _this.app.$t("information.settings_saved") });
      return settings;
    });
    // console.info(settings);
    this.app.$store.commit("settings", settings);
  }

  async getPanelStructure(panelId, assetId, storePanel = false, forceReload = false) {
    let informationPanel = null;
    if (assetId == null && !forceReload) {
      let index = this.app.$store.getters["view/informationPanelsMap"][panelId];
      if (index != null) {
        informationPanel = this.app.$store.getters["view/informationPanels"][index];
      }
    }
    if (informationPanel == null) {
      informationPanel = await this.app.$ren.dashboardApi.getInformationPanel(panelId, assetId);
      if (informationPanel != null && storePanel) {
        this.app.$store.commit("view/setPanel", informationPanel);
      }
    }
    if (assetId == null) {
      for (let tile of informationPanel.tiles) {
        if (tile.measurements) {
          tile.measurements = tile.measurements.filter((measurement) => measurement != null); //&& measurement.id != null
        }
      }
    }
    // console.warn("measurement types hotfix");
    // for (let tile of informationPanel.tiles) {
    //   for (let m of tile.measurements) {
    //     if ((m.name == "ess" || m.name == "ep") && m.type && m.type.name == "value") {
    //       m.type.base_unit = "ratio";
    //       // m.type.factor = 1;
    //       m.type.unit = "ratio";
    //       m.type.label = "ratio";
    //       m.type.name = "ratio";
    //       m.type.physical_name = "ratio";
    //       m.type.id = -1;
    //     }
    //   }
    // }
    return informationPanel;
  }

  async loadSettings() {
    let settings = await this.app.$ren.userApi.getSettings();
    console.debug(settings);
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
    console.debug("reload user data");
    let isAuthenticated = this.app.$store.getters["auth/isAuthenticated"];
    if (!isAuthenticated) {
      // console.error("TODO: handle not logged in user");
      // let q = new QueryBuilder();TODO: maybe load here homepage data

      throw new Error("NOT_AUTHENTICATED");
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
    if ((RenRoles.REN_MANAGER | RenRoles.REN_TECHNICAL_MANAGER | RenRoles.REN_ADMIN) & currentRole) {
      q.assetMetaKeys();
    }
    if ((RenRoles.REN_USER | RenRoles.REN_MANAGER) & currentRole) {
      q.demands();
    }
    let _this = this;
    await this.app.$ren.wrapperApi.get(q.build()).then((data) => {
      // console.error("TODO: hotfix , add required measuremnt type to the database");

      // data.measurement_types.push({
      //   base_unit: "ratio",
      //   color: null,
      //   dashboard_visibility: false,
      //   description: null,
      //   factor: 1,
      //   id: -1,
      //   label: "Ratio",
      //   name: "ratio",
      //   physical_name: "ratio",
      //   unit: "ratio",
      // });
      _this.app.$store.commit("view/wrapper", data);
      _this.app.$store.dispatch("slideshow/set");
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
  roundValue(value) {
    if (value >= 4.0) {
      return Math.round(value);
    }
    if (value >= 0.4) {
      return Math.round(value * 10.0) / 10.0;
    }

    if (value >= 0.04) {
      return Math.round(value * 100.0) / 100.0;
    }
    return Math.round(value * 1000.0) / 1000.0;
  }
}
Object.assign(RenUtils.prototype, MeasurementUtils.prototype);
export default RenUtils;
export { DeferredFunction };
