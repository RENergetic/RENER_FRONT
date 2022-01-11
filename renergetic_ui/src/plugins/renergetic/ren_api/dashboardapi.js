import RestComponent from "./restcomponent";
import { dummyList, informationTiles } from "../../../assets/dummy/dashboard";
export default class DashboardApi extends RestComponent {
  constructor(axiosInstance, vueInstance) {
    super(axiosInstance, vueInstance);
  }
  list() {
    // TODO:
    return dummyList();
    // return this.axios
    //   .get(`/api/dashboard`, {
    //     headers: { "Content-type": "application/json; charset=UTF-8" },
    //     spinner: true,
    //   })
    //   .then((response) => {
    //     return response.data;
    //   })
    //   .catch(function (error) {
    //     console.error("list  entity error" + error.message);
    //   });
  }
  getInformationPanel(panelId) {
    console.info(panelId);
    // TODO:
    return informationTiles();
    // return this.axios
    //   .get(`/api/dashboard`, {
    //     headers: { "Content-type": "application/json; charset=UTF-8" },
    //     spinner: true,
    //   })
    //   .then((response) => {
    //     return response.data;
    //   })
    //   .catch(function (error) {
    //     console.error("list  entity error" + error.message);
    //   });
  }
  informationPanelList() {
    // TODO:
    return informationTiles();
    // return this.axios
    //   .get(`/api/dashboard`, {
    //     headers: { "Content-type": "application/json; charset=UTF-8" },
    //     spinner: true,
    //   })
    //   .then((response) => {
    //     return response.data;
    //   })
    //   .catch(function (error) {
    //     console.error("list  entity error" + error.message);
    //   });
  }
  add(dashboard) {
    //validate
    // TODO:
    dashboard.id = Math.floor(Math.random() * 150);
    return new Promise((resolve) => {
      resolve(dashboard.id);
    });
  }

  async listHeatMap() {
    return null;
  }
  async getHeatMap(id) {
    return id;
  }
  delete(id) {
    //validate
    // TODO:
    return new Promise((resolve) => {
      resolve(id);
    });

    // return this.axios
    //   .get(`/api/dashboard`, {
    //     headers: { "Content-type": "application/json; charset=UTF-8" },
    //     spinner: true,
    //   })
    //   .then((response) => {
    //     return response.data;
    //   })
    //   .catch(function (error) {
    //     console.error("list  entity error" + error.message);
    //   });
  }
  addHeatMap(heatmap) {
    console.info(heatmap);
  }
}
