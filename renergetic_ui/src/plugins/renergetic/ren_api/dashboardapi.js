import RestComponent from "./restcomponent";
import { dummyList } from "../../../assets/dummy/dashboard";
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
  add(dashboard) {
    //validate
    // TODO:
    dashboard.id = Math.floor(Math.random() * 150);
    return dashboard.id;
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
  delete(id) {
    //validate
    // TODO:

    return id;
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
}
