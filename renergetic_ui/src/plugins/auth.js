import Keycloak from "keycloak-js";
import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.delete["Content-Type"] = "application/json";
// axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
// axios.defaults.headers.common["Access-Control-Allow-Credentials"] = true;

//TODO: translate to english
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

// var initialized = false;
// let info = {
//   app: process.env.VUE_APP_KEY_CLOAK_CLIENT_ID,
//   realm: process.env.VUE_APP_KEY_CLOAK_REALM,
//   url: process.env.VUE_APP_KEY_CLOAK_URL,
//   clientId: undefined,
// };
export default function (Vue) {
  let keycloak = Keycloak(initOptions);
  keycloak
    .init({
      // onLoad: "login-required",
      onLoad: "check-sso",
      checkLoginIframe: false,
    })
    .then(async (_authenticated) => {
      // Vue.config.globalProperties.authenticated = _authenticated;
      keycloak.authenticated = _authenticated ? true : false;
      console.info(`keycloak authenticated: ${keycloak.authenticated}`);
      // initialized = true;
      if (_authenticated) {
        var accountRoles = null;
        var realmRoles = null;
        if (keycloak.resourceAccess && keycloak.resourceAccess.account) {
          accountRoles = keycloak.resourceAccess.account.roles;
        }
        if (keycloak.realmAccess) {
          realmRoles = keycloak.realmAccess.roles;
        }
        const data = {
          token: keycloak.token,
          authenticated: keycloak.authenticated,
          appRoles: keycloak.resourceAccess, //[appName].roles,
          accountRoles: accountRoles,
          realmRoles: realmRoles,
          clientId: keycloak.clientId,
        };

        Vue.config.globalProperties.$store.commit("auth/set", data);
        // let config = {
        //   headers: { Authorization: "Bearer " + keycloak.token },
        // };
        // await axios
        //   .get(`${info.url}/admin/realms/${info.realm}/clients?clientId=${info.app}`, config)
        //   .then((response) => (info.clientId = response.data[0].id))
        //   .catch((error) => {
        //     console.warn(error);
        //   });
      } else {
        //clear stored data
        Vue.config.globalProperties.$store.commit("auth/reset");
      }
      keycloak.initialized = true;
    })
    .catch((e) => {
      console.log("failed to initialize ", e);
      if (window.location.pathname != "/unauthorized") window.location = "/unauthorized";
    });
  // Vue.component("keycloak", keycloak);
  return {
    logout() {
      keycloak.logout({ redirectUri: window.location.origin });
      localStorage.setItem("data", null);
      sessionStorage.clear();
      localStorage.clear();
    },
    // instance: keycloak,
    // initialized: initialized,
    isInitialized() {
      return keycloak.initialized;
    },
    async get() {
      return await this.executeAfterInitialized(keycloak);
    },

    // hasAccess(assignedRoles, allowedRoles) {
    //   if (!allowedRoles || allowedRoles.length == 0) return true;
    //   else if (!assignedRoles || assignedRoles.length == 0) return false;
    //   for (var i = 0; i < allowedRoles.length; i++) {
    //     if (assignedRoles.indexOf(allowedRoles[i]) !== -1) return true;
    //   }
    //   return false;
    // },
    async executeAfterInitialized(keyclock) {
      const TRIES = 4;
      const TIME = 1500;
      // console.info(keyclock);
      return new Promise((resolve, reject) => {
        let tries = 0;
        // console.info(keycloak);
        // console.info(keycloak.initialized);
        const iteration = () => {
          if (keyclock.initialized) {
            resolve(keyclock);
          } else if (tries < TRIES) {
            console.info(`${new Date()}: wait for keycloak: ${tries + 1}/${TRIES} ${keyclock.initialized}`);
            setTimeout(iteration, TIME);
            tries += 1;
          } else {
            reject("Keycloak isn't initalized");
          }
        };
        iteration();
      });
    },
  };
}

// async getClientRoles() {
//   let config = {
//     headers: { Authorization: "Bearer " + keycloak.token },
//   };
//   return axios
//     .get(`${info.url}/admin/realms/${info.realm}/clients/${info.clientId}/roles`, config)
//     .then((res) => {
//       return res.data;
//     })
//     .catch((error) => {
//       console.warn(error.message);
//       console.warn(`No se puede conectar a ${info.url}`);
//     });
// },
// KEYCLOAK API CALLS
//  Manage Clients Methods
// async getClientId() {
//   let clientId;
//   let config = {
//     headers: { Authorization: "Bearer " + keycloak.token },
//   };
//   await axios
//     .get(`${info.url}/admin/realms/${info.realm}/clients?clientId=${info.app}`, config)
//     .then((response) => (clientId = response.data.id));

//   return clientId;
// },
//  Manage Users Methods
// async getUsers() {
//   let config = {
//     headers: { Authorization: "Bearer " + keycloak.token },
//     params: { clientId: info.app },
//   };
//   return axios
//     .get(`${info.url}/admin/realms/${info.realm}/users`, config)
//     .then(async (res) => {
//       if (res.data && res.data.length > 0) {
//         let users = Array();
//         for (let user of res.data) {
//           user.name = `${user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : ""}`;
//           user.roles = await this.getUserRoles(user.id);
//           users.push(user);
//         }
//         return users;
//       }
//     })
//     .catch((error) => {
//       console.warn(error.message);
//       console.warn(`No se puede conectar a ${info.url}`);
//     });
// },
// async getUserRoles(user_id) {
//   let config = {
//     headers: { Authorization: "Bearer " + keycloak.token },
//   };
//   return axios
//     .get(`${info.url}/admin/realms/${info.realm}/users/${user_id}/role-mappings/clients/${info.clientId}`, config)
//     .then((res) => {
//       return res.data;
//     })
//     .catch((error) => {
//       console.warn(error.message);
//       console.warn(`No se puede conectar a ${info.url}`);
//     });
// },
// assignRolesToUser(userId, body) {
//   let config = {
//     headers: { Authorization: "Bearer " + keycloak.token },
//     Accept: "*/*",
//     "Content-Type": "application/json",
//   };
//   axios
//     .post(
//       `${info.url}/admin/realms/${info.realm}/users/${userId}/role-mappings/clients/${info.clientId}`,
//       body,
//       config,
//     )
//     .then((res) => {
//       return res;
//     })
//     .catch((error) => {
//       console.warn(error.message);
//       console.warn(`No se puede conectar a ${info.url}`);
//     });
// },
// unAssignRolesToUser(userId, body) {
//   let config = {
//     headers: {
//       Authorization: "Bearer " + keycloak.token,
//       Accept: "*/*",
//     },
//     data: body,
//   };
//   axios
//     .delete(`${info.url}/admin/realms/${info.realm}/users/${userId}/role-mappings/clients/${info.clientId}`, config)
//     .then((res) => {
//       return res;
//     })
//     .catch((error) => {
//       console.warn(error.message);
//       console.warn(`No se puede conectar a ${info.url}`);
//     });
// },
// async createUser(body) {
//   let config = {
//     headers: { Authorization: "Bearer " + keycloak.token },
//     Accept: "*/*",
//     "Content-Type": "application/json",
//   };
//   return await axios.post(`${info.url}/admin/realms/${info.realm}/users`, body, config);
// },
// async updateUser(body) {
//   let config = {
//     headers: { Authorization: "Bearer " + keycloak.token },
//     Accept: "*/*",
//     "Content-Type": "application/json",
//   };
//   return await axios.put(`${info.url}/admin/realms/${info.realm}/users/${body.id}`, body, config);
// },
// async deleteUser(userId) {
//   let config = {
//     headers: { Authorization: "Bearer " + keycloak.token },
//     Accept: "*/*",
//     "Content-Type": "application/json",
//   };
//   return await axios.delete(`${info.url}/admin/realms/${info.realm}/users/${userId}`, config);
// },
