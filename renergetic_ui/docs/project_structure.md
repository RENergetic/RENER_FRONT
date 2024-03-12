## Project Structure

* .vscode - config files for visual studio code 
* public - static, resources files a
* src - [project sources](#src-directory) 
* src/assets - [project assets](#assets) 
* src/assets/styles - [project styles](#styles) 
* src/assets/locales - [project language keys](#locales) 
* src/views - [project views](#views) 
* src/components - [project components](#components) 
* src/plugins - [project plugins](#plugins) 
* src/router - [vuejs router](#router) 
* src/store - [session data](#store) 
* .env - environmental config, [description](./env.md)

 
### Src directory 
#### Assets 
    
* `/locales/{language code}` -> language translation dictionary
  * `/index.js` -> import file
  * `/menu.json` -> menu headers
  * `/settings.json` -> user settings labels
  * `/view.json` -> miscellaneous ui keys
  * `/primveue.json` -> primevue components localization
  * `/model.json` -> object's properties/attributes
  * `/tile_templates` -> tile templates
  * `/enum.json` -> enum translations
* `/dummy` -> test  data
* `/img` -> img files
  * `/tileicons` 
* `/styles` -> ren styles   
* `logo.png` -> main logo

[top](#project-structure) 

#### Styles

* Renergetic style class - prefix: 'ren-'
* variables.scss - configurable variables
* ren.scss - global classes , primefaces modifications
  
[top](#project-structure)  

#### Locales

*  view (```view.*```)- general components items
*  error - error messages (located in misc.json)
*  information - information messages (located in misc.json)
*  primevue.json - primevue library components translatons
*  menu - menu options 
* `/locales/{language code}` -> language translation dictionary
  * `/index.js` -> import file
  * `/menu.json` -> menu headers
  * `/settings.json` -> user settings labels
  * `/view.json` -> miscellaneous ui keys
  * `/primveue.json` -> primevue components localization
  * `/model.json` -> object's properties/attributes
  * `/tile_templates` -> tile templates
  * `/enum.json` -> enum translations

[top](#project-structure)  

#### Views
Page's layout templates  
* admin -> system management views like: user management, privilages management 
* dashboard -> data view templates  
* management -> views related to energy island management and data view templates
* user - user related views
* public - views for non registered users
* Home.vue -> homepage
  
[top](#project-structure) 

#### Components

reused modules included in the views or other components
* admin -> system management components like: user management, privileges management
* dashboard -> data modules, grafana, information panel
  * grafana -> grafana
  * informationpanel -> main data view components
  * ~~area -> components related with heatmap/area,  Openstreet map integration~~
  * measurements -> measurements/sensors view, management  
* ~~ev -> electric vehicles modules ~~
* management -> modules related to energy island management , demand &notification definition 
* miscellaneous - other components , spinners, form elements. 
  * settings - settings templates 
  * RenSpinner [docs](./components/renspinner.md)
  * RenPaginator [docs](./components/renpaginator.md)
  * form [docs](./components/form.md)
* user - user based modules
  
[top](#project-structure) 

#### Plugins
`/src/plugins`
* `/model` -> classes/object definitions: [model](./model.md)
* `/renergetic` -> renergetic js modules, accessed by `this.$ren`
  * `/ren_api` -> REST API, `this.$ren.{apiName}` , apiName:  [`dashboardApi`,`dataApi`,`managementApi`,`userApi`,`userApi`] 
  * `/utils.js` -> miscellaneous functions `this.$ren.utils`
* `ren_import.js` -> import global ren components (all global ren components starts with prefix `Ren`)
* `primevue_import.js` -> import global primevue components  
* `ren_plugins.js` -> import global renergetic components  
* `validators.js` -> custom renegetic validators
  
[top](#project-structure) 

#### Router
`index.js` -> router main file
routes are divided into sections:
* admin.js
* dashboard.js 
* managemnt.js 
* user.js
  
[top](#project-structure) 

#### Store
session storage modules:
* `auth`- user auth data. Component role verification: 

 ```RenRoles.REN_USER & this.app.$store.getters["auth/renRole"] ```
* `view` -  components state and data
* `settings` - user's settings

[top](#project-structure) 

#### 