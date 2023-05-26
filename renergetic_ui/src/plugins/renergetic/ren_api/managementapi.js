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
  async listAsset(params = undefined, offset = 0, limit = 20) {
    // Params: category, type, name, owner_id, parent_id
    //TODO: add filtering in the backed
    if (params) {
      params.offset = offset;
      params.limit = limit;
    } else params = { offset: offset, limit: limit };
    return this.get(`/api/assets`, params);
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
  async submitAssetConnection(assetId, connectedAssetId, type) {
    console.log("assetId", assetId);
    console.log("connectedAssetId", connectedAssetId);
    console.log("type", type);
    await this.put(`/api/assets/connect/${assetId}?connect_to=${connectedAssetId}&type=${type}`, null, null, null, (e) => {
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

  async setParent(asset, parentId) {
    const assetCopy = {
      id: asset.id,
      name: asset.name,
      type: asset.type.id,
      label: asset.label,
      description: asset.description,
      geo_location: asset.geo_location,
      parent: parentId,
      user: asset.user,
      asset_category: asset.category,
      dashboards: asset.dashboards,
    };
    return this.put(`/api/assets/${asset.id}`, assetCopy, null, null, (e) => {
      if (e.response.status === 404) {
        this.emitError(`${asset.id} not found: ${e.message}`, { code: "asset_not_found", args: [asset.id] });
      } else {
        this.emitError(`PUT /api/assets/${asset.id} -${e.message}`);
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

  async listMeasurement(params = undefined, offset = 0, limit = 20) {
    if (!params) {
      params = {};
    }
    return this.get(`/api/measurements`, {
      headers: { "Content-type": "application/json; charset=UTF-8" },
      params: { ...params, offset: offset, limit: limit },
    });
  }

  async updateMeasurement(measurement) {
    // TODO: -> only allow to update labels ,  color, and key-value properties
    if (measurement.type != undefined) measurement.type = measurement.type.id;
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

  async getMeasurement(id) {
    return this.get(`/api/measurements/${id}`, null, null, (e) => {
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
  async addMeasurement(measurement) {
    if (measurement.type != undefined) measurement.type = measurement.type.id;
    return this.axios
      .post(`/api/measurements`, measurement, {
        headers: { "Content-type": "application/json; charset=UTF-8" },
      })
      .then((response) => {
        return response.data;
      })
      .catch(function (error) {
        console.error("add measurement error" + error.message);
      });
  }
  async searchMeasurement(q) {
    if (q === "") {
      return [];
    }
    return await this.get(`/api/measurements`, { name: q }, null, null);
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
