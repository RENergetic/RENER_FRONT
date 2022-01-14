import primeview from "./primevue.json";
import menu from "./menu.json";
import view from "./view.json";
import model from "./model.json";

const pl = {
  // "view": view,
  menu: menu,
  view: view,
  ...model,
  ...primeview,
};
export default pl;
