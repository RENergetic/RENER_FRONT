import RestComponent from "./restcomponent";

// TEMPORAL CHANGES TO CONNECT WITH BACKEND
import * as generator from "../../../assets/dummy/samples/data_generator.js";
import ManagementApi from "./managementapi";
import DashboardApi from "./dashboardapi";
// END OF TEMPORAL CHANGES TO CONNECT WITH BACKEND
// var measurementAttributes = [
//   {
//     key: "id4",
//     label: "Predictors",
//     name: "predictors",
//     type: "group",
//     children: [
//       {
//         key: "id5",
//         name: "electrical",
//         label: "Electrical",
//         type: "measurement",
//         children: [],
//       },
//       {
//         key: "id6",
//         name: "thermic",
//         label: "Thermic",
//         type: "measurement",
//         children: [],
//       },
//     ],
//   },
//   {
//     key: "id1",
//     label: "Target",
//     name: "target",
//     type: "group",
//     children: [
//       {
//         key: "id2",
//         name: "electrical",
//         label: "Electrical",
//         type: "measurement",
//         children: [],
//       },
//       {
//         key: "id3",
//         name: "thermic",
//         label: "Thermic",
//         type: "measurement",
//         children: [],
//       },
//     ],
//   },
//   {
//     key: "id7",
//     label: "Prediction Interval",
//     name: "prediction_interval",
//     type: "group",
//     children: [
//       {
//         key: "id8",
//         name: "3h",
//         label: "3 H",
//         type: "measurement",
//         children: [],
//       },
//       {
//         key: "id9",
//         name: "6h",
//         label: "6 H",
//         type: "measurement",
//         children: [],
//       },
//     ],
//   },
// ];
export default class DataApi extends RestComponent {
  constructor(axiosInstance, vueInstance) {
    super(axiosInstance, vueInstance);
  }

  // INFORMATION PANEL REQUESTS

  // async getTimeseries(measurementIds, attributes = {},from=null,to=null) {   } ./docs/model/timeseries.json ,
  //                labels -> list of unix timestamps , data list of values for those timestamps
  //                  attributes -> query attributes like predictions, ai models etc, format and  key names -> to be defined

  // async getPanelData(panelId) {} ./docs/model/panel_data.json , dictionary:
  //                 {"state":{panel_id:state}, "data":{measurement_id:value}}
  // async getNotifications(objectIds,,offset=0,limit=20,from=null,to=null) {} //TODO:define

  // async getTileData(tileId) {}
  // TEMPORAL CHANGES TO CONNECT WITH BACKEND
  dashboardApi = new DashboardApi();
  managementApi = new ManagementApi();

  async getDummyTimeseries(measurementIds, attributes = {}) {
    //TODO: TOMEK
    console.info(attributes);

    let timeseries = generator.generateTimeseries(measurementIds);
    console.info(JSON.stringify(timeseries));
    return timeseries;
  }
  async getTimeseries(panelId, tileId, assetId, filter) {
    let endpoint = "/api/data/timeseries";
    if (panelId) {
      endpoint += `/panel/${panelId}`;
    }
    if (tileId) {
      endpoint += `/tile/${tileId}`;
    }
    if (assetId) {
      endpoint += `/asset/${assetId}`;
    }
    let args = this.parseArgs({ ...filter });
    endpoint = `${endpoint}?${args}`;
    if (!filter) {
      filter = {};
    }
    return this.get(endpoint);
  }
  async getMeasurementTimeseries(measurements, filter) {
    let measurementsIds = measurements.map((m) => m.id).join(",");
    let endpoint = `/api/data/timeseries/measurements/${measurementsIds}`;

    let args = this.parseArgs({ ...filter });
    endpoint = `${endpoint}?${args}`;
    if (!filter) {
      filter = {};
    }
    return this.get(endpoint);
  }
  // async getCurrentData(measurementIds) {
  //   return generator.
  // }

  async getPanelData(panelId, assetId, filter) {
    // let args = this.parseArgs({ relative: relative });
    if (!filter) {
      filter = {};
    }
    let args = this.parseArgs({ ...filter });
    // let args = "";
    let endpoint = assetId != null ? `/api/data/panel/${panelId}/asset/${assetId}?${args}` : `/api/data/panel/${panelId}?${args}`;
    return this.get(endpoint);
  }

  // async getNotifications(objectIds) {
  //   // todo:
  //   return objectIds;
  // }

  //////////////////////
  //Postponed features
  /////////////////////
  // async getHeatMapState(heatmapid){} ./docs/model/heatmap_state.json , dictionary with states: area_id => state

  // async getAssetsData(assetIds) {
  //   var res = {};
  //   for (var assetId of assetIds) {
  //     let asset = await this.managementApi.getAsset(assetId);
  //     res[assetId] = generator.getAssetData(asset);
  //   }
  //   return res;
  // }

  // async attributes(/*area, areaId*/) {
  //   console.info(JSON.stringify(measurementAttributes));
  //   return measurementAttributes;
  //   // return storage.get(`${MANAGEMENT_KEY}.panel_list`, measurementAttributes);
  // }
  // async getHeatMapState(heatmapId) {
  //   let heatmap = await this.dashboardApi.getHeatMap(heatmapId);
  //   let state = generator.generateHeatMapState(heatmap);
  //   console.info(JSON.stringify(state));
  //   return state;
  // }

  // async getHeatMapData(heatmapid) {
  //   let heatmap = await this.dashboardApi.getHeatMap(heatmapid);
  //   return generator.getHeatMapData(heatmap);
  // }
  // async getAssetData(assetId) {}   dictionary with current measurements associated with asset : measurement_id => value
  // async getHeatMapData(heatmapId) {}  dictionary with current measurements associated with heatmap: measurement_id => value

  //TODO: discuss with  others
  // async attributes(/*area, areaId*/) {}
}
