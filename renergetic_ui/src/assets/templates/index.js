import kpi_electricity from "./kpi_electricity.json";
import kpi_heat from "./kpi_heat.json";

const templates = [
  // "view": view,
  { name: "kpi_electricity", template: JSON.stringify(kpi_electricity) },
  { name: "kpi_heat", template: JSON.stringify(kpi_heat) },
];
export default templates;
