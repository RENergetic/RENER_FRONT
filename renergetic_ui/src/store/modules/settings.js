function parseDateFilter(filter) {
  let f = filter ? filter : {};
  // if (typeof f.date_from !== undefined) return { from: new Date().getTime(), to: new Date().getTime() };
  let from = f.date_from; // ? f.date_from.getTime() : null;
  let to = f.date_to; //? f.date_to.getTime() : null;
  var date = new Date();
  //"custom_interval"
  switch (f.timeIntervalType) {
    case "current_day":
      from = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
      to = null;
      break;
    case "last_24h":
      from = new Date().getTime() - 3600 * 24 * 1000;
      to = null;
      break;
    case "last_week":
      from = new Date().getTime() - 3600 * 24 * 1000 * 7;
      to = null;
      break;
    case "current_month":
      from = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
      to = null;
      break;
    case "previous_month":
      from = new Date(date.getFullYear(), date.getMonth() - 1, 1).getTime();
      to = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
      break;
    case "current_year":
      from = new Date(date.getFullYear(), 0, 1).getTime();
      to = null;
      break;
    case "previous_year":
      from = new Date(date.getFullYear() - 1, 0, 1).getTime();
      to = new Date(date.getFullYear(), 0, 1).getTime();
      break;
    default:
      if (!from) {
        if (to != null) {
          let d = new Date(to - 3600 * 1000 * 24);
          from = new Date(d).getTime();
        } else from = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
      }
      break;
  }
  return { from: from, to: to };
}

export var DefaultSettings = {
  locales: {},

  home: {
    feedbackVisibility: false,
    notificationVisibility: false,
    demandVisibility: true,
    panelVisibility: true,
    homePanel: null,
  },
  // homeLayout: {
  //   // demandTile: { x: 8, y: 0, w: 4, h: 5 },
  //   // feedbackTile: { x: 4, y: 2, w: 1, h: 1 },
  //   // notificationTile: { x: 0, y: 5, w: 3, h: 2 },
  //   // panelTile: { x: 0, y: 0, w: 8, h: 5 },
  //   demandTile: { x: 0, y: 3, w: 6, h: 3 },
  //   feedbackTile: { x: 4, y: 2, w: 1, h: 1 },
  //   notificationTile: { x: 6, y: 3, w: 6, h: 3 },
  //   panelTile: { x: 0, y: 0, w: 12, h: 3 },
  // },
  panel: {
    center: false,
    legend: false,
    groupByDomain: true,
    groupByDirection: true,
    groupByMeasurement: false,
    relativeValues: false,
    ignoreOverrideMode: false,
  },
  conversion: {},
  filter: { timeIntervalType: "current_day" },
  filters: {},
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
      panelId: null,
      homePanel: null,
    },
    // homeLayout: {
    //   // demandTile: { x: 8, y: 0, w: 4, h: 5 },
    //   // feedbackTile: { x: 4, y: 2, w: 1, h: 1 },
    //   // notificationTile: { x: 0, y: 5, w: 3, h: 2 },
    //   // panelTile: { x: 0, y: 0, w: 8, h: 5 },
    //   demandTile: { x: 0, y: 3, w: 6, h: 3 },
    //   feedbackTile: { x: 4, y: 2, w: 1, h: 1 },
    //   notificationTile: { x: 6, y: 3, w: 6, h: 3 },
    //   panelTile: { x: 0, y: 0, w: 12, h: 3 },
    // },
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

    // homeLayout(state, payload) {
    //   state.homeLayout = payload;
    // },
    panel(state, payload) {
      state.panel = payload;
    },
    conversion(state, payload) {
      state.conversion = payload;
    },
    filter(state, payload) {
      console.debug(payload);

      state.filter = payload;
    },
    filters(state, { payload, key }) {
      if (key == "filter") {
        return (state.filter = payload);
      } else {
        state.filters[key] = payload;
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
      console.error(state.home);
      return state.home;
    },
    // homeLayout: (state /* getters*/) => {
    //   return state.homeLayout;
    // },
    panel: (state /* getters*/) => {
      return state.panel;
    },

    conversion: (state) => {
      return state.conversion;
    },
    predictionFilterMs(state) {
      return state.filter && state.filter.predictionIntervalms ? state.predictionIntervalms : 0;
    },

    parsedFilter: (state) => (filterKey) => {
      let filter;
      if (filterKey == "filter" || !filterKey) {
        filter = state.filter;
      } else {
        filter = state.filters[filterKey];
      }
      if (filter == null) {
        console.error(filterKey + ": filter not found");
        filter = { predictionInterval: 0, timeIntervalType: "current_day" };
      }
      let parsed = parseDateFilter(filter);
      parsed["predictions"] = filter && filter.predictionIntervalms ? filter.predictionIntervalms : 0;
      return parsed;
    },
    filter: (state) => {
      return state.filter;
    },
    filters: (state) => (filterKey) => {
      let filter;
      if (filterKey == "filter" || !filterKey) {
        filter = state.filter;
      } else {
        filter = state.filters[filterKey];
      }
      if (filter == null) {
        console.error(filterKey + ": filter not found");
        filter = { predictionInterval: 0, timeIntervalType: "current_day" };
      }
      return filter;
    },

    all: (state) => {
      return state;
    },
  },
};
