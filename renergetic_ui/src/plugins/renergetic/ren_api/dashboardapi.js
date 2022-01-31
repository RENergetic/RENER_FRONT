import RestComponent from "./restcomponent";
import { informationPanels } from "../../../assets/dummy/dashboard";
export default class DashboardApi extends RestComponent {
  urlHost;
  constructor(axiosInstance, vueInstance, urlHost) {
    super(axiosInstance, vueInstance);
    this.urlHost = urlHost;
  }
  //DASHBOARDS REQUESTS
  list() {
    // TODO:
    return this.axios
      .get(`${this.urlHost}/api-postgre/1.0/api/dashboard`, {
        headers: { "Content-type": "application/json; charset=UTF-8" },
      })
      .then((response) => {
        return response.data;
      })
      .catch(function (error) {
        console.error("list entity error" + error.message);
      });
  }
  get(id) {
    return this.axios
      .get(`${this.urlHost}/api-postgre/1.0/api/dashboard/${id}`, {
        headers: { "Content-type": "application/json; charset=UTF-8" },
      })
      .then((response) => {
        return response.data;
      })
      .catch(function (error) {
        console.error("list entity error" + error.message);
      });
  }
  add(dashboard) {
    //validate
    // TODO:
    return this.axios
      .post(`${this.urlHost}/api-postgre/1.0/api/dashboard`, dashboard, {
        headers: { "Content-type": "application/json; charset=UTF-8" },
      })
      .then((response) => {
        return response.data;
      })
      .catch(function (error) {
        console.error("add entity error" + error.message);
      });
  }
  update(dashboard) {
    //validate
    // TODO:
    return this.axios
      .put(`${this.urlHost}/api-postgre/1.0/api/dashboard`, dashboard, {
        headers: { "Content-type": "application/json; charset=UTF-8" },
      })
      .then((response) => {
        return response.data;
      })
      .catch(function (error) {
        console.error("add entity error" + error.message);
      });
  }
  delete(id) {
    return this.axios
      .delete(`${this.urlHost}/api-postgre/1.0/api/dashboard/${id}`, {
        headers: { "Content-type": "application/json; charset=UTF-8" },
      })
      .then((response) => {
        return response.data;
      })
      .catch(function (error) {
        console.error("delete entity error" + error.message);
      });
  }
  // INFORMATION PANEL REQUESTS
  getInformationPanel(panelId) {
    console.info(panelId);
    // TODO:
    return new Promise((resolve) => {
      resolve(informationPanels);
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
  informationPanelList() {
    // TODO:
    return new Promise((resolve) => {
      resolve(informationPanels);
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
  // HEATMAP REQUESTS
  async listHeatMap() {
    return null;
  }
  async getHeatMap(id) {
    return id;
  }
  addHeatMap(heatmap) {
    console.info(heatmap);
  }
}
