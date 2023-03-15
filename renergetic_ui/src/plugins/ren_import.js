import SettingsDialog from "@/components/miscellaneous/settings/SettingsDialog.vue";
import RenSpinner from "@/components/miscellaneous/RenSpinner";
import RenInput from "@/components/miscellaneous/form/RenInput.vue";
import RenPassword from "@/components/miscellaneous/form/RenPassword.vue";
import RenInputWrapper from "@/components/miscellaneous/form/RenInputWrapper.vue";
import RenSubmit from "@/components/miscellaneous/form/RenSubmit.vue";

const plugin = {};

plugin.install = function (Vue) {
  Vue.component("RenSettingsDialog", SettingsDialog);
  Vue.component("RenSpinner", RenSpinner);
  Vue.component("RenInput", RenInput);
  Vue.component("RenPassword", RenPassword);
  Vue.component("RenInputWrapper", RenInputWrapper);
  Vue.component("RenSubmit", RenSubmit);
}; // installc
export default plugin;
