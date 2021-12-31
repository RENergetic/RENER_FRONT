export default {
  namespaced: true,
  state: {
    dashboards: {},
    locationList: ["en-EN"],
  },
  mutations: {
    dashboards(state, payload) {
      // console.info(payload);
      state.dashboards = payload;
    },
    locationList(state, payload) {
      // console.info(payload);
      state.locationList = payload;
    },
  },
  getters: {
    locationList: (state /* getters*/) => {
      return state.locationList;
    },
  },
};
