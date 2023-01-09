import { createStore } from "vuex";
import auth from "./modules/auth";
import view from "./modules/view";
import settings from "./modules/settings";
import { DefaultSettings } from "./modules/settings";
import createPersistedState from "vuex-persistedstate";
export default createStore({
  state: {},
  mutations: {
    settings(state, payload) {
      let settings = JSON.parse(JSON.stringify(DefaultSettings));
      try {
        settings = { ...settings, ...payload };
      } catch (e) {
        console.info(`load settings error ${e}`);
      }

      console.info(settings);
      state.settings = settings;
    },
  },
  getters: {
    settings: (state) => {
      console.info(state.settings);
      return state.settings;
    },
  },
  actions: {},
  modules: { auth, view, settings },

  plugins: [
    createPersistedState({
      paths: ["auth", "view", "settings"],
      storage: window.sessionStorage,
    }),
  ],
});
