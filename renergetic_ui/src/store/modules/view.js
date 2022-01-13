export default {
  namespaced: true,
  state: {
    dashboards: [],
    informationPanels: [],
    locationList: ["en-EN"],
  },
  mutations: {
    dashboards(state, payload) {
      // console.info(payload);
      state.dashboards = payload;
    },
    informationPanels(state, payload) {
      state.informationPanels = payload;
    },
    dashboardsAdd(state, payload) {
      //TODO: verify if there is no duplicate id
      state.dashboards.push(payload);
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
    dashboards: (state /* getters*/) => {
      return state.dashboards;
    },
    informationPanels: (state /* getters*/) => {
      return state.dashboards;
    },
  },
};
