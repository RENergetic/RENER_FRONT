import kpi_electricity from "./kpi_electricity.json";
import kpi_heat from "./kpi_heat.json";
import island_consumption from "./island_consumption.json";

const templates = [
  // "view": view,
  { name: "kpi_electricity", template: JSON.stringify(kpi_electricity) },
  { name: "kpi_heat", template: JSON.stringify(kpi_heat) },
  { name: "island_consumption", template: JSON.stringify(island_consumption) },
];
export default templates;
