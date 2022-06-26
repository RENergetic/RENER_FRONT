import { v4 as uuidv4 } from "uuid";
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

    if (
      (RenRoles.REN_ADMIN | RenRoles.REN_MANAGER | RenRoles.REN_TECHNICAL_MANAGER) &
      this.app.$store.getters["auth/renRole"]
    ) {
      await this.reloadDashboard();
    }
    if (!(RenRoles.REN_VISITOR | (RenRoles.REN_USER & this.app.$store.getters["auth/renRole"]))) return;

    await this.app.$ren.userApi.listInformationPanel().then((informationPanels) => {
      this.app.$store.commit("view/informationPanels", informationPanels);
    });
    //TODO: settings
    // await this.app.$ren.userApi.getSettings().then((settings) => {
    //   this.app.$store.commit("settings/all", settings);
    // });
    // await this.app.$ren.userApi.getAssets().then((assets) => {
    //   this.app.$store.commit("view/assets", assets);
    // });
    await this.app.$ren.userApi.listAssetPanels().then((assets) => {
      this.app.$store.commit("view/assetPanels", assets);
    });
  }
  async reloadDashboard() {
    await this.app.$ren.dashboardApi.list().then((dashboards) => {
      this.app.$store.commit("view/dashboards", dashboards);
    });
  }
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
}
