import {
  dummyList,
  informationPanels,
  heatmaps,
  measurementAttributes,
  measurementsGenerator,
  currentMeasurementsGenerator,
  dataGenerator,
} from "./dashboard.js";
import { assetList } from "./data.js";
import storage from "./storage.js";
const DASHBOARD_KEY = "dashboard";
const MEASUREMENT_KEY = "dashboard";
const ASSET_KEY = "asset";
class DashboardApi {
  async list() {
    return storage.get(`${DASHBOARD_KEY}.list`, dummyList);
  }
  async listHeatMap() {
    return storage.get(`${DASHBOARD_KEY}.heatmap_list`, heatmaps);
  }
  async getHeatMap(id) {
    let maps = await this.listHeatMap();
    return maps.find((it) => it.id == id);
  }
  async getInformationPanel(panelId) {
    let tiles = await storage.get(`${DASHBOARD_KEY}.panel_list`, informationPanels);
    return tiles.find((it) => it.id == panelId);
  }
  informationPanelList() {
    return storage.get(`${DASHBOARD_KEY}.panel_list`, informationPanels);
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
  async addHeatMap(heatmap) {
    let l = await this.listHeatMap();
    heatmap.id = Math.floor(Math.random() * 150);
    l.push(heatmap);
    storage.update(`${DASHBOARD_KEY}.heatmap_list`, l);
    return new Promise((resolve) => {
      resolve(heatmap.id);
    });
  }
  delete(id) {
    return new Promise((resolve) => {
      resolve(id);
    });
  }
}

class InfrastructureApi {
  //Infrastructure  REQUESTS
  async assetlist() {
    return storage.get(`${ASSET_KEY}.list`, assetList);
  }
}

class MeasurementApi {
  async attributes(/*area, areaId*/) {
    return storage.get(`${MEASUREMENT_KEY}.panel_list`, measurementAttributes);
  }

  async getMeasurements(objectIds) {
    return measurementsGenerator(objectIds.length, 50);
  }

  async getCurrentMeasurements(objectIds) {
    return currentMeasurementsGenerator(objectIds);
  }
  async getPanelData(panelId) {
    if (panelId == null) return null;
    return dataGenerator(10);
  }
  async getNotifications(objectIds) {
    // todo:
    return objectIds;
  }
}
export { DashboardApi, MeasurementApi, InfrastructureApi };
