import SettingsDialog from "@/components/miscellaneous/settings/SettingsDialog.vue";
import RenSpinner from "@/components/miscellaneous/RenSpinner";

const plugin = {};

plugin.install = function (Vue) {
  Vue.component("RenSettingsDialog", SettingsDialog);
  Vue.component("RenSpinner", RenSpinner);
}; // install
export default plugin;
