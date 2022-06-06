
### Asset ###

* get assets: GET `/api/assets`  
  
    *args* : 
        
      * query *str* - search by  string 
      * type *str* - filter by type

      Return: list of  [asset.json](../model/asset.json)

* get asset: GET `/api/assets/${id}` ,`/api/assets/name/${name}` 
   
      Return: [asset.json](../model/asset.json)

 * add asset: POST  `/api/assets` 
  
    *body* :   [asset.json](../model/asset.json)


* delete asset: DELETE `/api/assets/${id}`  
  
* get asset: GET `/api/assets/types`
  description: get asset types 

*example*:
```
[
      'building', 'heat_pump'
]
```

* set connection: POST `/api/assets/${id}/connection`  
  
    ***body***: [connection](../model/asset_connection.json)
    or
    POST `/api/assets/${id}/connection/asset/${id}/type/${type}`  
* delete connection: DELETE `/api/assets/${id}/connection/asset/${id}`  


### Asset by user ###

* get assets related with a user: GET `/api/user/assets`  
  
    *headers* : 
        
      * user_token *str* - token to identify user

      Return: list of  [asset.json](../model/asset.json)

### Measurements


* get measurements: 
  * GET `/api/measurements/schema`      
  description - add new definition

*example*:
```
[
      {
            "id": "2",
            "type": {
                  "id": 1,
                  "name": "type_name",
                  "label": "type's label",
                  "base_unit": "Wh",
                  "unit": "kWh",
                  "metric_type": "metrics_type",
                  "factor": "1000",
                  "color": "#FFFFFF"
            },
            "name": "m_2", //measurement_name in influxdb
            "label": "M 2",
            "direction": 1,
            "description": "avg",
            "icon": "electricity", //could be removed
            "domain": "electricity",
            "sensor_name":"sensor_name", //to discuss
            "asset_id": 1, //related asset 
            "measurement_details": {
                          "color": "#5C6BC0"
            }
    
}
]
``` 
* get measurements: 
  * GET `/api/measurements/schema/id/${id}`      
  

*example*:
``` 
      {
            "id": "2",
            "type": {
                  "id": 1,
                  "name": "type_name",
                  "label": "type's label",
                  "base_unit": "Wh",
                  "unit": "kWh",
                  "metric_type": "metrics_type",
                  "factor": "1000",
                  "color": "#FFFFFF"
            },
            "name": "m_2", //measurement_name in influxdb
            "label": "M 2",
            "direction": 1,
            "description": "avg",
            "icon": "electricity", //could be removed
            "domain": "electricity",
            "sensor_name":"sensor_name", //to discuss
            "asset_id": 1, //related asset 
            "measurement_details": {
                          "color": "#5C6BC0"
            }
    
} 
``` 

* update schema: 
  * PUT `/api/measurements/schema/id/${measurement_id}`   

*body*:
```
      {
            "id": "2",
            "type": {
                  "id": 1,
                  "name": "type_name",
                  "label": "type's label",
                  "base_unit": "Wh",
                  "unit": "kWh",
                  "metric_type": "metrics_type",
                  "factor": "1000",
                  "color": "#FFFFFF"
            },
            "name": "m_2", //measurement_name in influxdb
            "label": "M 2",
            "direction": 1,
            "description": "avg",
            "icon": "electricity", //could be removed
            "domain": "electricity",
            "sensor_name":"sensor_name", //to discuss
            "asset_id": 1, //related asset 
            "measurement_details": {
                          "color": "#5C6BC0"
            }
    
}

``` 
### Demand
(for managers users only) 

* get demands: 
  * GET `/api/demand/assetId/${assetId}`      
  * GET `/api/demand` 
  current recommendation list (data is not required we wont present for manager pie chart)
   return: list of  [demand.json](../model/demand.json)

* POST demand schedule:     
  * GET `/api/demand/schedule` 
   BODY: list of  [demand_schedule.json](../model/demand_schedule.json)

* PUT demand :     
  * GET `/api/demand/definition` 
   BODY: list of  [demand_definition.json](../model/demand_definition.json)

### Information Panel
* get information panels with the necesary data
  * GET `/api/user/panel/{panel_name}`  
  
    *headers* : 
        
      * user_token *str* - Header to identify the necessary assets measurements and demands

  
    *args* : 
        
      * panel_id *int* - Path param to identify the panel
*example*:
```
{
    "id": 0,
    "name": "panel_name",
    "label": "Panel Label",
    "owner_id": null,
    "is_template": false,
    "tiles": [
        {
            "tile_id": 0,
            "name": "tile_name",
            "label": "Tile Label",
            "type": "knob",
            "assets":[
                {
                    "id": 0,
                    "asset_type": "type_name",
                    "name": "asset_name",
                    "label": "Optional label",
                    "geo_location": "location",
                    "measurements": [
                        {
                            "name": "measurement_name",
                            "last": "0.0",
                            "avg": "0.0",
                            "total": "0.0"
                        }
                    ],
                    "demands": [
                        {
                            "id": 0,
                            "demand_start": "yyyy-MM-dd HH:mm:ss",
                            "demand_stop": "yyyy-MM-dd HH:mm:ss",
                            "update_date": "yyyy-MM-dd HH:mm:ss",
                            "action_type": "enum",
                            "action": "enum",
                            "message": "demand message",
                            "ext": "something"
                        }
                    ]
                }
            ],
            "layout": "{'x': 0, 'y': 0}",
            "props": null
        }
    ]
}
```