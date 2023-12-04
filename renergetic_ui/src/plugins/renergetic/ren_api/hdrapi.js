import RestComponent from "./restcomponent";
export default class HDRAPI extends RestComponent {
  constructor(axiosInstance, vueInstance) {
    super(axiosInstance, vueInstance);
  }
  getCurrentRecommendations() {
    return this.get(`/api/hdr/recommendations/current`);
  }
  getRecommendationsMeasurements(id) {
    return this.get(`/api/hdr/recommendations/id/${id}/measurements`);
  }

  getCurrentRequest() {
    return this.get(`/api/hdr/requests/current`);
  }

  setCurrentRequest(request) {
    return this.post(`/api/hdr/requests`, request);
  }

  deleteRequest(requestTimestamp) {
    return this.delete(`/api/hdr/requests?t=${requestTimestamp}`);
  }
}
