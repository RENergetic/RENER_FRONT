import SettingsDialog from "@/components/miscellaneous/settings/SettingsDialog.vue";

const plugin = {};

plugin.install = function (Vue) {
  Vue.component("SettingsDialog", SettingsDialog);
}; // install
export default plugin;
