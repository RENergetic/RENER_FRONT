import RestComponent from "./restcomponent";

import ManagementApi from "./managementapi";
import DashboardApi from "./dashboardapi";
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
  async getMeasurementAggregation(assetId) {
    return this.get(`/api/measurementsAggregation/list/${assetId}`, null, null, (e) => {
      if (e.response.status != 404) {
        this.emitError(`Measurement aggregation not found`, {
          code: "measurement_aggr_get_error",
        });
      }
      return true;
    });
  }
  async saveMeasurementAggregation(assetId, configuration) {
    return this.post(`/api/measurementsAggregation/save/${assetId}`, configuration, null, null, (e) => {
      if (e.response.status != 404) {
        this.emitError(`Measurement aggregation not saved`, {
          code: "measurement_aggr_save_error",
        });
      }
      return true;
    });
  }
  async getOptimizerTypes() {
    return this.get(`/api/measurementsAggregation/optimizerTypes`, null, null, (e) => {
      if (e.response.status != 404) {
        this.emitError(`Optimizer types not found`, {
          code: "optimizer_type_get_error",
        });
      }
      return true;
    });
  }
  async getOptimizerParameters(assetId, optimizerType) {
    return this.get(`/api/measurementsAggregation/optimizerParameters/${assetId}/${optimizerType}`, null, null, (e) => {
      if (e.response.status != 404) {
        this.emitError(`Optimizer parameters not found`, {
          code: "optimizer_parameter_get_error",
        });
      }
      return true;
    });
  }
  async getMeasurementsFromConnectedAssets(assetId) {
    return this.get(`/api/measurementsAggregation/measurements/${assetId}`, null, null, (e) => {
      if (e.response.status != 404) {
        this.emitError(`Measurements not found`, {
          code: "measurements_connect_asset_get_error",
        });
      }
      return true;
    });
  }
  async getMeasurementsFromConnectedAssetsAndCompatibleWithSelectedMeasurement(assetId, measurementId) {
    console.log("ok ?");
    return this.get(`/api/measurementsAggregation/compatibleMeasurements/${assetId}/${measurementId}`, null, null, (e) => {
      if (e.response.status != 404) {
        this.emitError(`Compatible measurements not found`, {
          code: "compatible_measurements_connect_asset_get_error",
        });
      }
      return true;
    });
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
