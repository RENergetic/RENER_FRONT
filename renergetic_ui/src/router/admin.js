import { RenRoles } from "@/plugins/model/Enums";
var adminRoutes = [
  {
    path: "/admin/users",
    name: "Users",
    props: {},
    meta: { isAuthenticated: true, roles: ["ren-admin", "ren-dev"], roleFlag: RenRoles.REN_ADMIN },
    component: () => import("../views/admin/Users.vue"),
  },

  {
    path: "/profile/:username",
    name: "Profile",
    meta: { isAuthenticated: true, roles: ["ren-admin", "ren-dev"], roleFlag: RenRoles.REN_ADMIN },
    component: () => import("../views/user/Profile.vue"),
  },
  {
    path: "/admin/workflow",
    name: "AdminWorkflows",
    meta: { isAuthenticated: true, roles: ["ren-admin", "ren-dev"], roleFlag: RenRoles.REN_ADMIN },
    component: () => import("../views/admin/WorkflowListView.vue"),
  },
  {
    path: "/admin/hdr/pipeline",
    name: "HDRPipeline",
    meta: { isAuthenticated: true, roles: ["ren-admin", "ren-dev"], roleFlag: RenRoles.REN_ADMIN },
    component: () => import("../views/admin/HDRPipelineListView.vue"),
  },
  {
    path: "/admin/wasteheat/configuration",
    name: "WasteHeatConfiguration",
    meta: { isAuthenticated: true, roles: ["ren-admin", "ren-dev"], roleFlag: RenRoles.REN_ADMIN },
    component: () => import("../views/admin/WasteHeatConfigurationView.vue"),
  },

  {
    path: "/admin/logs",
    name: "AdminLogs",
    meta: { isAuthenticated: true, roles: ["ren-admin", "ren-dev"], roleFlag: RenRoles.REN_ADMIN },
    component: () => import("../views/admin/LogsListView.vue"),
  },
];

export default adminRoutes;
