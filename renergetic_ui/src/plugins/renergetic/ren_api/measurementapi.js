import RestComponent from "./restcomponent";
export default class DashboardApi extends RestComponent {
  constructor(axiosInstance, vueInstance) {
    super(axiosInstance, vueInstance);
  }

  attributes(areas) {
    //areas - id list
    console.info(areas);
  }
  async getMeasurements(objectIds) {
    console.info(objectIds);
  }
  async getCurrentMeasurements(objectIds) {
    console.info(objectIds);
  }
  async getNotifications(objectIds) {
    console.info(objectIds);
  }
}
