import primeview from "./primevue.json";
import menu from "./menu.json";
import headers from "./menu.json";
import view from "./view.json";
import model from "./model.json";
import settings from "./settings.json";
import enums from "./enums.json";
// import alert from "./alert.json";
import notifications from "./notifications.json";
import misc from "./misc.json";
import tileTemplates from "./tile_templates.json";

const pl = {
  // "view": view,
  menu: menu,
  enums: enums,
  view: view,
  model: model,
  headers: headers,
  settings: settings,
  tile_templates: tileTemplates,
  notifications: notifications,
  ...misc,
  ...primeview,
};
export default pl;
