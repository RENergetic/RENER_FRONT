import { Chart } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
Chart.register(annotationPlugin);

import SettingsDialog from "@/components/miscellaneous/settings/SettingsDialog.vue";

import InfoIcon from "@/components/miscellaneous/InfoIcon.vue";
import RenSpinner from "@/components/miscellaneous/RenSpinner";
import RenPaginator from "@/components/miscellaneous/RenPaginator";
import RenInput from "@/components/miscellaneous/form/RenInput.vue";
import RenInputText from "@/components/miscellaneous/form/RenInputText.vue";
import RenInputNumber from "@/components/miscellaneous/form/RenInputNumber.vue";
import RenSwitch from "@/components/miscellaneous/form/RenSwitch.vue";
import RenPassword from "@/components/miscellaneous/form/RenPassword.vue";
import RenInputWrapper from "@/components/miscellaneous/form/RenInputWrapper.vue";
import RenSubmit from "@/components/miscellaneous/form/RenSubmit.vue";

const plugin = {};

plugin.install = function (Vue) {
  Vue.component("InfoIcon", InfoIcon);
  Vue.component("RenSettingsDialog", SettingsDialog);
  Vue.component("RenSpinner", RenSpinner);
  Vue.component("RenPaginator", RenPaginator);
  Vue.component("RenInput", RenInput);
  Vue.component("RenInputText", RenInputText);
  Vue.component("RenInputNumber", RenInputNumber);
  Vue.component("RenSwitch", RenSwitch);
  Vue.component("RenPassword", RenPassword);
  Vue.component("RenInputWrapper", RenInputWrapper);
  Vue.component("RenSubmit", RenSubmit);
}; // installc
export default plugin;
