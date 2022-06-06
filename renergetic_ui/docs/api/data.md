
### Timeseries ### 

* get timeseries : GET `/api/timeseries` 
  
  *args*:      
    * ***prediction*** - prediction ahead 
    * ***date_from*** - unix timestamp from
    * ***date_to***


*body* (list of measurement ids): 
 ```
 [1,2,3,4]
 ```
 
*example*:
```
{
	"datasets": [{
		"data": [
                  { "x":123234,"y":0.2},{ "x":123254,"y":0.2},
                  { "x":123434,"y":0.52},{ "x":223234,"y":1.2},
                  ],
		"label": "measurement_label"
	}],
 
}
```
### Data ### 
data template
{
	"data": {
		{time_moment}: {
			{function}: {
				{measurement_id}: {value}
			},			
		},		
}
time_moment: current, prediction
function: current(recent value), min, max, ....

* get tile data:  
    GET `/api/data/tile/${tileId}`
    description: get current user's demand
    
    *args*:          
    * ***prediction*** - prediction ahead 
  
    Return: [data.json](../model/data.json)

* get panel data:  
    GET `/api/data/panel/${panelId}`
    description: get current user's demand
    
    *args*:          
    * ***prediction*** - prediction ahead 

    Return:   [data.json](../model/data.json)





### Measurements ###
measurement_type = field influxdb
measurement_name = measurement_name influxdb
asset_name = location tag in influxdb
sensor_name = sensor tag in influxdb

* get measurements: GET `/api/measurement/{measurement_id}` 
  
    _args_ :
  * _function_ , _f_ ***enum*** - "sum", "max", "min", "mean", "median" , "avg"  
  * *date_from* ***long*** - timestamp 
  * *date_to* ***long*** - timestamp
  * *prediction* ***enum*** - prediction ahead

*example*:
```
[
 {
       "timestamp":123234,
       "value":234234
 } ,
 {
       "timestamp":123234,
       "value":234234
 }     
]
```
* get measurements values from InfluxDB: GET `/api/measurement/{measurement_name}/{function}` 
  
    _args_ :
  * _function_ , _f_ ***enum*** - "sum", "max", "min", "mean", "median"
  * *from* ***string*** - date from (yyyy-MM-dd HH:mm:ss) 
  * *to* ***string*** - timestamp (yyyy-MM-dd HH:mm:ss)
  * *bucket* ***string*** - InfluxDB bucket name
  * *field* ***string*** - field to apply the operation
  * others args ***string*** - To filter by tags and its value

*example*:
```
[
  {
    "measurement": "string",
    "fields": {
      "time": "2000-01-01 00:00:00",
      "field_key1": "field_value1",
      "field_key2": "field_value2"
    },
    "tags": {
      "tag_key1": "tag_value1",
      "tag_key2": "tag_value2"
    }
  }
]
```
* get measurement: GET `/api/measurement/{measurement_id}/current`

       _args_ :
    * *prediction* ***enum*** - prediction ahead 
  
 {
       "timestamp":123234,
       "value":234234
 }     
* get measurements values from InfluxDB: GET `/api/measurement/{measurement_name}/{function}` 
  
    _args_ :
  * _function_ , _f_ ***enum*** - "sum", "max", "min", "mean", "median"
  * *from* ***string*** - date from (yyyy-MM-dd HH:mm:ss) 
  * *to* ***string*** - timestamp (yyyy-MM-dd HH:mm:ss)
  * *bucket* ***string*** - InfluxDB bucket name
  * *field* ***string*** - field to apply the operation
  * others args ***string*** - To filter by tags and its value

*example*:
```
[
  {
    "measurement": "string",
    "fields": {
      "time": "2000-01-01 00:00:00",
      "field_key1": "field_value1",
      "field_key2": "field_value2"
    },
    "tags": {
      "tag_key1": "tag_value1",
      "tag_key2": "tag_value2"
    }
  }
]
* put measurement: POST `/api/measurement/{measurement_id}`

       _args_ :
    * *prediction* ***enum*** - prediction ahead 

```
body:
 [{
       "timestamp":123234,
       "value":234234
 } ]
```
* put measurements in InfluxDB: GET `/api/measurement` 
  
    _args_ :
  * *bucket* ***string*** - InfluxDB bucket name

*example*:
```
[
  {
    "measurement": "string",
    "fields": {
      "time": "2000-01-01 00:00:00",
      "field_key1": "field_value1",
      "field_key2": "field_value2"
    },
    "tags": {
      "tag_key1": "tag_value1",
      "tag_key2": "tag_value2"
    }
  }
]
```
###  influxdb Measurements API ###
for 3rd parties or some specific ui API
 * get measurements, GET: 
   * `/api/measurement/asset/${asset_name}/domain/${domain_name}/type/${measurement_type}` 
   * `/api/measurement/asset/${asset_name}/type/${measurement_type}` 
   * `/api/measurement/asset/${asset_name}/domain/${domain_name}`
   * `/api/measurement/asset/${asset_name}`

       _args_ :
    * *prediction* ***enum*** - prediction ahead 
    * *direction* ***enum*** - 1,-1, 0 - to discuss
    * *measurement_name* ***enum***: influxdb_measurement_name
    * 
*example*:

```
 [{
 	"domain": domain,
 	"type": type,
 	"direction": direction,
 	"measurement_name": measurement_name,
 	"data": { 
 		"current": {
 			"default": {
 				"1": 33
 			},
 			"max": {
 				"1": 33
 			},
 		},
 		"prediction": {
 			"default": {
 				"1": 33
 			},
 			"max": {
 				"1": 33
 			},
 		}

 	}
 }]
 ``` 
  * put measurements, POST: 
   * `/api/measurement/asset/${asset_name}/domain/${domain_name}/type/${measurement_type}` 
   * `/api/measurement/asset/${asset_name}/type/${measurement_type}` 
   * `/api/measurement/asset/${asset_name}/domain/${domain_name}`
   * `/api/measurement/asset/${asset_name}`

       _args_ :
    * *prediction* ***enum*** - prediction ahead 
    * *direction* ***enum*** - 1,-1, 0 - to discuss
    * *measurement_name* ***enum***: influxdb_measurement_name
  *body*:
  ```
   [
      {
            "domain":domain,
            "type":type,
            "direction":direction,
            "measurement_name":measurement_name,         
            "values":[
                  {
                  "timestamp":123234,
                  "value":234234,       
                  }
            ]
      } 
 ] 
 ```



<!-- * get current Heat Map State (to colour pollygons on heatmap ): GET `/api/heatmap/state` 
  
 *args*:      
    * prediction  


*body* (list of measurement ids): 
 ```
 [1,2,3,4]
 ```
 
*example*:
```
{
	"datasets": [{
		"data": [
                  { "x":123234,"y":0.2},{ "x":123254,"y":0.2},
                  { "x":123434,"y":0.52},{ "x":223234,"y":1.2},
                  ],
		"label": "measurement_label"
	}],
 
}
``` -->