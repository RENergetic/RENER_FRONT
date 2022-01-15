import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/Home.vue";
import dashboardRoutes from "./dashboard";
//todo import other
const routes = [
  {
    path: "/",
    name: "Home",
    meta: {
      isAuthenticated: false,
    },
    component: HomePage,
  },
  {
    path: "/about",
    name: "RenAbout",
    meta: {
      isAuthenticated: true,
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/RenAbout.vue"),
  },
  {
    path: "/profile/:username?",
    name: "Profile",
    meta: { isAuthenticated: true },
    component: () => import("../views/user/Profile.vue"),
  },
  {
    path: "/unauthorized",
    name: "Unauthorized",
    meta: { isAuthenticated: false },
    component: () => import("../views/RenAbout.vue"),
  },
  ...dashboardRoutes,
];
function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function (Vue) {
  const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
  });

  router.beforeEach(async (to, from) => {
    to.meta.from = from;
    if (to.meta.isAuthenticated) {
      let keycloak = Vue.config.globalProperties.$keycloak;
      if (!keycloak.isInitialized()) {
        await timeout(5000);
        if (!keycloak.isInitialized()) {
          console.info("Keycloak is not initialized");
          return false;
        }
      } else {
        console.info("no timeout");
      }
      keycloak = keycloak.get();
      console.info(keycloak.authenticated);
      // Get the actual url of the app, it's needed for Keycloak
      // const basePath = window.location.toString();
      if (!keycloak.authenticated) {
        const basePath = window.location.toString();
        var path = basePath; // basePath.slice(0, -1) + to.path;
        // The page is protected and the user is not authenticated. Force a login.
        //"http://localhost:8080" + to.path
        keycloak.login({ redirectUri: path });
        return false;
      } else if (keycloak.hasResourceRole("vue-test") || 1 == 1) {
        //TODO: clear or
        // The user was authenticated, and has the app role
        return await keycloak
          .updateToken(70)
          .then(() => {
            return true;
          })
          .catch((err) => {
            console.error(err);
            return false;
          });
      } else {
        return { name: "Unauthorized" };
      }
    } else {
      // This page did not require authentication
      // return true;
    }
  });
  return router;
}

// router.beforeEach(async (to, from, next) => {
//   if (to.meta.isAuthenticated) {
//     let keycloak = Vue.config.globalProperties.$keycloak;

//     if (!keycloak.isInitialized()) {
//       console.info("timeout");
//       console.info(new Date());
//       return;
//       // await timeout(5000);
//       // if (!keycloak.isInitialized()) {
//       //   console.info("is not initialized");
//       //   next({ name: from.name });
//       // }
//       // console.info(keycloak.isInitialized());
//       // console.info(new Date());
//     } else {
//       console.info("no timeout");
//     }
//     keycloak = keycloak.get();
//     console.info(keycloak.authenticated);
//     // Get the actual url of the app, it's needed for Keycloak
//     // const basePath = window.location.toString();
//     if (!keycloak.authenticated) {
//       // const basePath = window.location.toString();
//       // alert("axxa" + basePath.slice(0, -1) + to.path);
//       // The page is protected and the user is not authenticated. Force a login.
//       alert(location.host + to.path);
//       await timeout(100);
//       keycloak.login({ redirectUri: "http://localhost:8080" + to.path }); //{ redirectUri: basePath.slice(0, -1) + to.path });
//     } else if (keycloak.hasResourceRole("vue-test") || 1 == 1) {
//       // The user was authenticated, and has the app role
//       keycloak
//         .updateToken(70)
//         .then(() => {
//           next();
//         })
//         .catch((err) => {
//           console.error(err);
//         });
//     } else {
//       // The user was authenticated, but did not have the correct role
//       // Redirect to an error page
//       next({ name: "Unauthorized" });
//     }
//   } else {
//     // This page did not require authentication
//     next();
//   }
// });
