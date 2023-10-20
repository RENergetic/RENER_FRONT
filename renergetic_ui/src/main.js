import { createApp } from "vue";
import App from "./App.vue";
import createRouter from "./router";
import store from "./store";
import i18n from "./plugins/locales";
import PrimeVue from "primevue/config";
//import renergetic plugins
//renergetic plugins this.$ren.{plugin}
import plugin from "./plugins/ren_plugins";
//import primevue plugins
import PrimeImport from "./plugins/primevue_import";
import RenImport from "./plugins/ren_import";
import Fonts from "./plugins/fonts";
import "primevue/resources/themes/saga-green/theme.css";
// theme showcase: https://www.primefaces.org/primevue/showcase/
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
//https://www.primefaces.org/primevue/showcase/#/primeflex
import "primeflex/primeflex.css";
import "./assets/styles/ren.scss";
import VueKonva from "vue-konva";

import Tooltip from "primevue/tooltip";
import ToastService from "primevue/toastservice";

import ConfirmationService from "primevue/confirmationservice";

// import mitt from 'mitt'
// const emitter = mitt()

//initialize app

const app = createApp(App);
app.use(i18n);
//TODO: if normal user?
app.use(VueKonva);
// app.use(PrimeVue, { locale: PrimeLocale });
app.use(PrimeVue);
app.use(PrimeImport);
app.use(RenImport);
app.use(Fonts);
app.directive("tooltip", Tooltip);

app.use(ToastService);
app.use(ConfirmationService);
app.config.globalProperties.$t = i18n.global.t;
app.config.globalProperties.$te = i18n.global.te;

app.use(store);
app.use(plugin);
app.use(createRouter(app));
app.mount("#app");
