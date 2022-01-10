const keys = ["dashboard"];

class Storage {
  constructor() {
    this.data = {};
    this.load();
  }
  clear() {
    for (const k of keys) {
      sessionStorage.setItem(k, null);
    }
  }
  load() {
    for (const k of keys) {
      var j = sessionStorage.getItem(k);
      var o = JSON.parse(j);
      this.data[k] = o;
    }
  }
  async update(k, o) {
    this.data[k] = o;
    sessionStorage.setItem(k, JSON.stringify(o));
  }
  async get(k, defaultValue = null) {
    let d = this.data[k];
    return d == null ? defaultValue() : d;
  }
}
var storage = new Storage();
export default storage;
