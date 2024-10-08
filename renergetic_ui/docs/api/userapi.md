
### register ###
TODO:
* register user: POST `/api/user/register` 
  
    *body*: User

    *example*:
```
{
      TODO:  
}
``` 

### Get user ###
TODO:
* get user: GET `/api/user/info/${keycloak_name}` 
  
    Return:

    *example*:
```
{
      TODO:  
}
```

### user data
* get assets: GET `/api/user/profile`
    description: get current user    
    Return: TODO:

* get assets: GET `/api/user/assets?featured=true`
    description: get current user's assigned (featured) assets - to display in menu / drop down

    Return: list of  [asset.json](../model/asset.json)

* get assets: GET `/api/user/assets?featured=true`
    description: get current user's assigned (featured) assets - to display in menu / drop down
    description: get all assets connected to the user
    *headers* : 

     * user_token *str* - token to identify user

    Return: list of  [asset.json](../model/asset.json)


* list panel :  

    GET `/api/user/panels`
    description: list user panel (userApi.listInformationPanel())

    Return:  list of [information_panel.json](../model/information_panel.json)

* list asset panel :  
    GET `/api/user/asset_panels`
    description: list user panel (userApi.listAssetPanels())
    
    *args*:           
    * ***asset_id*** - return panels for asset 

    Return:  list of [information_panel.json](../model/asset_panel.json.json)

* get demand: 
    GET `/api/user/demand`
    GET `/api/user/demand/assetId/${assetId}`
    description: get current user's demand with data
    
Return: 
```
{
    'demand':  list of  [demand.json](../model/demand.json)
    'data': [data.json](../model/data.json)
}
```
  
