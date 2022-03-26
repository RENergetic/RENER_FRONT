var adminRoutes = [
  {
    path: "/admin/users",
    name: "Users",
    props: {},
    meta: { isAuthenticated: true, roles: ["ren-admin"] },
    component: () => import("../views/admin/Users.vue"),
  },
];

export default adminRoutes;
