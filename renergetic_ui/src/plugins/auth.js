import Keycloak from "keycloak-js";
import axios from "axios";

axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers.post["Access-Control-Allow-Credentials"] = "true";
axios.defaults.headers.post["Access-Control-Allow-Methods"] = "GET, POST, DELETE, OPTIONS";
axios.defaults.headers.post["Access-Control-Allow-Headers"] = "DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type, Origin";
axios.defaults.headers.post["Content-Type"] = "application/json";

axios.defaults.headers.delete["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers.delete["Access-Control-Allow-Credentials"] = "true";
axios.defaults.headers.delete["Access-Control-Allow-Methods"] = "GET, POST, DELETE, OPTIONS";
axios.defaults.headers.delete["Access-Control-Allow-Headers"] = "DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type, Origin";
axios.defaults.headers.delete["Content-Type"] = "application/json";

// https://www.keycloak.org/docs/11.0/securing_apps/#usage-2
//https://stackoverflow.com/questions/65398657/keycloak-and-node-js-how-to-keep-user-logged-in-after-keycloak-access-token-get
// var session = require("express-session");
// var memoryStore = new session.MemoryStore();
let initOptions = {
  url: process.env.VUE_APP_KEY_CLOAK_URL,
  realm: process.env.VUE_APP_KEY_CLOAK_REALM,
  clientId: process.env.VUE_APP_KEY_CLOAK_CLIENT_ID,
};

// const appName = "vue-test";
// let keycloak = Keycloak({ store: memoryStore }, initOptions);
let keycloak = Keycloak(initOptions);
var initialized = false;
let info = {
  app: process.env.VUE_APP_KEY_CLOAK_CLIENT_ID,
  realm: process.env.VUE_APP_KEY_CLOAK_REALM,
  url: process.env.VUE_APP_KEY_CLOAK_URL,
  clientId: undefined,
}
export default function (Vue) {
  keycloak
    .init({
      // onLoad: "login-required",
      onLoad: "check-sso",
      checkLoginIframe: false,
    })
    .then(async (_authenticated) => {
      // Vue.config.globalProperties.authenticated = _authenticated;
      keycloak.authenticated = _authenticated ? true : false;
      console.info(keycloak.authenticated);
      initialized = true;
      if (_authenticated) {
        var accountRoles = null;
        var realmRoles = null;
        if (keycloak.resourceAccess && keycloak.resourceAccess.account) {
          accountRoles = keycloak.resourceAccess.account.roles;
        } else {
          accountRoles = null;
        }
        if (keycloak.realmAccess) {
          realmRoles = keycloak.realmAccess.roles;
        } else {
          realmRoles = null;
        }
        const data = {
          authenticated: keycloak.authenticated,
          appRoles: keycloak.resourceAccess, //[appName].roles,
          accountRoles: accountRoles,
          realmRoles: realmRoles,
          clientId: info.clientId,
        };
        Vue.config.globalProperties.$store.commit("auth/set", data);
      }
    })
    .catch((e) => {
      console.log("failed to initialize ", e);
      window.location.reload(); // Apparently needed to get initialized
    });
  // Vue.component("keycloak", keycloak);
  return {
    logout() {
      keycloak.logout({ redirectUri: window.location.origin });
      localStorage.setItem("data", null);
    },
    // instance: keycloak,
    // initialized: initialized,
    isInitialized() {
      console.info("test: " + initialized);
      return initialized;
    },
    get() {
      return keycloak;
    },
    async getClientRoles() {
      let config = {
        headers: { Authorization: "Bearer " + keycloak.token },
      };
      return axios.get(`${info.url}/admin/realms/${info.realm}/clients/${info.clientId}/roles`, config).then((res) => {
          return res.data;
        })
        .catch((error) => {
          console.warn(error.message);
          console.warn(`No se puede conectar a ${info.url}`);
        });
    },
    // KEYCLOAK API CALLS
    //  Manage Clients Methods
    async getClientId() {
      let config = {
        headers: { Authorization: "Bearer " + keycloak.token },
      };
      return axios.get(`${info.url}/admin/realms/${info.realm}/clients?clientId=${info.app}`, config);
    },
    //  Manage Users Methods
    async getUsers() {
      let config = {
        headers: { Authorization: "Bearer " + keycloak.token },
        params: { clientId: info.app },
      };
      return axios.get(`${info.url}/admin/realms/${info.realm}/users`, config).then(async (res) => {
          if (res.data && res.data.length > 0) {
            let users = Array();
            for (const user of res.data) {
              users.push({
                id: user.id,
                username: user.username,
                name: `${user.firstName && user.lastName?`${user.firstName} ${user.lastName}`: ''}`,
                email: user.email,
                roles: await this.getUserRoles(user.id),
              });
            }
            console.log("users ",users);
            return users;
          }
        })
        .catch((error) => {
          console.warn(error.message);
          console.warn(`No se puede conectar a ${info.url}`);
        });
    },
    async getUserRoles(user_id) {
      let config = {
        headers: { Authorization: "Bearer " + keycloak.token },
      };
      return axios.get(`${info.url}/admin/realms/${info.realm}/users/${user_id}/role-mappings/clients/${info.clientId}`, config).then((res) => {
          return res.data;
        })
        .catch((error) => {
          console.warn(error.message);
          console.warn(`No se puede conectar a ${info.url}`);
        });
    },
    assignRolesToUser(userId, body) {
      let config = {
        headers: { Authorization: "Bearer " + keycloak.token },
        Accept: "*/*",
        "Content-Type": "application/json",
      };
      axios.post(`${info.url}/admin/realms/${info.realm}/users/${userId}/role-mappings/clients/${info.clientId}`, body,config)
        .then((res) => {
          return res;
        })
        .catch((error) => {
          console.warn(error.message);
          console.warn(`No se puede conectar a ${info.url}`);
        });
    },
    unAssignRolesToUser(userId, body) {
      let config = {
        headers: {
          Authorization: "Bearer " + keycloak.token,
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        data: body,
      };
      axios.delete(`${info.url}/admin/realms/${info.realm}/users/${userId}/role-mappings/clients/${info.clientId}`, config)
        .then((res) => {
          return res;
        })
        .catch((error) => {
          console.warn(error.message);
          console.warn(`No se puede conectar a ${info.url}`);
        });
    },
    async createUser(body) {
      let config = {
        headers: { Authorization: "Bearer " + keycloak.token },
        Accept: "*/*",
        "Content-Type": "application/json",
      };
      return axios.post(`${info.url}/admin/realms/${info.realm}/users`, body, config);
    },
    async deleteUser(userId) {
      let config = {
        headers: { Authorization: "Bearer " + keycloak.token },
        Accept: "*/*",
        "Content-Type": "application/json",
      };
      return axios.delete(`${info.url}/admin/realms/${info.realm}/users/${userId}`, config);
    },
  };
}
