export default {
  namespaced: true,
  state: {
    //TODO: default home settings
    home: {},
  },
  mutations: {
    home(state, payload) {
      state.home = payload;
    },
  },
  getters: {
    home: (state /* getters*/) => {
      return state.home;
    },
  },
};
