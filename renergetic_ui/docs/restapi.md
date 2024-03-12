TODO: describe API
## REST API description
general parameters
default parameters:
- 'o','offset' - skip 'n' rows
- 'l','limit' - number of returned rows
date filter
- 'from' - unix timestamp, [ms]
- 'to' - unix timestamp, [ms]
- 'prediction' - TODO: 
- user's id is inferred from auth headers transparent to the UI client

### Dashboard
panel structures , heat maps, grafana dashboards
backend: [dashboard](./api/dashboard.md)
vue:
* list() - returns list of grafana based dashboards available for the user. 
* add(dashboard) - add grafana dashboard
* delete(dashboard) - delete grafana  dashboard
* informationPanelList() - returns list of information panels to the user. 
* getInformationPanel(id) - get information panel with details by it
* 
<!-- * listHeatMap  - returns list of grafana based dashboards to the user. 
* getHeatMap(id) -  get heatmap by id
* addHeatMap(heatmap) -->
### Wrapper API
get all metadata for the view
(@/plugins/renergetic/ren_api/wrapper_api.js)

### Data API
api for data aquuisition
backend: [dashboard](./api/data.md) 

 

### management
manage resources in the energy island. Add roles create connections etc
backend: [management](./api/management.md)
vue: todo:


### admin

### user
user api
backend: [user api](./api/userapi.md)
vue: todo: