//user notifications, user feedback, user engagement
var userRoutes = [
  // {
  //   path: "/signup",
  //   name: "SignUp",
  //   meta: {
  //     isAuthenticated: false,
  //   },
  //   component: () => import("../views/user/SignUp.vue"),
  // },
  {
    path: "/login",
    name: "Login",
    meta: { isAuthenticated: true },
    component: () => import("../views/LoginSuccess.vue"),
  },
  {
    path: "/signin",
    name: "SignIn",
    meta: { isAuthenticated: true },
    component: () => import("../views/LoginSuccess.vue"),
  },
  {
    path: "/profile/:username?",
    name: "CurrentProfile",
    meta: { isAuthenticated: true },
    component: () => import("../views/user/Profile.vue"),
  },
];

export default userRoutes;
