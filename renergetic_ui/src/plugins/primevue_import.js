import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import AutoComplete from "primevue/autocomplete";
import Button from "primevue/button";
import CheckBox from "primevue/checkbox";
import Panel from "primevue/panel";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup";
import Tooltip from "primevue/tooltip";
import Textarea from "primevue/textarea";
import InputNumber from "primevue/inputnumber";
import RadioButton from "primevue/radiobutton";
import ToggleButton from "primevue/togglebutton";
const plugin = {};

plugin.install = function (Vue /*, options*/) {
  Vue.component("InputText", InputText);
  Vue.component("Dropdown", Dropdown);
  Vue.component("AutoComplete", AutoComplete);
  Vue.component("Button", Button);
  Vue.component("Panel", Panel);
  Vue.component("DataTable", DataTable);
  Vue.component("Column", Column);
  Vue.component("ColumnGroup", ColumnGroup);
  Vue.component("CheckBox", CheckBox);
  Vue.component("Textarea", Textarea);
  Vue.component("InputNumber", InputNumber);
  Vue.component("RadioButton", RadioButton);
  Vue.component("Tooltip", Tooltip);
  Vue.component("ToggleButton", ToggleButton);
}; // install

export default plugin;
