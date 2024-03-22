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
  //List assets

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
    if (params) {
      params.offset = offset;
      params.limit = limit;
    } else params = { offset: offset, limit: limit };
    return this.get(`/api/assets`, params);
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

  deleteAssetConnection(assetId, connectedAssetId) {
    this.delete(`/api/assets/connect/${assetId}`, { connected_asset_id: connectedAssetId }, null, (e) => {
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
  async setMeasurementTypeVisibility(id, visibility) {
    if (visibility) return this.post(`/api/measurements/type/${id}/dashboard/true`);
    else return this.post(`/api/measurements/type/${id}/dashboard/false`);
  }
  async updateMeasurement(measurement) {
    // TODO: -> only allow to update labels ,  color, and key-value properties
    return this.put(`/api/measurements/${measurement.id}`, measurement, null, null, (e) => {
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
    return this.get(`/api/measurements/${id}/properties`);
  }
  async getMeasurementLinkedPanels(id) {
    return this.get(`/api/measurements/${id}/panels`);
  }
  async getMeasurementTags(id) {
    return this.get(`/api/measurements/${id}/tags`);
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
    return this.put(`/api/measurements/${measurement.id}/tags`, tags, null, null, (e) => {
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
    return this.put(`/api/measurements/${measurement.id}/properties`, properties, null, null, (e) => {
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
    return this.delete(`/api/measurements/${measurementId}`, null, null, null, (e) => {
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
  async updateAssetDetail(id, key, value) {
    return await this.put(`/api/assets/${id}/info`, { key: key, value: value }, null, null, (e) => {
      this.emitError(`Asset ${id} not found: ${e.message}`, {
        code: "asset_not_found",
        args: [id],
      });
      return true;
    });
  }
  async getAssetDetails(asset_id) {
    return this.get(`api/assets/${asset_id}/info`, null, null, (e) => {
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
  //
  async getAbstracMeterList() {
    return this.get(`/api/meter/list`, null, null, (e) => {
      if (e.response.status == 404) {
        this.emitError(`Abstract meter list not found`, {
          code: "abstract_meter_list_error",
        });
        return true;
      }
    });
  }
  async getAnAbstracMeterConfiguration(meter_name, domain) {
    return this.get(`/api/meter/${domain}/${meter_name}`, null, null, (e) => {
      if (e.response.status != 404) {
        this.emitError(`Abstract meter list not found`, {
          code: "abstract_meter_list_error",
        });
      }
      return true;
    });
  }
  async addAbstractMeter(abstractMeter) {
    return await this.post(`/api/meter`, abstractMeter, null, null, (e) => {
      // if (e.response.status === 404) {
      this.emitError(`Abstract meter not added: ${e.message}`, {
        code: "abstract_meter_adding_error",
      });
      return true;
      // }
    });
  }
  async updateAbstractMeter(abstractMeter) {
    return this.put(`/api/meter`, abstractMeter, null, null, (e) => {
      if (e.response.status == 404) {
        this.emitError(`The abstract meter doesn´t exist: ${e.message}`, {
          code: "update_abstract_meter_error",
        });
        return true;
      }
    });
  }
  async deleteAbstractMeter(name, domain) {
    return this.delete(`/api/meter/${domain}/${name}`, null, null, (e) => {
      if (e.response.status == 404) {
        this.emitError(`There was a problem trying to delete de abstract meter: ${e.message}`, { code: "del_abstract_meter_error" });
        return true;
      }
    });
  }
  //
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
  async getAssetRules(asset_id) {
    return this.get(`/api/assetRules/asset/${asset_id}`, null, null, (e) => {
      if (e.response.status != 404) {
        this.emitError(`Asset rules not found`, {
          code: "asset_rules_error",
        });
      }
      return true;
    });
  }
  async updateCreateDelete(assetRule, id) {
    return await this.post(`api/assetRules/batch/update-create-delete/${id}`, assetRule, null, null, (e) => {
      if (e.response.status === 404) {
        this.emitError(`Asset rule not added: ${e.message}`, {
          code: "asset_rule_adding_error",
        });
        return true;
      }
    });
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// async deleteMeasurement(id) {
//   return this.axios
//     .delete(`/api/measurements/${id}`, {
//       headers: { "Content-type": "application/json; charset=UTF-8" },
//     })
//     .then((response) => {
//       return response.data;
//     })
//     .catch(function (error) {
//       console.error("delete measurement error" + error.message);
//       if (error.response.status == 404) console.error("measurement not found" + error.message);
//     });
// }
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
