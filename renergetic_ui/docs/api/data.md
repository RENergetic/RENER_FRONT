
### Measurements ### 

* get timeseries : GET `/api/timeseries` 
  
  *args*:      
    * ***prediction***
    * ***date_from***
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
* get current Heat Map State (to colour pollygons on heatmap ): GET `/api/heatmap/state` 
  
  <!-- *args*:      
    * prediction -->


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