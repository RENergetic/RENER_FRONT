import RestComponent from "./restcomponent";
export default class DataApi extends RestComponent {
  constructor(axiosInstance, vueInstance) {
    super(axiosInstance, vueInstance);
  }

  // INFORMATION PANEL REQUESTS

  //TODO: discuss with Raul
  // async attributes(/*area, areaId*/) {}

  // async getTimeseries(measurementIds) {   }
  // async generateHeatMapState(heatmapid){}
  // async getCurrentData(measurementIds) {  }
  // async getPanelData(panelId) {}
  // async getAssetData(assetId) {}
  // async getHeatMapData(heatmapId) {}
  // async getNotifications(objectIds) {}
}
