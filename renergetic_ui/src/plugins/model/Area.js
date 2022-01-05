export class MapArea {
  constructor(id, points = null) {
    if (points != null) this.points = points;
    else this.points = [];
    this.id = id;
    //for primefaces modules
    this.value = id;
    //TODO: set some label
    this.label = id;
  }
}
