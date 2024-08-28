import RestComponent from "./restcomponent";
const HDR_KUBEFLOW_PIPELINE = "hdr_pipeline";
const HDR_KUBEFLOW_DEFAULT_PIPELINE = "hdr_default_pipeline";
export default class KubeflowApi extends RestComponent {
  BASE_URL = "/api/kubeflow";
  constructor(axiosInstance, vueInstance) {
    super(axiosInstance, vueInstance);
  }

  list() {
    return this.get(`${this.BASE_URL}/pipeline`);
  }
  listHDRPipelines() {
    let value = "true";
    //Get by property
    return this.get(`${this.BASE_URL}/pipeline/property/${HDR_KUBEFLOW_PIPELINE}/value/${value}`);
  }
  adminList({ visible = null }) {
    // console.info(visible);
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

  setHDRPipeline(pipelineId, isEnabled) {
    var prop = { key: HDR_KUBEFLOW_PIPELINE, value: isEnabled ? "true" : "false", type: "boolean" };
    return this.post(`${this.BASE_URL}/admin/pipeline/${pipelineId}/property`, prop);
  }

  setDefaultHDRPipeline(pipelineId) {
    let value = "true";
    var prop = { key: HDR_KUBEFLOW_DEFAULT_PIPELINE, value: value, type: "boolean" };
    let args = this.parseArgs({ unique: true });
    // return this.put(`${this.BASE_URL}/pipeline/${pipelineId}/property/${HDR_KUBEFLOW_DEFAULT_PIPELINE}/value/${vłalue}?${args}`);
    return this.post(`${this.BASE_URL}/admin/pipeline/${pipelineId}/property?${args}`, prop);
  }

  getHDRPipeline() {
    let value = "true";
    return this.get(`${this.BASE_URL}/pipeline/property/${HDR_KUBEFLOW_PIPELINE}/value/${value}`);
  }

  async getDefaultHDRPipeline() {
    let value = "true";
    var resp = await this.get(`${this.BASE_URL}/pipeline/property/${HDR_KUBEFLOW_DEFAULT_PIPELINE}/value/${value}`);
    if (resp) {
      return resp[0];
    }
    return null;
  }
  getExperimentRun(pipelineId) {
    return this.get(`${this.BASE_URL}/pipeline/${pipelineId}/run`);
  }

  listRuns({ pipelineId, from = null, to = null }) {
    let args = this.parseArgs({ from: from, to: to });
    return this.get(`${this.BASE_URL}/pipeline/${pipelineId}/runs?${args}`);
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
