export var DefaultSettings = {
  locales: {},

  home: {
    feedbackVisibility: false,
    notificationVisibility: false,
    demandVisibility: true,
    panelVisibility: true,
  },
  homeLayout: {
    // demandTile: { x: 8, y: 0, w: 4, h: 5 },
    // feedbackTile: { x: 4, y: 2, w: 1, h: 1 },
    // notificationTile: { x: 0, y: 5, w: 3, h: 2 },
    // panelTile: { x: 0, y: 0, w: 8, h: 5 },
    demandTile: { x: 0, y: 3, w: 6, h: 3 },
    feedbackTile: { x: 4, y: 2, w: 1, h: 1 },
    notificationTile: { x: 6, y: 3, w: 6, h: 3 },
    panelTile: { x: 0, y: 0, w: 12, h: 3 },
  },
  heatmap: {
    heatmapVisibility: true,
  },
  panel: {
    center: false,
    legend: false,
    groupByDomain: true,
    groupByDirection: true,
    groupByMeasurement: false,
    relativeValues: false,
  },
  conversion: {},
  filter: { predictionInterval: 0, timeInterval: "current_day" },
};
export default {
  namespaced: true,
  state: {
    //TODO: default home settings
    locales: {},

    home: {
      // selectedPanel: "607",
      feedbackVisibility: false,
      notificationVisibility: false,
      demandVisibility: true,
    },
    homeLayout: {
      // demandTile: { x: 8, y: 0, w: 4, h: 5 },
      // feedbackTile: { x: 4, y: 2, w: 1, h: 1 },
      // notificationTile: { x: 0, y: 5, w: 3, h: 2 },
      // panelTile: { x: 0, y: 0, w: 8, h: 5 },
      demandTile: { x: 0, y: 3, w: 6, h: 3 },
      feedbackTile: { x: 4, y: 2, w: 1, h: 1 },
      notificationTile: { x: 6, y: 3, w: 6, h: 3 },
      panelTile: { x: 0, y: 0, w: 12, h: 3 },
    },
    heatmap: {
      heatmapVisibility: true,
    },
    panel: {
      center: false,
      legend: false,
      groupByDomain: true,
      groupByDirection: true,
      groupByMeasurement: false,
      relativeValues: false,
    },
    conversion: {},
    filter: {},
    filters: {},
  },
  mutations: {
    locales(state, payload) {
      state.locales = payload;
    },
    home(state, payload) {
      state.home = payload;
    },

    homeLayout(state, payload) {
      state.homeLayout = payload;
    },
    panel(state, payload) {
      state.panel = payload;
    },
    heatmap(state, payload) {
      state.heatmap = payload;
    },
    conversion(state, payload) {
      state.conversion = payload;
    },
    filter(state, payload) {
      console.info("filter");
      console.info(payload);
      state.filter = payload;
    },
    filters(state, payload, filterKey) {
      console.info("filter: " + filterKey);
      console.info(payload);
      if (filterKey == "filter") {
        return (state.filter = payload);
      } else {
        state.filters[filterKey] = payload;
      }
    },
    // filters: (state) => (filterKey) => {

    toggle(state, payload) {
      state[payload.section][payload.key] = !state[payload.section][payload.key];
    },
  },
  getters: {
    locales(state) {
      return state.locales;
    },
    home: (state /* getters*/) => {
      return state.home;
    },
    homeLayout: (state /* getters*/) => {
      return state.homeLayout;
    },
    panel: (state /* getters*/) => {
      return state.panel;
    },

    heatmap: (state) => {
      return state.heatmap;
    },
    conversion: (state) => {
      return state.conversion;
    },
    predictionMs(state) {
      return state.filter && state.filter.predictionIntervalms ? state.predictionIntervalms : 0;
    },
    parsedFilter(state) {
      //TODO: what time zone i should use?
      let from = null;
      let to = null;
      var date = new Date();
      // console.info(state.filter);
      let f = state.filter ? state.filter : {};
      switch (f.timeInterval) {
        case "current_day":
          from = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
          break;
        case "current_month":
          from = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
          break;
        case "previous_month":
          from = new Date(date.getFullYear(), date.getMonth() - 1, 1).getTime();
          to = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
          break;
        case "current_year":
          from = new Date(date.getFullYear(), 0, 1).getTime();
          break;
        case "previous_year":
          from = new Date(date.getFullYear() - 1, 0, 1).getTime();
          to = new Date(date.getFullYear(), 0, 1).getTime();
          break;
        default:
          from = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
          break;
      }

      return { from: from, to: to };
    },
    filter: (state) => {
      return state.filter;
    },
    filters: (state) => (filterKey) => {
      if (filterKey == "filter") {
        return state.filter;
      }
      if (!state.filters[filterKey]) {
        return {};
      }
      return state.filters[filterKey];
    },

    all: (state) => {
      console.info(state);
      return state;
    },
  },
};
