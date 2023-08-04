
### Grafana ###  
 

* list dashboard :  
    GET `/api/dashboard/` 
    description: list grafana dashboards (dashboardApi.list())   
    

    Return:  list of [information_panel.json](../model/dashboard.json)



### InformationPanel ###  

* list panel :  
    GET `/api/panels`
    description: list information panel
    
    *args*:           
    * ***asset_id*** - return panels for asset 

    Return:  list of [information_panel.json](../model/information_panel.json)

* get panel :  
    GET `/api/panels/${panelId}`
    description: get detailed structure of information panel
    
    *args*:           
    * ***asset_id*** - asset_id 

    Return:   [information_panel.json](../model/information_panel_detailed.json)


** Duplicate **
<!-- * get information panels with the necesary data
  * GET `/api/user/panel/{panelId}`  
  
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
  -->