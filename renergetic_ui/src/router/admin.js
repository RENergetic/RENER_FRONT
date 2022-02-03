var adminRoutes = [
    {
      path: "/admin/users",
      name: "Users",
      props: {},
      meta: { isAuthenticated: true },
      component: () => import("../views/administration/Users.vue"),
    }
];

export default adminRoutes;
