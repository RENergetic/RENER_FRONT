Each key must start with 'VUE_APP_'

`VUE_APP_HOST` host

`VUE_APP_DUMMY_API` use dummy data: *Bool*

`VUE_APP_KEY_CLOAK_URL` : Keycloak host,e.g. http://localhost:8080/auth

`VUE_APP_KEY_CLOAK_REALM`: Keycloak realm

`VUE_APP_KEY_CLOAK_CLIENT_ID` Keycloak client id


# KEYCLOAK
VUE_APP_KEY_CLOAK_URL=http://front-ren-prototype.apps.paas-dev.psnc.pl/auth
VUE_APP_KEY_CLOAK_REALM=realm-renergetic
VUE_APP_KEY_CLOAK_CLIENT_ID=renergetic-app

# SERVICES
VUE_APP_API_KEY=
VUE_APP_API_URL=http://front-ren-prototype.apps.paas-dev.psnc.pl
VUE_APP_API_ISLANDS_PATH=/api-postgre/1.0/api/islands
VUE_APP_API_DASHBOARD_PATH=/api-postgre/1.0/api/dashboard
VUE_APP_API_BUILDINGS_PATH=/api-buildings/1.0/api/buildings

# GRAFANA
VUE_APP_GRAFANA_URL=http://grafana-ren-prototype.apps.paas-dev.psnc.pl/d-solo/{dashboard-id}/{dashboard-name}?orgId=1&from=1634427441815&to=1636724258711&theme=light&panelId={panel-id}