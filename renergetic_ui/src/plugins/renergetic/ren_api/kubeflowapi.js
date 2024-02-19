import RestComponent from "./restcomponent";
export default class KubeflowApi extends RestComponent {
  BASE_URL = "/api/kubeflow";
  constructor(axiosInstance, vueInstance, baseUrl) {
    super(axiosInstance, vueInstance);
    if (baseUrl) this.BASE_URL = baseUrl;
  }

  list() {
    return this.get(`${this.BASE_URL}/workflow`);
  }
  adminList({ visible = null }) {
    console.info(visible);
    let args = this.parseArgs({ visible: visible });
    return this.get(`${this.BASE_URL}/admin/workflow?${args}`);
  }
  showExperiment(experimentId) {
    return this.put(`${this.BASE_URL}/admin/workflow/${experimentId}/visibility`);
  }
  hideExperiment(experimentId) {
    return this.delete(`${this.BASE_URL}/admin/workflow/${experimentId}/visibility`);
  }
  getExperimentRun(experimentId) {
    return this.get(`${this.BASE_URL}/workflow/${experimentId}/run`);
  }
  startExperiment(experimentId, experimentParams) {
    return this.post(`${this.BASE_URL}/workflow/${experimentId}/run`, experimentParams);
  }
  stopExperiment(experimentId) {
    return this.delete(`${this.BASE_URL}/workflow/${experimentId}/run`);
  }

  // setCurrentRequest(request) {
  //   return this.post(`/api/hdr/requests`, request);
  // }

  // deleteRequest(requestTimestamp) {
  //   return this.delete(`/api/hdr/requests?t=${requestTimestamp}`);
  // }
}
