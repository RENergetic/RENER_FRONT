export default {
  namespaced: true,
  state: {
    //TODO: default home settings
    home: {},
    heatmap: {},
    panel: {},
  },
  mutations: {
    home(state, payload) {
      state.home = payload;
    },
    panel(state, payload) {
      state.panel = payload;
    },
    heatmap(state, payload) {
      state.heatmap = payload;
    },
  },
  getters: {
    home: (state /* getters*/) => {
      return state.home;
    },
    panel: (state /* getters*/) => {
      return state.panel;
    },
    heatmap: (state) => {
      return state.heatmap;
    },
  },
};
