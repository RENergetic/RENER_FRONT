import RenUtils from "./renergetic/utils";
import emitter from "./emitter";
import RestClient from "./renergetic/rest";
import createKeyCloak from "./auth";
const plugin = {};

plugin.install = function (Vue /*, options*/) {
  Vue.config.globalProperties.$keycloak = createKeyCloak(Vue);
  Vue.config.globalProperties.$emitter = emitter;
  Vue.config.globalProperties.$ren = {
    utils: new RenUtils(Vue),
    ...new RestClient(Vue),
  };
  // Vue.config.globalProperties.$pluginLoaded = true;
};

export default plugin;
