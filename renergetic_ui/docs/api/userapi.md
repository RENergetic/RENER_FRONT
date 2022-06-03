
### register ###
TODO:
* register user: POST `/api/users/register` 
  
    *body*: User

    *example*:
```
{
      TODO:  
}
``` 

### Get user ###
TODO:
* get user: GET `/api/users/info/${keycloak_name}` 
  
    Return:

    *example*:
```
{
      TODO:  
}
```

### user data
* get assets: GET `/api/user`
    description: get current user
    Return: TODO:

* get assets: GET `/api/user/assets?featured=true`
    description: get current user's assigned (featured) assets - to display in menu / drop down
    Return: list of  [asset.json](../model/asset.json)

* get assets: GET `/api/user/assets`
    description: get all assets connected to the user
    Return: list of  [asset.json](../model/asset.json)

* get demand: 
    GET `/api/user/demand`
    GET `/api/user/demand/assetId/${assetId}`
    description: get current user's demand with data
    
    Return: {
      'demand':  list of  [demand.json](../model/demand.json)
      'data': [data.json](../model/data.json)
}
  
