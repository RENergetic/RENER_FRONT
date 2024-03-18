import kpi_electricity from "./kpi_electricity.json";
import kpi_heat from "./kpi_heat.json";
import island_consumption from "./island_consumption.json";
import island_production from "./island_production.json";
import private_dashboard_consumption from "./private_dashboard_consumption.json";
const templates = [
  // "view": view,
  { name: "kpi_electricity", template: JSON.stringify(kpi_electricity) },
  { name: "kpi_heat", template: JSON.stringify(kpi_heat) },
  { name: "island_consumption", template: JSON.stringify(island_consumption) },
  { name: "island_production", template: JSON.stringify(island_production) },
  { name: "private_dashboard_consumption", template: JSON.stringify(private_dashboard_consumption) },
];
export default templates;
