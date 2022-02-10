export default {
  namespaced: true,
  state: {
    //TODO: default home settings
    home: {},
    heatmap: {},
  },
  mutations: {
    home(state, payload) {
      state.home = payload;
    },
    heatmap(state, payload) {
      state.heatmap = payload;
    },
  },
  getters: {
    home: (state /* getters*/) => {
      return state.home;
    },
    heatmap: (state) => {
      return state.heatmap;
    },
  },
};
