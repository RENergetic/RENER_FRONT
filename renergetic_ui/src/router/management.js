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
    path: "/management/category",
    name: "CategoryList",
    props: {},
    meta: {
      isAuthenticated: true,
      roles: ["ren-admin", "ren-technical-manager"],
      roleFlag: RenRoles.REN_TECHNICAL_MANAGER | RenRoles.REN_ADMIN,
    },
    component: () => import("../views/management/infrastructure/CategoryListView.vue"),
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
    name: "MeasurementSelectionList",
    props: {},
    meta: {
      isAuthenticated: true,
      roles: ["ren-admin", "ren-technical-manager"],
      roleFlag: RenRoles.REN_TECHNICAL_MANAGER | RenRoles.REN_ADMIN | RenRoles.REN_MANAGER,
    },
    component: () => import("../views/management/abstract/MeasurementSelectionList.vue"),
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
