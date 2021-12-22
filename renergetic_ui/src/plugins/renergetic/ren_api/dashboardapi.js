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
}
