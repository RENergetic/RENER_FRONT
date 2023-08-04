function init(m) {
  let k = Object.entries(m)
    .filter(([, value]) => typeof value !== "function")
    .map((it) => it[0]);
  // let valueMap = new Map(
  //   Object.entries(m)
  //     .filter(([, value]) => typeof value !== "function")
  //     .map((it) => [it[1], it[0]]),
  // );
  // Object.keys(m.filter())

  return Object.freeze({ ...m, keys: () => k, values: () => Object.values(m) });
}
const Colors = Object.freeze({
  OK: "#8fe388",
  WARNING: "#ffa059",
  ERROR: "#de0000",
  SELECTED: "#0a0fc9",
  DEFAULT: "#eaeef5",
});
const HeatMapType = Object.freeze({
  OSM: "osm",
  DEFAULT: "default",
});
//TODO: load it from  backennd
// const AssetTypes = Object.freeze({
//   BUILDING: "building",
//   FLAT: "flat",
//   HEAT_SOURCE: "heat_source",
//   ISLAND: "island",
//   PV: "pv",
// });
// const AssetDetailsKeys = Object.freeze({
//   COLOR: "color",
//   PREDICTION_MODEL: "prediction_model",
// });

const MeasurementDetailsKeys = Object.freeze({
  COLOR: "color",
  PREDICTION_MODEL: "prediction_model",
});

const DemandActionType = Object.freeze({
  INCREASE: "increase",
  DECREASE: "decrease",
});

const TileTypes = Object.freeze({
  knob: "knob",
  doughnut: "doughnut",
  list: "list",
  panel: "panel",
  multi_doughnut: "multi_doughnut",
  multi_knob: "multi_knob",
  single: "single",
});

const NotificationContext = Object.freeze({
  ASSET: "asset",
  USER: "user",
  AREA: "area",
  TILE: "area",
});

const DashboardMeasurementTypes = Object.freeze({
  energy: "energy",
  power: "power",
});
const MeasurementDomains = init({
  electricity: "electricity",
  heat: "heat",
  none: "none",
});

const MeasurementDirection = init({
  in: "in",
  out: "out",
  none: "none",
});

const AssetConnectionType = Object.freeze({
  OWNER: "owner",
  RESIDENT: "resident",
  VISITOR: "visitor",
});

const RenRoles = init({
  REN_GUEST: 0x00000000,
  "ren-guest": 0x00000000,
  REN_VISITOR: 0x00000010,
  "ren-visitor": 0x00000010,
  REN_USER: 0x00000100,
  "ren-user": 0x00000100,
  REN_MANAGER: 0x00001000,
  "ren-manager": 0x00001000,
  REN_TECHNICAL_MANAGER: 0x00010000,
  "ren-technical-manager": 0x00010000,
  REN_ADMIN: 0x00110000,
  "ren-admin": 0x00100000,
  REN_STAFF: 0x01000000,
  "ren-staff": 0x01000000,
  REN_DEV: 0x11111111,
  "ren-dev": 0x11111111,

  parseError: (flag) => {
    let msg = "";
    if ((flag & this.REN_VISITOR) > 0) msg += " ren-visitor,";
    if ((flag & this.REN_USER) > 0) msg += " ren-user,";
    if ((flag & this.REN_MANAGER) > 0) msg += " ren-manager,";
    if ((flag & this.REN_TECHNICAL_MANAGER) > 0) msg += " ren-technical-manager,";
    if ((flag & this.REN_ADMIN) > 0) msg += " ren-admin,";
    if ((flag & this.REN_STAFF) > 0) msg += " ren-staff,";
    if (msg.length > 0) {
      return `Required privileges:${msg.substring(0, msg.length - 2)}`;
    }
    return null;
  },
});

const RenRolesStr = init({
  REN_GUEST: "ren-guest",
  REN_VISITOR: "ren-visitor",
  REN_USER: "ren-user",
  REN_MANAGER: "ren-manager",
  REN_TECHNICAL_MANAGER: "ren-technical-manager",
  REN_ADMIN: "ren-admin",
  REN_STAFF: "ren-staff",
  REN_DEV: "ren-dev",
});
const RenFeatures = init({
  PUBLIC_REPORTS: "public_reports",
  GRAFANA_ACCESS: "grafana_access",
  GRAFANA_MANAGEMENT: "grafana_management",
  USER_MANAGEMENT: "user_management",
  ROLE_MANAGEMENT: "role_management",
  REPORT: "report",
  MANAGE_ASSET: "manage_asset",
  OWNER: "owner",
  NOTIFICATION: "notification",
  READ: "read",
});

// AssetTypes,
// AssetDetailsKeys,
export {
  Colors,
  TileTypes,
  NotificationContext,
  AssetConnectionType,
  HeatMapType,
  RenRoles,
  RenRolesStr,
  RenFeatures,
  DemandActionType,
  MeasurementDetailsKeys,
  DashboardMeasurementTypes,
  MeasurementDomains,
  MeasurementDirection,
};
