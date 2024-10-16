//
import AutoComplete from "primevue/autocomplete";
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import Card from "primevue/card";
// import Chart from "primevue/chart";
import CheckBox from "primevue/checkbox";
import DataTable from "primevue/datatable";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import Panel from "primevue/panel";
import ScrollPanel from "primevue/scrollpanel";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup";
import Tooltip from "primevue/tooltip";
import Textarea from "primevue/textarea";
import InputNumber from "primevue/inputnumber";
import RadioButton from "primevue/radiobutton";
import ToggleButton from "primevue/togglebutton";
import Dialog from "primevue/dialog";
import Password from "primevue/password";
import Message from "primevue/message";
import Toolbar from "primevue/toolbar";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import FileUpload from "primevue/fileupload";
import Listbox from "primevue/listbox";
import Tree from "primevue/tree";
import Slider from "primevue/slider";
import MultiSelect from "primevue/multiselect";

// import Paginator from "primevue/paginator";

import Accordion from "primevue/accordion";

import AccordionTab from "primevue/accordiontab";
const plugin = {};

plugin.install = function (Vue /*, options*/) {
  Vue.component("InputText", InputText);
  Vue.component("Dropdown", Dropdown);
  Vue.component("AutoComplete", AutoComplete);
  Vue.component("Button", Button);
  Vue.component("Panel", Panel);
  Vue.component("DataTable", DataTable);
  Vue.component("MultiSelect", MultiSelect);
  Vue.component("Column", Column);
  Vue.component("ColumnGroup", ColumnGroup);
  Vue.component("CheckBox", CheckBox);
  Vue.component("Textarea", Textarea);
  Vue.component("InputNumber", InputNumber);
  Vue.component("RadioButton", RadioButton);
  Vue.component("Tooltip", Tooltip);
  Vue.component("ToggleButton", ToggleButton);
  Vue.component("Dialog", Dialog);
  Vue.component("Password", Password);
  Vue.component("Message", Message);
  Vue.component("Toolbar", Toolbar);
  Vue.component("TabView", TabView);
  Vue.component("TabPanel", TabPanel);
  Vue.component("Card", Card);
  Vue.component("FileUpload", FileUpload);
  Vue.component("Listbox", Listbox);
  Vue.component("Tree", Tree);
  Vue.component("Accordion", Accordion);
  Vue.component("AccordionTab", AccordionTab);
  Vue.component("ScrollPanel", ScrollPanel);
  Vue.component("Calendar", Calendar);
  Vue.component("Slider", Slider);
  // Vue.component("Chart", Chart);
  // Vue.component("Paginator", Paginator);
}; // install
export default plugin;
