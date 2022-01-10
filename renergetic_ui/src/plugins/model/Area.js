export class MapArea {
  constructor(id, points = null, dashboardId = null) {
    if (points != null) this.points = points;
    else this.points = [];
    this.id = id;
    //for primefaces modules
    this.value = id;
    //TODO: set some label
    this.label = id;
    //Grafana's dashboard id
    this.dashboardId = dashboardId;
  }
}
