import AuthApi from "./ren_api/auth";
import DashboardApi from "./ren_api/dashboardapi";
import DataApi from "./ren_api/dataapi";
import ManagementApi from "./ren_api/managementapi";
import UserApi from "./ren_api/userapi";
import AxiosAPI from "./ren_api/axiosapi";
import WrapperApi from "./ren_api/wrapper_api";
import HDRAPI from "./ren_api/hdrapi";
import KubeflowAPI from "./ren_api/kubeflowapi";
import {
  DashboardApi as DummyDashboardApi,
  ManagementApi as DummyManagementApi,
  DataApi as DummyDataApi,
  UserApi as DummyUserApi,
  WrapperApi as DummyWrapperApi,
  initDummy,
} from "../../assets/dummy/api";
var USE_DUMMY;
import axios from "axios";
console.info(process.env);
if (process.env.VUE_APP_DUMMY_API == true) {
  await initDummy();
  USE_DUMMY = true;
} else {
  USE_DUMMY = false;
}
export var BASE_URL = process.env.VUE_APP_API_URL;
export var KUBEFLOW_SERVICE_BASE_URL = process.env.VUE_APP_KUBEFLOW_SERVICE_BASE_URL ? process.env.VUE_APP_KUBEFLOW_SERVICE_BASE_URL : null;

const axiosInstance = axios.create({ baseURL: BASE_URL });

export default function createRest(vueInstance) {
  // return {
  //   auth: new AuthApi(axiosInstance, vueInstance),
  //   axiosApi: new AxiosAPI(axiosInstance, vueInstance, this.auth),
  //   dashboardApi: !USE_DUMMY ? new DashboardApi(axiosInstance, vueInstance) : new DummyDashboardApi(),
  //   dataApi: !USE_DUMMY ? new DataApi(axiosInstance, vueInstance) : new DummyDataApi(),
  //   managementApi: !USE_DUMMY ? new ManagementApi(axiosInstance, vueInstance) : new DummyManagementApi(),
  //   userApi: !USE_DUMMY ? new UserApi(axiosInstance, vueInstance) : new DummyUserApi(),
  //   wrapperApi: !USE_DUMMY ? new WrapperApi(axiosInstance, vueInstance) : new DummyWrapperApi(),
  // };
  return {
    auth: new AuthApi(axiosInstance, vueInstance),
    axiosApi: new AxiosAPI(axiosInstance, vueInstance, this.auth),
    dashboardApi: !USE_DUMMY ? new DashboardApi(axiosInstance, vueInstance) : new DummyDashboardApi(),
    dataApi: !USE_DUMMY ? new DataApi(axiosInstance, vueInstance) : new DummyDataApi(),
    managementApi: !USE_DUMMY ? new ManagementApi(axiosInstance, vueInstance) : new DummyManagementApi(),
    userApi: !USE_DUMMY ? new UserApi(axiosInstance, vueInstance) : new DummyUserApi(),
    wrapperApi: !USE_DUMMY ? new WrapperApi(axiosInstance, vueInstance) : new DummyWrapperApi(),
    kubeflowApi: !USE_DUMMY ? new KubeflowAPI(axiosInstance, vueInstance, KUBEFLOW_SERVICE_BASE_URL) : new DummyWrapperApi(),
    hdrApi: new HDRAPI(axiosInstance, vueInstance),
  };
}
