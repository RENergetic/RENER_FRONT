import { v4 as uuidv4 } from "uuid";
import { QueryBuilder } from "./ren_api/wrapper_api";
import { RenRoles } from "../model/Enums";
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
  saveSettings(settingsKey, settings) {
    this.app.$store.commit(settingsKey, settings);
    let allSettings = this.app.$store.getters["settings/all"];
    this.app.$ren.userApi.setSettings(allSettings);
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
    console.info(this.app.$store.getters["auth/renRole"]);
    let q = new QueryBuilder();
    if (
      (RenRoles.REN_ADMIN | RenRoles.REN_MANAGER | RenRoles.REN_TECHNICAL_MANAGER) &
      this.app.$store.getters["auth/renRole"]
    ) {
      q.dashboards();
    }
    if ((RenRoles.REN_VISITOR | RenRoles.REN_USER) & this.app.$store.getters["auth/renRole"]) {
      q.assets().assetPanels().panels();
    }
    if (RenRoles.REN_USER & this.app.$store.getters["auth/renRole"]) {
      q.demands();
    }
    let _this = this;
    await this.app.$ren.wrapperApi.get(q.build()).then((data) => {
      console.info(data);
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

  measurementChartColors(measurement) {
    if (measurement.type.color) {
      let color = measurement.type.color;
      if (color.length == 7) {
        return [`#${color.slice(1)}FF`, `#${color.slice(1)}40`];
      }
      return [`#${color.slice(1, color.length - 2)}FF`, `#${color.slice(1, color.length - 2)}40`];
    }
  }
  measurementColor(measurement, value) {
    let alpha = value ? 1.0 : 0.5;
    return { alpha: alpha, color: measurement.type.color };
    // if (measurement.type.color) {
    //   let color = measurement.type.color;
    //   if (color.length == 7) {
    //     return [`#FF${color.slice(1)}`, `#40${color.slice(1)}`];
    //   }
    //   return [`#FF${color.slice(3)}`, `#40${color.slice(3)}`];
    // }
  }
  calcPanelRelativeValues(panel, pData) {
    var accuDict = {};
    // var aggDict = { current: { last: {} }, predictions: pData.predictions };
    //TODO: aggregate also predictions - not only current values
    if (panel && panel.tiles) {
      for (let tile of panel.tiles) {
        for (let m of tile.measurements) {
          let key = `${m.name}_${m.direction}_${m.domain}_${m.type.base_unit}`;
          let factor = m.type.factor;
          let value = pData.current.last[m.id] * factor; //todo: raise exception if value not found
          accuDict = this.valueAccu(key, value, m.type.base_unit, accuDict);

          // console.info(factor);
          // console.info(m);
          // console.info(pData.current.last[m.id]);
          // console.info(JSON.stringify(accuDict));
        }
      }
    }
    if (panel && panel.tiles) {
      for (let tile of panel.tiles) {
        for (let m of tile.measurements) {
          let key = `${m.name}_${m.direction}_${m.domain}_${m.type.base_unit}`;
          // let factor = m.type.factor;
          // let value = pData.current.last[m.id] * factor;
          // let aggValue = this.valueAgg(key, value, m.type.base_unit, accuDict);
          // pData.current.last[m.id] = aggValue;
          if (!pData.current.min) {
            pData.current.min = {};
          }
          pData.current.min[m.id] = 0;
          if (!pData.current.max) {
            pData.current.max = {};
          }
          pData.current.max[m.id] = accuDict[key].accu;
        }
      }
    }

    console.info(accuDict);
    return pData;
    // console.info(JSON.stringify(aggDict));
    // return aggDict;
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
        return (value / dict[key].accu) * 100.0;
      default:
        console.error(`measurement type aggreagation not defined for ${baseUnit}, ${key}`);
        break;
    }
    return dict;
  }
}
