import Keycloak from "keycloak-js";
// https://www.keycloak.org/docs/11.0/securing_apps/#usage-2
//https://stackoverflow.com/questions/65398657/keycloak-and-node-js-how-to-keep-user-logged-in-after-keycloak-access-token-get
// var session = require("express-session");
// var memoryStore = new session.MemoryStore();
let initOptions = {
  url: process.env.VUE_APP_KEY_CLOAK_URL,
  realm: process.env.VUE_APP_KEY_CLOAK_REALM,
  clientId: process.env.VUE_APP_KEY_CLOAK_CLIENT_ID,
  onLoad: "login-required",
};

// const appName = "vue-test";
// let keycloak = Keycloak({ store: memoryStore }, initOptions);
let keycloak = Keycloak(initOptions);
var initialized = false;
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
        };
        Vue.config.globalProperties.$store.commit("auth/set", data);
      }
    })
    .catch((e) => {
      console.log("failed to initialize ", e);
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
  };
}

// keycloak
//   .init({ onLoad: initOptions.onLoad })
//   .then((auth) => {
//     if (!auth) {
//       window.location.reload();
//     } else {
//       Vue.$log.info("Authenticated");

//       new Vue({
//         el: "#app",
//         render: (h) => h(App, { props: { keycloak: keycloak } }),
//       });
//     }

//     //Token Refresh
//     setInterval(() => {
//       keycloak
//         .updateToken(70)
//         .then((refreshed) => {
//           if (refreshed) {
//             Vue.$log.info("Token refreshed" + refreshed);
//           } else {
//             Vue.$log.warn(
//               "Token not refreshed, valid for " +
//               Math.round(
//                 keycloak.tokenParsed.exp +
//                 keycloak.timeSkew -
//                 new Date().getTime() / 1000
//               ) +
//               " seconds"
//             );
//           }
//         })
//         .catch(() => {
//           Vue.$log.error("Failed to refresh token");
//         });
//     }, 6000);
//   })
//   .catch(() => {
//     Vue.$log.error("Authenticated Failed");
//   });
