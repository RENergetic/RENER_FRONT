import primeview from "./primevue.json";
import menu from "./menu.json";
import view from "./view.json";
import model from "./model.json";

const es = {
  // "view": view,
  menu: menu,
  view: view,
  model: model,
  ...primeview,
};
export default es;
