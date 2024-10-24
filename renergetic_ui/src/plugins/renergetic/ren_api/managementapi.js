import RestComponent from "./restcomponent";

export default class ManagementApi extends RestComponent {
  constructor(axiosInstance, vueInstance) {
    super(axiosInstance, vueInstance);
  }

  //getNotifications(objectId=null,context="user") => context:NotificationContext -> Enums.js
  ////////////////////////////////////////////////////////////
  ////                                                   /////
  //// Asset       REQUESTS                              /////
  ////                                                   /////
  ////////////////////////////////////////////////////////////
  //Asset managemene
  async listNotifications(filter = {}) {
    let endpoint = "/api/notification";

    let args = this.parseArgs({ ...filter });
    endpoint = `${endpoint}?${args}`;
    if (!filter) {
      filter = {};
    }
    return this.get(endpoint);
  }
  async listAsset(params = undefined, offset = 0, limit = 20) {
    // Params: category, type, name, owner_id, parent_id
    //TODO: add filtering in the backed
    console.log(params);
    if (params) {
      params.offset = offset;
      params.limit = limit;
    } else params = { offset: offset, limit: limit };
    return this.get(`/api/assets`, params);
  }
  async listByDetail(key, value, offset = 0, limit = 50) {
    return this.get(`/api/assets/key/${key}/value/${value}`, { offset: offset, limit: limit });
  }
  async addAssetDetail(id, key, value) {
    return await this.post(`/api/assets/${id}/info`, { key: key, value: value }, null, null, (e) => {
      if (e.response.status === 404) {
        this.emitError(`Asset ${id} not found: ${e.message}`, {
          code: "asset_not_found",
          args: [id],
        });
        return true;
      }
    });
  }
  //ASSET TYPES
  async listAssetTypes() {
    return this.get(`/api/assets/type`, { offset: 0, limit: 1000 });
  }
  async updateAssetType(assetType) {
    return this.put(`/api/assets/type/${assetType.id}`, assetType);
  }
  async addAssetType(assetType) {
    return this.post("/api/assets/type", assetType);
  }

  async deleteAssetType(assetType) {
    return this.delete(`/api/assets/type/${assetType.id}`);
  }

  //ASSET CATEGORIES
  async listCategories() {
    return this.get(`/api/assetCategories`);
  }
  async updateCategory(category) {
    return this.put("/api/assetCategories", category);
  }
  async addCategory(category) {
    return this.post("/api/assetCategories", category);
  }

  async deleteCategory(category) {
    return this.delete(`/api/assetCategories/${category.id}`);
  }

  async listCategoryAssets(category, offset, limit) {
    let params = { offset: offset, limit: limit };
    return this.get(`/api/assetCategories/${category.id}/assets`, params, null, (error) => {
      if (error.response.status === 404) {
        return [];
      } else {
        this.emitError(`/api/assetCategories/${category.id}/assets -${error.message}`);
      }
    });
  }

  async listConnectedAssets(assetId, offset = 0, limit = 500) {
    let params = { offset: offset, limit: limit };
    return this.get(`/api/assets/connect/${assetId}`, params, null, (error) => {
      if (error.response.status === 404) {
        console.error(`Could not find asset with id: ${assetId}: ${error.message}`);
        return [];
      } else {
        this.emitError(`/api/assets/connect/${assetId} -${error.message}`);
      }
    });
  }

  async deleteAssetConnection(assetId, connectedAssetId, type) {
    this.delete(`/api/assets/connect/${assetId}`, { connected_asset_id: connectedAssetId, type: type }, null, (e) => {
      if (e.response.status == 404) {
        //TODO: handle connectedAssetId not found
        this.emitError(`${assetId} not found: ${e.message}`, { code: "asset_not_found", args: [assetId] });
        return true;
      }
    });
  }
  async submitAssetConnection(assetId, connectedAssetId, type, biDirectional) {
    console.log("assetId", assetId);
    console.log("connectedAssetId", connectedAssetId);
    console.log("type", type);
    let uri = `/api/assets/connect/${assetId}?connect_to=${connectedAssetId}&type=${type}&bi_directional=${biDirectional}`;
    await this.put(uri, null, null, null, (e) => {
      if (e.response.status === 404) {
        //TODO: handle connectedAssetId not found
        this.emitError(`${assetId} not found: ${e.message}`, { code: "asset_not_found", args: [assetId] });
        return true;
      }
    });
  }

  async addAsset(asset) {
    let assetCopy = { ...asset };
    if (asset.parent != undefined && typeof asset === "object") assetCopy.parent = asset.parent.id;
    if (asset.owner != undefined && typeof asset === "object") assetCopy.owner = asset.owner.id;
    return this.post(`/api/assets`, assetCopy);
  }

  async updateAsset(asset) {
    let assetCopy = { ...asset };
    if (asset.parent != undefined && typeof asset === "object") assetCopy.parent = asset.parent.id;
    if (asset.owner != undefined && typeof asset === "object") assetCopy.owner = asset.owner.id;
    return this.put(`/api/assets/${asset.id}`, assetCopy, null, null, (e) => {
      if (e.response.status == 404) {
        this.emitError(`${asset.id} not found: ${e.message}`, { code: "asset_not_found", args: [asset.id] });
      } else {
        this.emitError(`PUT /api/assets/${asset.id} -${e.message}`);
      }
    });
  }

  // async setParent(asset, parentId) {
  //   const assetCopy = {
  //     id: asset.id,
  //     name: asset.name,
  //     type: asset.type.id,
  //     label: asset.label,
  //     description: asset.description,
  //     geo_location: asset.geo_location,
  //     parent: parentId,
  //     user: asset.user,
  //     asset_category: asset.category,
  //     dashboards: asset.dashboards,
  //   };
  //   return this.put(`/api/assets/${asset.id}`, assetCopy, null, null, (e) => {
  //     if (e.response.status === 404) {
  //       this.emitError(`${asset.id} not found: ${e.message}`, { code: "asset_not_found", args: [asset.id] });
  //     } else {
  //       this.emitError(`PUT /api/assets/${asset.id} -${e.message}`);
  //     }
  //   });
  // }
  async assignParent(asset, parentId) {
    return this.put(`/api/assets/${asset.id}/parent/${parentId}`, null, null, null, (e) => {
      if (e.response.status === 404) {
        this.emitError(`${asset.id} not found: ${e.message}`, { code: "asset_not_found", args: [asset.id] });
      } else {
        this.emitError(`PUT /api/assets/${asset.id}/parent/${parentId} -${e.message}`);
      }
    });
  }
  async revokeParent(asset) {
    return this.delete(`/api/assets/${asset.id}/parent`, null, null, null, (e) => {
      if (e.response.status === 404) {
        this.emitError(`${asset.id} not found: ${e.message}`, { code: "asset_not_found", args: [asset.id] });
      } else {
        this.emitError(`PUT /api/assets/${asset.id}/parent -${e.message}`);
      }
    });
  }
  async getAsset(id) {
    return this.get(`/api/assets/${id}`, null, null, (e) => {
      if (e.response.status == 404) {
        this.emitError(`Asset: ${id} not found: ${e.message}`, { code: "asset_not_found", args: [id] });
        return true;
      }
    });
  }

  async deleteAsset(id) {
    return this.delete(`/api/assets/${id}`, null, null, (e) => {
      if (e.response.status == 404) {
        this.emitError(`Asset ${id} not found: ${e.message}`, { code: "asset_not_found", args: [id] });
        return true;
      }
      if (e.response.status == 500) {
        this.emitError(`Asset: ${id} - check asset connections: ${e.message}`);
        return false;
      }
      return false;
    });
  }
  async assignAssetMeasurement(id, measurementId) {
    return this.put(`/api/assets/${id}/measurement/${measurementId}`, null, null, null, (e) => {
      if (e.response.status == 404) {
        this.emitError(`Asset: ${id} or measurement ${measurementId} not found: ${e.message}`, { code: "asset_not_found", args: [id] });
        return false;
      }
    });
  }

  async revokeAssetMeasurement(id, measurementId) {
    return this.delete(`/api/assets/${id}/measurement/${measurementId}`);
  }
  async getDemand(assetId) {
    return this.get(`/api/demandRequests/assetId/${assetId}`, null, null, (e) => {
      if (e.response.status == 404) {
        this.emitError(`Asset ${assetId} not found: ${e.message}`, { code: "asset_not_found", args: [assetId] });
        return true;
      }
    });
  }
  ////////////////////////////////////////////////////////////
  ////                                                   /////
  //// MEASUREMENT REQUESTS                              /////
  ////                                                   /////
  ////////////////////////////////////////////////////////////

  async listMeasurement({ params = undefined, offset = 0, limit = 200 }) {
    if (!params) {
      params = {};
    }
    return this.get(`/api/measurements/report`, { ...params, offset: offset, limit: limit });
  }

  // async listAssetMeasurementByDetail(key, value, offset = 0, limit = 50) {
  //   return this.get(`/api/assets/key/${key}/value/${value}`, { offset: offset, limit: limit });
  // }
  async listTagMeasurements(tagKey, tagValue) {
    return this.get(`/api/measurements/key/${tagKey}/value/${tagValue}`);
  }

  async searchMeasurement(q, assetId, offset = 0, limit = 20) {
    console.warn("filter assigned measurements: " + assetId);
    if (q === "") {
      return [];
    }
    return await this.get(`/api/measurements`, { name: q, offset: offset, limit: limit }, null, null);
  }
  async listMeasurementType() {
    return this.get(`/api/measurements/type`, { limit: 1000 });
  }
  async updateMeasurementType(type) {
    return this.put(`/api/measurements/type/${type.id}`, type);
  }
  async deleteMeasurementType(type) {
    return this.delete(`/api/measurements/type/${type.id}`);
  }
  async addMeasurementType(type) {
    return this.post(`/api/measurements/type`, type);
  }
  async setMeasurementTypeVisibility(id, visibility) {
    if (visibility) return this.post(`/api/measurements/type/${id}/dashboard/true`);
    else return this.post(`/api/measurements/type/${id}/dashboard/false`);
  }
  async updateMeasurement(measurement) {
    // TODO: -> only allow to update labels ,  color, and key-value properties
    return this.put(`/api/measurements/id/${measurement.id}`, measurement, null, null, (e) => {
      if (e.response.status == 404) {
        this.emitError(`Measurement ${measurement.id} not found: ${e.message}`, {
          code: "measurement_not_found",
          args: [measurement.id],
        });
        return true;
      }
    });
  }

  async getMeasurementProperties(id) {
    return this.get(`/api/measurements/id/${id}/properties`);
  }
  async getMeasurementLinkedPanels(id) {
    return this.get(`/api/measurements/id/${id}/panels`);
  }
  async getMeasurementTags(id) {
    return this.get(`/api/measurements/id/${id}/tags`);
  }
  async duplicateMeasurement(id) {
    return this.post(`/api/measurements/id/${id}/copy`);
  }

  async listTags() {
    return this.get(`/api/measurements/tags`);
  }
  async listTagKeys() {
    return this.get(`/api/measurements/tags/key`);
  }
  async listTagValues(tagKey) {
    return this.get(`/tags/key/${tagKey}/values`);
  }

  async getTag(key, value) {
    return this.get(`/api/measurements/tags/key/${key}/value/${value}`);
  }
  async createNewTag(tag) {
    // return this.put(`/api/measurements/tags/key/${tag.key}/value/${tag.value}`);
    return this.post(`/api/measurements/tags`, tag);
  }
  async deleteTag(tag) {
    return this.delete(`/api/measurements/tags/key/${tag.key}/value/${tag.value}`, null, null, (e) => {
      if (e.response.status == 404) {
        this.emitError(`Tag ${tag.key}:${tag.value} not found: ${e.message}`, {
          code: "tag_not_found",
          args: [tag.key, tag.value],
        });
        return true;
      }
      return false;
    }).then((res) => {
      return res;
    });
  }

  async updateMeasurementTags(measurement, tags) {
    // TODO: -> only allow to update labels ,  color, and key-value properties
    return this.put(`/api/measurements/id/${measurement.id}/tags`, tags, null, null, (e) => {
      if (e.response.status == 404) {
        this.emitError(`Measurement ${measurement.id} not found: ${e.message}`, {
          code: "measurement_not_found",
          args: [measurement.id],
        });
        return true;
      }
    });
  }
  async updateMeasurementProperties(measurement, properties) {
    // TODO: -> only allow to update labels ,  color, and key-value properties
    return this.put(`/api/measurements/id/${measurement.id}/properties`, properties, null, null, (e) => {
      if (e.response.status == 404) {
        this.emitError(`Measurement ${measurement.id} not found: ${e.message}`, {
          code: "measurement_not_found",
          args: [measurement.id],
        });
        return true;
      }
    });
  }

  async deleteMeasurement(measurementId) {
    return this.delete(`/api/measurements/id/${measurementId}`, null, null, null, (e) => {
      if (e.response.status == 404) {
        this.emitError(`Measurement ${measurementId} not found: ${e.message}`, {
          code: "measurement_not_found",
          args: [measurementId],
        });
        return true;
      }
    });
  }

  async getMeasurement(id) {
    return this.get(`/api/measurements/id/${id}`, null, null, (e) => {
      if (e.response.status == 404) {
        this.emitError(`Measurement ${id} not found: ${e.message}`, {
          code: "measurement_not_found",
          args: [id],
        });
        return true;
      }
    });
  }

  async updateAssetDetail(assetId, key, value) {
    return await this.put(`/api/assets/${assetId}/info`, { key: key, value: value }, null, null, (e) => {
      this.emitError(`Asset ${assetId} not found: ${e.message}`, {
        code: "asset_not_found",
        args: [assetId],
      });
      return true;
    });
  }
  async deleteAssetDetail(assetId, key) {
    return await this.delete(`/api/assets/${assetId}/info/key/${key}`, null, null, (e) => {
      this.emitError(`Asset ${assetId} not found: ${e.message}`, {
        code: "asset_not_found",
        args: [assetId],
      });
      return true;
    });
  }
  async getAssetDetails(assetId) {
    return this.get(`api/assets/${assetId}/info`, null, null, (e) => {
      if (e.response.status == 404) {
        this.emitError(`Asset details not found`, {
          code: "asset_details_not_found",
        });
        return true;
      }
    });
  }
  async addMeasurement(measurement) {
    // if (measurement.type != undefined) measurement.type = measurement.type.id;
    return await this.post(`/api/measurements`, measurement);
    // .catch(function (error) {
    //   console.error("add measurement error" + error.message);
    // });
  }
  async addMeasurements(measurements) {
    // if (measurement.type != undefined) measurement.type = measurement.type.id;
    return await this.post(`/api/measurements/batch`, measurements);
    // .catch(function (error) {
    //   console.error("add measurement error" + error.message);
    // });
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async getCategoryFromAsset(id) {
    return this.get(`/api/assets/category/${id}`, null, null, (e) => {
      if (e.response.status == 404) {
        this.emitError(`Asset category for ${id} not found: ${e.message}`, {
          code: "asset_category_not_found",
          args: [id],
        });
        return true;
      }
    });
  }
  async getAllCategories() {
    return this.get(`/api/assetCategories`, null, null, (e) => {
      if (e.response.status == 404) {
        this.emitError(`Asset categories not found`, {
          code: "asset_category_not_found",
        });
        return true;
      }
    });
  }
  async updateCategoryFromAsset(id, category) {
    return this.put(`/api/assets/${id}/category`, category, null, null, (e) => {
      if (e.response.status == 404) {
        this.emitError(`Asset category ${id} error: ${e.message}`, {
          code: "asset_category_error",
          args: [id],
        });
        return true;
      }
    });
  }
  async deleteCategoryFromAsset(id) {
    return this.delete(`/api/assets/${id}/category`, null, null, (e) => {
      if (e.response.status == 404) {
        this.emitError(`Asset ${id} not found: ${e.message}`, { code: "asset_category_error", args: [id] });
        return true;
      }
    });
  }
  async getAllMeasurements() {
    return this.get(`/api/measurements`, null, null, (e) => {
      if (e.response.status != 404) {
        this.emitError(`Measurements not found`, {
          code: "measurement_list_error",
        });
      }
      return true;
    });
  }
  async getAllMeasurementsPaginationWorkaround() {
    return this.get(`/api/measurements?limit=1500`, null, null, (e) => {
      if (e.response.status != 404) {
        this.emitError(`Measurements not found`, {
          code: "measurement_list_error",
        });
      }
      return true;
    });
  }
  async getAllRules() {
    return this.get(`/api/rules/list`, null, null, (e) => {
      if (e.response.status != 404) {
        this.emitError(`Asset rules not found`, {
          code: "asset_rules_error",
        });
      }
      return true;
    });
  }
  async updateCreateDeleteRules(rules, deleted) {
    var body = {
      createUpdate: rules,
      delete: deleted,
    };
    return await this.post(`api/rules/batch/update-create-delete`, body, null, null, (e) => {
      if (e.response.status === 404) {
        this.emitError(`Rules not saved: ${e.message}`, {
          code: "rule_saving_error",
        });
        return true;
      }
    });
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

  async listLogs(offset = null, limit = null, severity = null, service = null, from = null, to = null) {
    var params = "";
    if (offset !== null && offset !== undefined) {
      params += (params.length !== 0 ? "&" : "") + "offset=" + offset;
    }
    if (limit !== null && limit !== undefined) {
      params += (params.length !== 0 ? "&" : "") + "limit=" + limit;
    }
    if (severity !== null && severity !== undefined && severity.length > 0) {
      params += (params.length !== 0 ? "&" : "") + "severity=" + severity;
    }
    if (service !== null && service !== undefined && service.length > 0) {
      params += (params.length !== 0 ? "&" : "") + "service=" + service;
    }
    if (from !== null && from !== undefined && from.length > 0) {
      params += (params.length !== 0 ? "&" : "") + "from=" + from;
    }
    if (to !== null && to !== undefined && to.length > 0) {
      params += (params.length !== 0 ? "&" : "") + "to=" + to;
    }
    return this.get(`/api/log/list${params.length === 0 ? "" : "?" + params}`, null, null, (e) => {
      if (e.response.status != 404) {
        this.emitError(`Logs not found`, {
          code: "log_fetch_error",
        });
      }
      return true;
    });
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//
// async searchAsset(query, params = undefined, offset = 0, limit = 20) {
//   // Params: category, type, name, owner_id, parent_id
//   // PREPARE FILTERS
//   //
//   // IMPORTANT NOTE FROM TOMEK:
//   // this method really surprised me - usually filtering is made on
//   // the database site not on the UI. Retrieving all results to the UI
//   // and then filtering is really, really bad idea...
//   let normalizedQuery = query.trim().toLowerCase();
//   let f = function (s) {
//     return (
//       s.name.toLowerCase().includes(normalizedQuery) ||
//       (s.label != null && s.label.toLowerCase().includes(normalizedQuery))
//     );
//   };
//   // SET QUERY PARAMS
//   if (params) {
//     params.offset = offset;
//     params.limit = limit;
//   } else params = { offset: offset, limit: limit };
//   // CALL API
//   return this.axios
//     .get(`/api/assets`, {
//       headers: { "Content-type": "application/json; charset=UTF-8" },
//       params: params,
//     })
//     .then((response) => {
//       return response.data.filter((it) => f(it));
//     })
//     .catch(function (error) {
//       console.error("list asset error" + error.message);
//       if (error.response.status == 404) console.error("there are no assets" + error.message);
//     });
// }

// async listAssetType(category = null, offset = 0, limit = 20) {
//   return this.axios
//     .get(`/api/assets/type`, {
//       headers: { "Content-type": "application/json; charset=UTF-8" },
//       params: { offset: offset, limit: limit, category: category },
//     })
//     .then((response) => {
//       return response.data;
//     })
//     .catch(function (error) {
//       console.error("list asset types error" + error.message);
//       if (error.response.status == 404) console.error("there are no assets types" + error.message);
//     });
// }
