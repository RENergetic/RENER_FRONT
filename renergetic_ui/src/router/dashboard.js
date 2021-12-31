var dashboardRoutes = [
  {
    path: "/dashboard/view/:dashboard_id?",
    name: "Dashboard",
    props: {},
    meta: { isAuthenticated: true },
    component: () => import("../views/dashboard/Dashboard.vue"),
  },
  {
    path: "/dashboard/add",
    name: "DashboardAdd",
    props: {},
    meta: { isAuthenticated: true },
    component: () => import("../views/dashboard/DashboardAdd.vue"),
  },
];

export default dashboardRoutes;
