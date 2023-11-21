//EV charging module
import { RenRoles } from "@/plugins/model/Enums";
var management = [
  {
    path: "/management/asset",
    name: "AssetList",
    props: {},
    meta: {
      isAuthenticated: true,
      roles: ["ren-admin", "ren-technical-manager"],
      roleFlag: RenRoles.REN_TECHNICAL_MANAGER | RenRoles.REN_ADMIN,
    },
    component: () => import("../views/management/infrastructure/AssetListView.vue"),
  },
  {
    path: "/management/hdr",
    name: "HDRView",
    props: {},
    meta: {
      isAuthenticated: true,
      roles: ["ren-admin", "ren-technical-manager"],
      roleFlag: RenRoles.REN_TECHNICAL_MANAGER | RenRoles.REN_ADMIN,
    },
    component: () => import("../views/management/demand/HDRView.vue"),
  },
  {
    path: "/management/measurement",
    name: "MeasurementList",
    props: {},
    meta: {
      isAuthenticated: true,
      roles: ["ren-admin", "ren-technical-manager"],
      roleFlag: RenRoles.REN_TECHNICAL_MANAGER | RenRoles.REN_ADMIN,
    },
    component: () => import("../views/management/infrastructure/MeasurementListView.vue"),
  },
  {
    path: "/management/assetcategory",
    name: "AssetCategoryList",
    props: {},
    meta: {
      isAuthenticated: true,
      roles: ["ren-admin", "ren-technical-manager"],
      roleFlag: RenRoles.REN_TECHNICAL_MANAGER | RenRoles.REN_ADMIN,
    },
    component: () => import("../views/management/infrastructure/AssetCategoryListView.vue"),
  },
  {
    path: "/management/notification",
    name: "NotificationList",
    props: {},
    meta: {
      isAuthenticated: true,
      roles: ["ren-admin", "ren-technical-manager"],
      roleFlag: RenRoles.REN_TECHNICAL_MANAGER | RenRoles.REN_ADMIN,
    },
    component: () => import("../views/management/NotificationListView.vue"),
  },
  {
    path: "/management/abstract",
    name: "AbstractMeters",
    props: {},
    meta: {
      isAuthenticated: true,
      roles: ["ren-admin", "ren-technical-manager"],
      roleFlag: RenRoles.REN_TECHNICAL_MANAGER | RenRoles.REN_ADMIN | RenRoles.REN_MANAGER,
    },
    component: () => import("../views/management/abstract/AbstractMetersView.vue"),
  },
  /*
  {
    path: "/management/abstractCalculation",
    name: "AbstractMetersCalculation",
    props: {},
    meta: {
      isAuthenticated: true,
      roles: ["ren-admin", "ren-technical-manager"],
      roleFlag: RenRoles.REN_TECHNICAL_MANAGER | RenRoles.REN_ADMIN | RenRoles.REN_MANAGER,
    },
    component: () => import("../views/management/abstract/AbstractMetersCalculation.vue"),
  },
  */
  {
    path: "/management/demandResponse",
    name: "DemandResponse",
    props: {},
    meta: {
      isAuthenticated: true,
      roles: ["ren-admin", "ren-technical-manager"],
      roleFlag: RenRoles.REN_TECHNICAL_MANAGER | RenRoles.REN_ADMIN | RenRoles.REN_MANAGER,
    },
    component: () => import("../views/management/abstract/DemandResponseView.vue"),
  },
];

export default management;
