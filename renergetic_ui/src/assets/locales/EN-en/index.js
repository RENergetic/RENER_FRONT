import primeview from "./primevue.json";
import menu from "./menu.json";
import view from "./view.json";
import model from "./model.json";
import settings from "./settings.json";
import enums from "./enums.json";
import error from "./error.json";
import notifications from "./notifications.json";

import tileTemplates from "./tile_templates.json";

const en = {
  // "view": view,
  menu: menu,
  enums: enums,
  view: view,
  model: model,
  settings: settings,
  tile_templates: tileTemplates,
  notifications: notifications,
  error: error,
  ...primeview,
};
export default en;
