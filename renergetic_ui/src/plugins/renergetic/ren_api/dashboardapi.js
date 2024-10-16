import RestComponent from "./restcomponent";
// import storage from "../../../assets/dummy/storage.js";
// import informationPanelList from "../../../assets/dummy/samples/informationpanels.js";
// import heatmapList from "../../../assets/dummy/samples/heatmap.js";
// import demandList from "../../../assets/dummy/samples/demand.js";
export default class DashboardApi extends RestComponent {
  constructor(axiosInstance, vueInstance) {
    super(axiosInstance, vueInstance);
  }
  ////////////////////////////////////////////////////////////
  ////                                                   /////
  //// Dashboard Requests                                /////
  ////                                                   /////
  ////////////////////////////////////////////////////////////
  list(offset = 0, limit = 20) {
    return this.get(`/api/dashboard`, { offset: offset, limit: limit });
  }
  getDashboard(id) {
    return this.get(`/api/dashboard/${id}`);
  }
  add(dashboard) {
    //validate
    // TODO:
    return this.post(`/api/dashboard`, dashboard);
  }
  update(dashboard) {
    //validate
    // TODO:
    return this.put(`/api/dashboard/${dashboard.id}`, dashboard, null, null, (e) => {
      if (e.response.status == 404) {
        this.emitError(`Dashboard ${dashboard.id} not found: ${e.message}`, {
          code: "dashboard_not_found",
          args: [dashboard.id],
        });
        return true;
      }
    });
  }
  deleteDashboard(id) {
    return this.delete(`/api/dashboard/${id}`, null, null, (e) => {
      if (e.response.status == 404) {
        this.emitError(`Dashboard ${id} not found: ${e.message}`, {
          code: "dashboard_not_found",
          args: [id],
        });
        return true;
      }
    });
  }

  ////////////////////////////////////////////////////////////
  ////                                                   /////
  //// INFORMATION PANEL  Requests                       /////
  ////                                                   /////
  ////////////////////////////////////////////////////////////
  // TEMPORAL CHANGES TO CONNECT WITH BACKEND
  listInformationPanel(offset = 0, limit = 50) {
    return this.get(`/api/informationPanel`, { offset: offset, limit: limit });
  }

  async saveInformationPanel(panel) {
    return this.post(`/api/informationPanel/name/${panel.name}`, panel, null, null, (e) => {
      if (e.response.status == 404) {
        this.emitError(`Panel ${panel.id} not found: ${e.message}`, {
          code: "panel_not_found",
          args: [panel.id],
        });
        return true;
      }
      if (e.response.status != 200) {
        this.emitError(`Panel ${panel.id} not found: ${e.message}`, {
          code: "panel_update",
          args: [panel.id],
        });
        return true;
      }
    });
  }
  async inferMeasurements(panel) {
    return this.post(`/api/informationPanel/infermeasurements`, panel);
  }

  async updateInformationPanel(panel) {
    return this.put(`/api/informationPanel`, panel, null, null, (e) => {
      if (e.response.status == 404) {
        this.emitError(`Panel ${panel.id} not found: ${e.message}`, {
          code: "panel_not_found",
          args: [panel.id],
        });
        return true;
      }
      if (e.response.status != 200) {
        this.emitError(`Panel ${panel.id} not found: ${e.message}`, {
          code: "panel_update",
          args: [panel.id],
        });
        return true;
      }
    });
  }

  async getInformationPanel(panelId) {
    return this.get(`/api/informationPanel/id/${panelId}`);
  }
  async deleteInformationPanel(panelId) {
    return this.delete(`/api/informationPanel/id/${panelId}`);
  }

  async setFeatured(panelId, featured) {
    if (featured) {
      return this.post(`/api/informationPanel/id/${panelId}/featured/true`);
    } else return this.post(`/api/informationPanel/id/${panelId}/featured/false`);
  }

  async getPanelConnectedAssets(panelId) {
    return this.get(`/api/informationPanel/id/${panelId}/asset`);
  }

  async assignAsset(panelId, assetId) {
    return this.put(`/api/informationPanel/id/${panelId}/asset/${assetId}`);
  }
  async revokeAsset(panelId, assetId) {
    return this.delete(`/api/informationPanel/id/${panelId}/asset/${assetId}`);
  }
  //TODO:
  // listInformationPanel(userId=null,offset=0,limit=10) {} =>  src/assets/dummy/samples/information_panel.js
  // async getInformationPanel(panelId,assetId) {
  //TODO:
  // }
  // async addInformationPanel(panel) {}
  // async deleteInformationPanel(id) {}

  // HEATMAP REQUESTS
  //TODO:
  // async listHeatMap(userId=null,offset=0,limit=20) { }  src/assets/dummy/samples/heatmap.js
  // async getHeatMap(id) { }
  // async addHeatMap(heatmap) { }
  // async updateHeatMap(heatmap) { }
  // async deleteHeatMap(id) { }
  // This one may not be needed anymore and should use getDemand(assetId) in managementApi: async getDemand(areaId) {} ./docs/model/demand.json

  // async addInformationPanel(panel) {
  //   panel.id = Math.floor(Math.random() * 1500);
  //   storage.push(`${DASHBOARD_API_KEY}.${PANEL_KEY}`, panel);
  //   return new Promise((resolve) => {
  //     resolve(panel.id);
  //   });
  // }

  // async deleteInformationPanel(id) {
  //   return new Promise((resolve) => {
  //     resolve(id);
  //   });
  // }
}

// async listHeatMap(userId = null) {
//   console.info(`listHeatMap for ${userId}`);
//   return storage.get(`${DASHBOARD_API_KEY}.${HEATMAP_KEY}`, heatmapList);
// }
// async getHeatMap(id) {
//   let maps = await this.listHeatMap();
//   return maps.find((it) => it.id == id);
// }

// async addHeatMap(heatmap) {
//   heatmap.id = Math.floor(Math.random() * 150);
//   storage.push(`${DASHBOARD_API_KEY}.${HEATMAP_KEY}`, heatmap);
//   return new Promise((resolve) => {
//     resolve(heatmap.id);
//   });
// }
// async updateHeatMap(heatmap) {
//   storage.updateList(`${DASHBOARD_API_KEY}.${HEATMAP_KEY}`, heatmap);
//   return new Promise((resolve) => {
//     resolve(heatmap.id);
//   });
// }
// async deleteHeatMap(id) {
//   return new Promise((resolve) => {
//     resolve(id);
//   });
// }
// getDemand(heatmapId) {
//   //TODO:
//   console.info(heatmapId);
//   return demandList;
// }
