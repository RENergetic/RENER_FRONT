
### Asset ###

* get assets: GET `/api/assets` 
  
    *args* : 
        
      * query *str* - search by  string 
      

    *example*:
```
[{
      TODO:  
}]
``` 
* get asset: GET `/api/assets/${id}` ,`/api/assets/name/${name}` 
   

    *example*:
```
{
      TODO:  
}
``` 

 * add asset: POST  `/api/assets` 
  
    *body* :  asset json

    *example*:
```
{
      TODO:  
]
``` 

* delete asset: DELETE `/api/assets/${id}`  
  
* get asset: GET `/api/assets/type` 

*example*:
```
{
      TODO:  
]
``` 

### Measurements


* get measurements: 
  * GET `/api/measurements/schema`      
  

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
(for authorized users only) 

* get demands: 
  * GET `/api/demandrequests/assetId/${assetId}`      
  * GET `/api/demandrequests` 

*example*:
```
{
      TODO:  
]
``` 