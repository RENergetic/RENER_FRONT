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
  async getDemands() {
    return await this.get(`/api/users/demands`);
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
  addUser(user) {
    return this.post(`/api/users`, user);
  }
  updateUser(user) {
    return this.put(`/api/users/${user.id}`, user, null, null, (e) => {
      if (e.response.status == 404) {
        this.emitError(`User ${user.id} not found: ${e.message}`, {
          code: "user_not_found",
          args: [user.id],
        });
        return true;
      }
    });
    // return this.post(`/api-postgre/1.0/api/users/register`, user);
  }
  deleteUser(userId) {
    return this.delete(`/api/users/${userId}`, null, null, (e) => {
      if (e.response.status == 404) {
        this.emitError(`User ${userId} not found: ${e.message}`, {
          code: "user_not_found",
          args: [userId],
        });
        return true;
      }
    });
    // return this.post(`/api-postgre/1.0/api/users/register`, user);
  }

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
