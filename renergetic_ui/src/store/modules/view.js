export default {
  namespaced: true,
  state: {
    // graphana dashboards
    dashboards: [],
    // list of featured information panels: todo:
    informationPanels: [],
    // list of featured user assets
    assets: [],
    // list of featured user assets
    assetPanels: [],
    demands: [],
    data: [],
    locationList: ["en-EN"],
  },
  mutations: {
    wrapper(state, payload) {
      let getF = (key, defaultValue) => (payload[key] ? payload[key] : defaultValue);
      state.informationPanels = getF("panels", []);
      state.assets = getF("assets", []);
      // state.state =  getF("state",[]);
      state.data = getF("data", []);
      state.assetPanels = getF("asset_panels", []);
      state.dashboards = getF("dashboards", []);
      state.demands = getF("demands", []);
      // _this.app.$store.commit("view/wrapper", data["assets"]);
      // _this.app.$store.commit("view/assetPanels", data["asset_panels"]);
      // _this.app.$store.commit("view/informationPanels", data["panels"]);
      // _this.app.$store.commit("view/demands", data["demands"]);
      // _this.app.$store.commit("view/data", data["data"]);
    },
    dashboards(state, payload) {
      // console.info(payload);
      state.dashboards = payload;
    },
    informationPanels(state, payload) {
      state.informationPanels = payload;
    },
    assets(state, payload) {
      state.assets = payload;
    },
    data(state, payload) {
      state.data = payload;
    },
    demands(state, payload) {
      state.demands = payload;
    },
    assetPanels(state, payload) {
      state.assetPanels = payload;
    },

    // Requires a Dashboard object ({id:0, name:"", url:"", label:""})
    //TODO: i suggest to add single dashboard via REST API and than download new list - so we have coherent state with the backend.
    // Issue: connection error -> user creates dashboard and might lose it because there is no internet connection
    dashboardsAdd(state, payload) {
      //TODO: verify if there is no duplicate id
      let duplicated = false;
      for (let dashboard of state.dashboards) {
        if (dashboard.id != undefined && payload.id != undefined && dashboard.id == payload.id) duplicated = true;
      }
      if (!duplicated) state.dashboards.push(payload);
    },
    // Requires a Dashboard
    dashboardsUpdate(state, payload) {
      if (payload.id != undefined)
        for (let i = 0; i < state.dashboards.length; i++) {
          if (state.dashboards[i].id == payload.id) {
            state.dashboards.splice(i, 1);
            state.dashboards.push(payload);
          }
        }
    },
    // Requires a Dashboard Id
    dashboardsDel(state, payload) {
      for (let i = 0; i < state.dashboards.length; i++) {
        if (state.dashboards[i].id == payload) {
          state.dashboards.splice(i, 1);
        }
      }
    },
    locationList(state, payload) {
      // console.info(payload);
      state.locationList = payload;
    },
  },
  getters: {
    wrapper: (state) => {
      return state;
    },
    locationList: (state /* getters*/) => {
      return state.locationList;
    },
    dashboards: (state /* getters*/) => {
      return state.dashboards;
    },
    assets: (state /* getters*/) => {
      return state.assets;
    },
    demands: (state /* getters*/) => {
      return state.demands;
    },
    data: (state /* getters*/) => {
      return state.data;
    },
    assetPanels: (state /* getters*/) => {
      return state.assetPanels;
    },
    informationPanels: (state /* getters*/) => {
      return state.informationPanels;
    },
  },
};
