TODO: restApiName - describe
### VUEJS api
* `this.$ren` -> renergetic plugins reference
  * `this.$ren.{restApiName}` -> REST API
  * `this.$ren.utils` -> utils
* `this.$t` -> i18n plugin
* `this.$store` -> session store, store sections
  * view - some view config
  * auth - auth/profile details
  * settings - apllication settigns provided by the user
* `this.$emitter` - global emitter ( [see](#emitter))
* 
  example: `$store.getters["view/get"]` - get user
* `this.$confirm` -> confirm dialog (YES/NO)
* `v-tooltip`  -> tooltip attribute for templates
*  

### colors & icons
https://materialui.co/colors

https://fontawesome.com/search?q=open&o=r&s=solid
https://www.primefaces.org/primevue/icons

### Router
Meta parameter description:
* isAuthenticated: **bool** - true=enable authentication
* layout: **enum** - *standard*, *fullscr*
* roles: **array** - available roles ["ren-manager","ren-technical-manager", "ren-admin", "ren-guest","ren-user","ren-dev","ren-staff","ren-visitor"]. 
* ```$emit("UpdateMenu", args)``` - request menu update, emit event from router View to sidemenu  

### Emitter
Example usage: ```$emitter.emit("error", { message: msg }```
(It's better to not overuse global event bus - only when it's really necessary. By default it's better to use standars $emit)
Global events (```$emitter.on``` -> App.vue):
* ```refresh``` - request reload of components
* ```error``` - emit error
* ```information``` - emit information



### Role management
[roles](roles.xlsx) - role overview
  
compute user's role flag

```
user_role_flag  = user_roles.reduce((flag,user_role)=>flag |user_role,0x0)
```
compute required flags for the protected section
```
required_flags = RenRoles.REN_ADMIN | RenRoles.REN_TECHNICAL_MANAGER ;
```
verify user
```
if ((required_flags & user_role_flag) > 0)
  //has acccess
  
```

### Store

* ```settings/```
  * ```filter``` - 
  * ```home```
  * ```panel```
  * ```conversion``` - measurement's unit settings
* ```auth/```
  * ```renRole``` - current user's role bit mask
* ```view/``` - 
  * ```assetTypes``` - list of all types
  * ```assetCategories```  - list of all categories
  * ```assetDetailsKeys``` - list of all asset details' keys
  * ```dashboards``` - list of all dashboards user has rights
  * ```measurementTypes``` - list of all measurement types
  * ```demands``` - current demand list
  * ```convertValue``` - conversion function - (current_measurement_type, value_to_convert, new_measurement_unit ) 
  * ```informationPanels``` - ordered list of panels 
  * ```informationPanelsMap``` - dictionary of panels