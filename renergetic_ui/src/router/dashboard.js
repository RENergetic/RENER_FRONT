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
  {
    path: "/dashboard/heatmap/add",
    name: "HeatMapCreator",
    props: {},
    meta: { isAuthenticated: true },
    component: () => import("../views/dashboard/HeatMapCreator.vue"),
  },
  {
    path: "/dashboard/heatmap/view",
    name: "HeatMapView",
    props: {},
    meta: { isAuthenticated: true },
    component: () => import("../views/dashboard/HeatMapView.vue"),
  },
  {
    path: "/dashboard/heatmap/list",
    name: "HeatMapListView",
    props: {},
    meta: { isAuthenticated: true },
    component: () => import("../views/dashboard/HeatMapListView.vue"),
  },
  {
    path: "/panel/:panelId?",
    name: "InformationPanel",
    meta: { isAuthenticated: true },
    component: () => import("../views/dashboard/InformationPanel.vue"),
  },
];

export default dashboardRoutes;
