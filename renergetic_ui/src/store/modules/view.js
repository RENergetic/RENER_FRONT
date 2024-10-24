function mapPanelId(objectArray) {
  let dict = objectArray.reduce((dict, el, index) => ((dict[el["id"]] = index), dict), {});
  return dict;
}
function mapAssetPanelId(objectArray) {
  let dict = objectArray.reduce((dict, el, index) => ((dict[el["panel"]["id"] + "_" + el["asset"]["id"]] = index), dict), {});
  return dict;
}
function groupMeasurementTypes(measurementTypes) {
  let d = {};
  for (let mt of measurementTypes) {
    if (!d[mt.physical_name]) {
      d[mt.physical_name] = [];
    }
    d[mt.physical_name].push({
      name: mt.name,
      physical_name: mt.physical_name,
      id: mt.id,
      unit: mt.unit,
      factor: mt.factor,
      base_unit: mt.base_unit,
    });
  }
  return d;
}

export default {
  namespaced: true,
  state: {
    // graphana dashboards
    dashboards: [],
    dashboardMap: {},
    // list of information panel visible in the sidemenu
    informationPanels: [],
    featuredPanels: [],
    informationPanelsMap: {},
    // list of featured user assets
    assets: [],
    assetsMap: {},
    // list of featured user assets
    assetPanels: [],
    assetPanelsMap: {},
    demands: [],
    data: [],
    locationList: ["en-EN"],
  },
  mutations: {
    reset(state) {
      console.info("reset view");
      state.dashboards = [];
      state.dashboardMap = {};
      state.informationPanels = [];
      state.featuredPanels = [];
      state.informationPanelsMap = {};
      state.assets = [];
      state.assetsMap = {};
      state.assetPanels = [];
      state.assetPanelsMap = {};
      state.demands = [];
      state.data = [];
      state.locationList = ["en-EN"];
    },
    setPanel(state, panel) {
      console.debug("Set Panel");
      if (!panel || !panel.id) return;
      if (state.informationPanels.filter((it) => (it.id = panel.id)).length != 0) {
        return;
      }
      panel.label = panel.label ? panel.label : panel.name;
      // console.debug(state.informationPanels);
      state.informationPanels.push(panel);
      state.informationPanelsMap[panel.id] = state.informationPanels.length - 1;
      console.debug(state.informationPanels);
      console.debug(state.informationPanelsMap);
    },
    wrapper(state, payload) {
      if (!payload) {
        console.error("Empty wrapper payload");
        return;
      }
      let getF = (key, defaultValue) => (payload[key] ? payload[key] : defaultValue);
      state.informationPanels = getF("panels", []);
      state.informationPanels.forEach((it) => {
        it.label = it.label ? it.label : it.name;
      });

      state.featuredPanels = state.informationPanels.filter((it) => it.featured);
      state.informationPanelsMap = mapPanelId(state.informationPanels);
      state.assets = getF("assets", []);
      state.assetsMap = mapPanelId(state.assets);
      // state.state =  getF("state",[]);
      state.data = getF("data", []);
      state.measurementTypes = groupMeasurementTypes(getF("measurement_types", []));
      state.measurementTypeList = getF("measurement_types", []);
      state.assetPanels = getF("asset_panels", []);
      state.assetPanelsMap = mapAssetPanelId(state.assetPanels);
      console.info(state.assetPanelsMap);
      state.dashboards = getF("dashboards", []);
      state.dashboardMap = mapPanelId(state.dashboards);
      state.demands = getF("demands", []);
      state.demandsFuture = getF("demandsFuture", []);
      state.demandsPast = getF("demandsPast", []);
      let meta = getF("asset_metakeys", {});
      state.asset = {
        categories: meta.categories ? meta.categories : [],
        types: meta.types ? meta.types : [],
        asset_details_keys: meta.asset_details_keys ? meta.asset_details_keys : [],
      };
      meta = getF("dashboard_metakeys", {});
      state.dashboard = {
        models: meta.models ? meta.models : [],
        units: meta.units ? meta.units : [],
      };
    },
    data(state, payload) {
      state.data = payload;
    },
    demands(state, payload) {
      state.demands = payload;
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
      state.locationList = payload;
    },
  },
  getters: {
    wrapper: (state) => {
      return state;
    },
    measurementTypes: (state) => {
      return state.measurementTypes;
    },
    convertValue: (state) => (currentMeasurementType, value, newUnit) => {
      if (
        newUnit == null ||
        currentMeasurementType.unit == newUnit ||
        currentMeasurementType.unit == "%" ||
        newUnit == "%" ||
        currentMeasurementType.unit == "any" ||
        newUnit == "any" ||
        currentMeasurementType.unit == "ratio" ||
        newUnit == "ratio"
      ) {
        return value;
      }
      //get new unit
      let mt = state.measurementTypes[currentMeasurementType.physical_name].find((mt) => mt.unit == newUnit);

      return (value * currentMeasurementType.factor) / mt.factor;
      // return (value / currentMeasurementType.factor) * mt.factor;
    },

    convertSIValue: (state) => (physicalName, value, newUnit) => {
      //Convert base SI unit into newUnit
      if (newUnit == null || newUnit == "%" || newUnit == "any" || newUnit == "ratio") {
        return value;
      }
      //get new unit
      let mt = state.measurementTypes[physicalName].find((mt) => mt.unit == newUnit);
      return value / mt.factor;
    },
    locationList: (state /* getters*/) => {
      return state.locationList;
    },
    dashboards: (state /* getters*/) => {
      return state.dashboards;
    },
    featuredPanels: (state) => {
      return state.featuredPanels;
    },
    assets: (state /* getters*/) => {
      return state.assets;
    },
    demands: (state /* getters*/) => {
      return state.demands;
    },
    demandsFuture: (state /* getters*/) => {
      return state.demandsFuture;
    },
    demandsPast: (state /* getters*/) => {
      return state.demandsPast;
    },
    data: (state /* getters*/) => {
      return state.data;
    },
    assetCategories: (state /* getters*/) => {
      return state.asset.categories;
    },
    assetTypes: (state /* getters*/) => {
      return state.asset.types;
    },

    dashboardModels: (state /* getters*/) => {
      return state.dashboard.models;
    },

    dashboardUnits: (state /* getters*/) => {
      return state.dashboard.units;
    },

    assetDetailsKeys: (state /* getters*/) => {
      return state.asset.asset_details_keys;
    },

    assetPanels: (state /* getters*/) => {
      return state.assetPanels;
    },
    informationPanels: (state /* getters*/) => {
      return state.informationPanels;
    },
    defaultHomePanel(state) {
      console.debug(state.informationPanels);
      if (state.informationPanels && state.informationPanels.length > 0) {
        if (state.default_asset) {
          let panel = state.informationPanels[0];
          panel.asset = state.default_asset;
          return panel;
        }
        return state.informationPanels.find((it) => !it.is_template);
      }
      return null;
    },
    assetPanel: (state /* getters*/) => (panelId, assetId) => {
      let index = state.assetPanelsMap[`${panelId}_${assetId}`];
      return state.assetPanels[index] ? state.assetPanels[index].panel : null;
    },

    panelAsset: (state /* getters*/) => (panelId, assetId) => {
      let index = state.assetPanelsMap[`${panelId}_${assetId}`];
      return state.assetPanels[index] ? state.assetPanels[index].asset : null;
    },
    informationPanelsMap: (state /* getters*/) => {
      return state.informationPanelsMap;
    },
  },
};

// assetPanels(state, payload) {
//   state.assetPanels = payload;
//   state.assetPanelsMap = mapAssetPanelId(state.assetPanels);
// },

// dashboards(state, payload) {
//   state.dashboards = payload;
//   state.dashboardMap = mapPanelId(payload);
// },
// informationPanels(state, payload) {
//   state.informationPanels = payload;
//   state.informationPanelsMap = mapPanelId(payload);
// },
// assets(state, payload) {
//   state.assets = payload;
//   state.assetsMap = mapPanelId(payload);
// },
