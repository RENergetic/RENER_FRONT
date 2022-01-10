export class MapArea {
  constructor(id, imgurl, areas = null) {
    if (areas != null) this.areas = areas;
    else this.areas = [];
    this.id = id;
    this.imgurl = imgurl;
    //TODO: set some label
    this.label = id;
  }
}
