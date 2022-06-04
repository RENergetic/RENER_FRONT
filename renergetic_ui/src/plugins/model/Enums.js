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
const AssetTypes = Object.freeze({
  BUILDING: "bulding",
  FLAT: "flat",
  HEAT_SOURCE: "heat_source",
  ISLAND: "island",
  PV: "pv",
});

const TileTypes = Object.freeze({
  knob: "knob",
  doughnut: "doughnut",
  list: "list",
});

const NotificationContext = Object.freeze({
  ASSET: "asset",
  USER: "user",
  AREA: "area",
  TILE: "area",
});

const RenRoles = Object.freeze({
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
  REN_ADMIN: 0x00100000,
  "ren-admin": 0x001000000,
  REN_STAFF: 0x010000000,
  "ren-staff": 0x010000000,
  REN_DEV: 0x11111111,
  "ren-dev": 0x11111111,
});

export { Colors, AssetTypes, TileTypes, NotificationContext, HeatMapType, RenRoles };
