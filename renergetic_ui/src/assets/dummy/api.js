import { dummyList, informationTiles } from "./dashboard.js";
import storage from "./storage.js";
const DASHBOARD_KEY = "dashboard";
class DashboardApi {
  async list() {
    return storage.get(`${DASHBOARD_KEY}.list`, dummyList);
  }
  async listHeatMap() {
    return storage.get(`${DASHBOARD_KEY}.heatmap_list`, []);
  }
  async getHeatMap(id) {
    let maps = await this.listHeatmap();
    return maps.find((it) => it.id == id);
  }
  async getInformationPanel(panelId) {
    let tiles = await storage.get(
      `${DASHBOARD_KEY}.panel_list`,
      informationTiles
    );
    return tiles.find((it) => it.id == panelId);
  }
  informationPanelList() {
    return storage.get(`${DASHBOARD_KEY}.panel_list`, informationTiles);
  }
  async add(dashboard) {
    let l = await this.list();
    dashboard.id = Math.floor(Math.random() * 150);
    l.push(dashboard);
    storage.update(`${DASHBOARD_KEY}.list`, l);
    return new Promise((resolve) => {
      resolve(dashboard.id);
    });
  }

  delete(id) {
    return new Promise((resolve) => {
      resolve(id);
    });
  }
}
export { DashboardApi };
