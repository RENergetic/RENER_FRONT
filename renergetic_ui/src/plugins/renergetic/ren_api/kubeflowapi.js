import RestComponent from "./restcomponent";
export default class KubeflowApi extends RestComponent {
  BASE_URL = "/api/kubeflow";
  constructor(axiosInstance, vueInstance, baseUrl) {
    super(axiosInstance, vueInstance);
    if (baseUrl) this.BASE_URL = baseUrl;
  }

  list() {
    return this.get(`${this.BASE_URL}/pipeline`);
  }
  adminList({ visible = null }) {
    console.info(visible);
    let args = this.parseArgs({ visible: visible });
    return this.get(`${this.BASE_URL}/admin/pipeline?${args}`);
  }
  showExperiment(pipelineId) {
    return this.put(`${this.BASE_URL}/admin/pipeline/${pipelineId}/visibility`);
  }
  hideExperiment(pipelineId) {
    return this.delete(`${this.BASE_URL}/admin/pipeline/${pipelineId}/visibility`);
  }
  setParameters(pipelineId, parameters) {
    return this.put(`${this.BASE_URL}/admin/pipeline/${pipelineId}/parameters`, parameters);
  }
  getExperimentRun(pipelineId) {
    return this.get(`${this.BASE_URL}/pipeline/${pipelineId}/run`);
  }
  startExperiment(pipelineId, experimentParams) {
    return this.post(`${this.BASE_URL}/pipeline/${pipelineId}/run`, experimentParams);
  }
  stopExperiment(pipelineId) {
    return this.delete(`${this.BASE_URL}/pipeline/${pipelineId}/run`);
  }

  // setCurrentRequest(request) {
  //   return this.post(`/api/hdr/requests`, request);
  // }

  // deleteRequest(requestTimestamp) {
  //   return this.delete(`/api/hdr/requests?t=${requestTimestamp}`);
  // }
}
