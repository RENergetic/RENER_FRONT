## REST API description


### Dashboard

* list - returns list of grafana based dashboards available for the user. 
* add(dashboard) - add dashboard
* delete(dashboard) - delete dashboard
* informationPanelList() - returns list of information panels to the user. 
* getInformationPanel(id) - get information panel with details by it
 
### Measurement API
Each resource has unique id and  list of possible measurements

* getMeasurement(resourceId,measurements) -
    * measurements - list of measurements, possible values: 'heat','power',...  ,empty = all TODO:

getCurrentMeasurements -> TODO:

* getMeasurements(resourceIds,measurements) -
    * measurements - list of measurements, possible values: 'heat','power',...  ,empty = all TODO:

* getPanelMeasurements(informationPanel)  -> TODO:
* getHeatmapMeasurements(Heatmap)  -> TODO:

### Area 
* listHeatMap  - returns list of grafana based dashboards to the user. 
* getHeatMap(id) -  get heatmap by id
* addHeatMap(heatmap)
      