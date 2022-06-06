
### Grafana ###  
todo:

### InformationPanel ###  

* list panel :  
    GET `/api/panel`
    description: list information panel
    
    *args*:           
    * ***asset_id*** - return panels for asset 

    Return:  list of [information_panel.json](../model/information_panel.json)

* get panel :  
    GET `/api/panel/${panelId}`
    description: get current user's demand
    
    *args*:           
    * ***asset_id*** - asset_id 

    Return:   [information_panel.json](../model/information_panel.json)


 