
Each key must start with 'VUE_APP_'
### Application
`VUE_APP_HOST` *str* - host

`VUE_APP_DUMMY_API` *bool* - use dummy data
`VUE_APP_I18N_LOCALE` *str* - locale code
### KEYCLOAK
`VUE_APP_KEY_CLOAK_URL` *str* - Keycloak host,e.g. http://localhost:8080/auth

`VUE_APP_KEY_CLOAK_REALM` *str* - Keycloak realm

`VUE_APP_KEY_CLOAK_CLIENT_ID` *str* - Keycloak client id

TODO: describe parameters

### RENERGETIC SERVICES
`VUE_APP_API_URL` *str* - ren REST APIs host, e.g. http://front-ren-prototype.apps.paas-dev.psnc.pl
`VUE_APP_API_ISLANDS_PATH` *str* -/api-postgre/1.0/api/islands
`VUE_APP_API_DASHBOARD_PATH` *str* -/api-postgre/1.0/api/dashboard
`VUE_APP_API_BUILDINGS_PATH` *str* -/api-buildings/1.0/api/buildings

### RENERGETIC SERVICES AUTHORIZATION
`VUE_APP_API_KEY` *str* - API key used as header in API requests
`VUE_APP_API_OAUTH` *bool* - true to use OAuth2 to access to the APIs (it get a token from Keycloak to use as API header)
`VUE_APP_API_OAUTH_CLIENT` *str* - Keycloak client to get the tokens
`VUE_APP_API_OAUTH_SECRET` *str* - Keycloak secret to get the tokens

#### GRAFANA
VUE_APP_GRAFANA_URL *str* -http://grafana-ren-prototype.apps.paas-dev.psnc.pl/d-solo/{dashboard-id}/{dashboard-name}?orgId=1&from=1634427441815&to=1636724258711&theme=light&panelId={panel-id}

### HEATMAP
VUE_APP_HEATMAP_TRANSPARENCY=77
VUE_APP_HEATMAP_SELECTED_TRANSPARENCY=CC