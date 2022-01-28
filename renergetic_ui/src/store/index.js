import { createStore } from "vuex";
import auth from "./modules/auth";
import view from "./modules/view";
import createPersistedState from "vuex-persistedstate";
export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: { auth, view },

  plugins: [
    createPersistedState({
      paths: ["auth", "view"],
      storage: window.sessionStorage,
    }),
  ],
});
