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
  Vue.config.globalProperties.HDR_KUBEFLOW_DEFAULT_PIPELINE = "hdr_default_pipeline";
  Vue.config.globalProperties.HDR_KUBEFLOW_PIPELINE = "hdr_pipeline";
  Vue.config.globalProperties.WASTEHEAT_KUBEFLOW_DEFAULT_PIPELINE = "wasteheat_default_pipeline";
  Vue.config.globalProperties.WASTEHEAT_KUBEFLOW_PIPELINE = "wasteheat_pipeline";
};

export default plugin;
