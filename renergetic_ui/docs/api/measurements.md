
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
* get measurement: GET `/api/measurement/{measurement_id}/current`

       _args_ :
    * *prediction* ***enum*** - prediction ahead 
  
 {
       "timestamp":123234,
       "value":234234
 }     
* put measurement: POST `/api/measurement/{measurement_id}`

       _args_ :
    * *prediction* ***enum*** - prediction ahead 
    * 
body:
 [{
       "timestamp":123234,
       "value":234234
 } ]

###  influxdb Measurements API ###
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