import { RenRoles } from "../../plugins/model/Enums";
export default {
  namespaced: true,
  state: {
    data: {
      //#region keyclock data:
      authenticated: false,
      appRoles: null,
      accountRoles: null,
      realmRoles: null,
      //#endregion
      //role mask
      renRole: RenRoles.REN_GUEST,
    },
    // role:null,
  },
  mutations: {
    reset(state) {
      console.info("reset auth");
      state.data = {
        authenticated: false,
        appRoles: null,
        accountRoles: null,
        realmRoles: null,
        renRole: RenRoles.REN_GUEST,
      };
    },
    token(state, payload) {
      if (!payload) {
        return;
      }
      // console.debug("set token auth: " + payload.token);
      console.debug("set token auth ");
      state.data.token = payload.token;
      state.data.tokenExp = payload.exp;
    },
    /**
     * set keyclock auth details
     * @param {*} state
     * @param {*} payload -> keyclock object
     */
    set(state, payload) {
      let roles = ["ren-guest"];

      if (payload != null && payload.appRoles != null) {
        if (payload.appRoles[process.env.VUE_APP_KEY_CLOAK_CLIENT_ID] && payload.appRoles[process.env.VUE_APP_KEY_CLOAK_CLIENT_ID].roles)
          roles = payload.appRoles[process.env.VUE_APP_KEY_CLOAK_CLIENT_ID].roles;
        let role = RenRoles.REN_GUEST;
        roles.forEach((it) => {
          role = role | RenRoles[it];
        });
        payload.renRole = role;
      }
      state.data = payload;
      if (payload.tokenParsed) state.data.tokenExp = payload.tokenParsed.exp * 1000;
    },
  },
  getters: {
    /**
     * get current user
     * @param {*} state
     * @returns
     */
    current: (state /* getters*/) => {
      return state.data;
    },
    /**
     * return role mask
     * @param {*} state
     * @returns
     */
    renRole: (state /* getters*/) => {
      // if (!state.data.authenticated) {
      //   throw new Exception("Not authenticated");
      // }
      try {
        if (state.data.renRole) return state.data.renRole;
        return RenRoles.REN_GUEST;
      } catch (error) {
        return RenRoles.REN_GUEST;
      }
    },
    /**
     * return role mask
     * @param {*} state
     * @returns
     */
    isAuthenticated: (state /* getters*/) => {
      return state.data.authenticated;
    },

    /**
     * return role mask
     * @param {*} state
     * @returns
     */
    isrenRole: (state /* getters*/) => {
      try {
        if (state.data.renRole) return state.data.renRole;
        return RenRoles.REN_GUEST;
      } catch (error) {
        return RenRoles.REN_GUEST;
      }
    },
    tokenExpired: (state) => {
      if (state.data && state.data.token) {
        return state.data.tokenExp < Date.now();
      }
      console.warn("No token");
      return false;
    },
    token: (state /* getters*/) => {
      try {
        return state.data.token;
      } catch (error) {
        return undefined;
      }
    },
  },
};
