import RestComponent from "./restcomponent";
// const USER_API_KEY = "user_api";
// const SETTINGS_KEY = "settings";
export default class UserApi extends RestComponent {
  constructor(axiosInstance, vueInstance) {
    super(axiosInstance, vueInstance);
  }
  getProfile() {
    return this.get(`/api/users/profile`);
  }
  async listUsers(role = undefined, offset = 0, limit = 20) {
    let params = { role: role, offset: offset, limit: limit };
    return this.get(`/api/users`, params);
  }
  async assignRole(userId, role) {
    return this.put(`/api/users/${userId}/roles/${role}`);
  }
  async revokeRole(userId, role) {
    return this.delete(`/api/users/${userId}/roles/${role}`);
  }
  async getRoles(userId) {
    return this.get(`/api/users/${userId}/roles`);
  }
  getNotifications() {
    return this.get(`/api/users/notifications`);
  }

  async setSettings(settings) {
    return this.post(`/api/users/profile/settings`, JSON.stringify(settings));
  }
  async getSettings() {
    return this.get(`/api/users/profile/settings`);
  }
  // TODO: implement
  // async getDemad(userId) {}

  // async getAssets(){
  // todo:
  // }
  register(user) {
    //validate
    // TODO:
    return this.post(`/api-postgre/1.0/api/users/register`, user);
  }
  getByUsername(userName) {
    //validate
    // TODO:
    return this.get(`/api-postgre/1.0/api/users/info/keycloak_name`, { value: userName })
      .then((data) => {
        console.log(data);
        return data[0];
      })
      .catch(function (error) {
        console.error(error.response);
      });
  }

  // async getNotifications(objectIds) {

  //   return objectIds;
  // }
}
