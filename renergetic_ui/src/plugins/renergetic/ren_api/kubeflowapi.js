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

  // setCurrentRequest(request) {
  //   return this.post(`/api/hdr/requests`, request);
  // }

  // deleteRequest(requestTimestamp) {
  //   return this.delete(`/api/hdr/requests?t=${requestTimestamp}`);
  // }
}
