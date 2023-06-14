import { createStore } from "vuex";
import auth from "./modules/auth";
import view from "./modules/view";
import slideshow from "./modules/slideshow";
import settings, { DefaultSettings } from "./modules/settings";
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

      console.info("set settings: ");
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
  modules: { auth, view, settings, slideshow },

  plugins: [
    createPersistedState({
      paths: ["auth", "view", "settings", "slideshow"],
      storage: window.sessionStorage,
    }),
  ],
});
