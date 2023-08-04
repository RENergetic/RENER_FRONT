import RestComponent from "./restcomponent";
export class QueryBuilder {
  calls = {};
  build() {
    return { calls: this.calls };
  }
  assets(offset = 0, limit = 10, id) {
    this.calls["assets"] = {
      offset: offset,
      limit: limit,
      id: id,
    };
    return this;
  }
  dashboards(offset = 0, limit = 10, id) {
    this.calls["dashboards"] = {
      offset: offset,
      limit: limit,
      id: id,
    };
    return this;
  }
  data(from, to, panelId) {
    var d = {
      from: from,
    };
    if (!from) {
      d["from"] = Date.now() - 3600 * 12 * 1000;
    }

    if (to) {
      d["to"] = to;
    }
    if (panelId) {
      d["panel_id"] = panelId;
    }
    this.calls["data"] = d;
    return this;
  }
  demands(offset = 0, limit = 10) {
    this.calls["demands"] = {
      offset: offset,
      limit: limit,
    };
    return this;
  }
  panels(offset = 0, limit = 10, id) {
    this.calls["panels"] = {
      offset: offset,
      limit: limit,
      id: id,
    };
    return this;
  }
  measurementTypes() {
    //offset = 0, limit = 10) {
    this.calls["measurement_types"] = {};
    return this;
  }
  assetMetaKeys() {
    this.calls["asset_metakeys"] = {};
    return this;
  }

  assetPanels(offset = 0, limit = 10) {
    this.calls["asset_panels"] = {
      offset: offset,
      limit: limit,
    };
    return this;
  }
}

export default class WrapperApi extends RestComponent {
  constructor(axiosInstance, vueInstance) {
    super(axiosInstance, vueInstance);
  }

  get(query) {
    // TODO user id -> remove
    // const userId = "/" + this.USER_ID;
    console.info("query: " + JSON.stringify(query));
    return this.post(`/api/ui/wrapper`, query, null, null);
  }
  /** 
    * 
    * 
{
  "assets": [
    {
      "id": 0,
      "name": "string",
      "type": {
        "id": 0,
        "name": "string",
        "label": "string",
        "category": "string"
      },
      "label": "string",
      "description": "string",
      "geo_location": "string"
    }
  ],
  "data": {
    "current": {
      "default": {
        "additionalProp1": 0,
        "additionalProp2": 0,
        "additionalProp3": 0
      },
      "max": {
        "additionalProp1": 0,
        "additionalProp2": 0,
        "additionalProp3": 0
      }
    },
    "prediction": {
      "default": {
        "additionalProp1": 0,
        "additionalProp2": 0,
        "additionalProp3": 0
      },
      "max": {
        "additionalProp1": 0,
        "additionalProp2": 0,
        "additionalProp3": 0
      }
    }
  },
  "demands": [
    {
      "id": 0,
      "asset_id": 0,
      "demand_definition": {
        "id": 0,
        "action": "string",
        "message": "string",
        "ext": "string",
        "action_type": "string",
        "information_tile_id": 0
      },
      "demand_start": 0,
      "demand_stop": 0,
      "demand_update": 0
    }
  ],
  "panels": [
    {
      "id": 0,
      "name": "string",
      "label": "string",
      "tiles": [
        {
          "id": 0,
          "name": "string",
          "label": "string",
          "type": "knob",
          "featured": true,
          "measurements": [
            {
              "id": 0,
              "name": "string",
              "label": "string",
              "description": "string",
              "icon": "string",
              "type": {
                "id": 0,
                "name": "string",
                "label": "string",
                "unit": "string",
                "factor": 0,
                "color": "string",
                "base_unit": "string",
                "description": "string"
              },
              "domain": "heat",
              "direction": "in",
              "sensor_name": "string",
              "measurement_details": [
                {
                  "key": "string",
                  "value": "string",
                  "measurement_id": 0
                }
              ]
            }
          ],
          "props": {
            "empty": true
          },
          "layout": {
            "empty": true
          },
          "panel": "string"
        }
      ]
    }
  ],
  "asset_panels": [
    {
      "asset": {
        "id": 0,
        "name": "string",
        "label": "string"
      },
      "panel": {
        "id": 0,
        "name": "string",
        "label": "string"
      }
    }
  ]
}
    * 
    */
}
// export { QueryBuilder };
