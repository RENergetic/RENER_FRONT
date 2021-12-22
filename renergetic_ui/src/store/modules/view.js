export default {
  namespaced: true,
  state: {
    dashboards: {},
  },
  mutations: {
    dashboards(state, payload) {
      // console.info(payload);
      state.dashboards = payload;
    },
  },
  getters: {
    dashboards: (state /* getters*/) => {
      return state.dashboards;
    },
  },
};
