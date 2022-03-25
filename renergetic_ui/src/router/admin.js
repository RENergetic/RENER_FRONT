var adminRoutes = [
  {
    path: "/admin/users",
    name: "Users",
    props: {},
    meta: { isAuthenticated: true, roles: ["ren-administrator", "ren-developer"] },
    component: () => import("../views/admin/Users.vue"),
  },
];

export default adminRoutes;
