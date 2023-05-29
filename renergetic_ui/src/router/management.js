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
];

export default management;
