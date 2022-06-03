
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

 