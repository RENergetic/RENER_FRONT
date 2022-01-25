import RestComponent from "./restcomponent";
export default class DashboardApi extends RestComponent {
  constructor(axiosInstance, vueInstance) {
    super(axiosInstance, vueInstance);
  }

  attributes(areas) {
    //areas - id list
    console.info(areas);
  }
  async measurements(objectIds) {
    console.info(objectIds);
  }
}
