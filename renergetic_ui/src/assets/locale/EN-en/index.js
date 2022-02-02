import primeview from "./primevue.json";
import menu from "./menu.json";
import view from "./view.json";
import model from "./model.json";
import settings from "./settings.json";

const en = {
  // "view": view,
  menu: menu,
  view: view,
  model: model,
  settings: settings,
  ...primeview,
};
export default en;
