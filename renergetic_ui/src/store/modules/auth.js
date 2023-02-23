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
      console.info("set token auth: " + payload);
      state.data.token = payload;
    },
    /**
     * set keyclock auth details
     * @param {*} state
     * @param {*} payload -> keyclock object
     */
    set(state, payload) {
      console.info("set auth: " + payload.token);
      if (payload != null && payload.appRoles != null) {
        let roles = payload.appRoles[process.env.VUE_APP_KEY_CLOAK_CLIENT_ID].roles;
        let role = RenRoles.REN_GUEST;
        roles.forEach((it) => {
          role = role | RenRoles[it];
        });
        payload.renRole = role;
      }
      state.data = payload;
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
      try {
        if (state.data.renRole) return state.data.renRole;
        return RenRoles.REN_GUEST;
      } catch (error) {
        return RenRoles.REN_GUEST;
      }
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
