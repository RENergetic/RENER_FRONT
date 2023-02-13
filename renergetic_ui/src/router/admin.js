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
];

export default adminRoutes;
