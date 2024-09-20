import DashboardApi from "./ren_api/dashboardapi";
import DataApi from "./ren_api/dataapi";
import ManagementApi from "./ren_api/managementapi";
import UserApi from "./ren_api/userapi";
import AxiosAPI from "./ren_api/axiosapi";
import WrapperApi from "./ren_api/wrapper_api";
import HDRAPI from "./ren_api/hdrapi";
import KPIAPI from "./ren_api/kpiapi";
import KubeflowAPI from "./ren_api/kubeflowapi";

// import {
//   DashboardApi as DummyDashboardApi,
//   ManagementApi as DummyManagementApi,
//   DataApi as DummyDataApi,
//   UserApi as DummyUserApi,
//   WrapperApi as DummyWrapperApi,
//   initDummy,
// } from "../../assets/dummy/api";
// var USE_DUMMY;
import axios from "axios";
// console.info(process.env);
// if (process.env.VUE_APP_DUMMY_API == true) {
//   await initDummy();
//   USE_DUMMY = true;
// } else {
//   USE_DUMMY = false;
// }
export var BASE_URL_HDR_API = process.env.VUE_APP_API_URL_HDR_API; // "http://localhost:7982";
export var BASE_URL_BASE_API = process.env.VUE_APP_API_URL_BASE_API; //"http://localhost:7981"; // ; // process.env.VUE_APP_API_URL_BASE_API; //;
export var BASE_URL_DATA_API = process.env.VUE_APP_API_URL_DATA_API; //"http://localhost:7983"; // // //  //; // " //
export var BASE_URL_USER_API = process.env.VUE_APP_API_URL_USER_API; //"http://localhost:7985"; //
export var BASE_URL_WRAPPER_API = process.env.VUE_APP_API_URL_WRAPPER_API; // ""; //
export var BASE_URL_KPI_API = process.env.VUE_APP_API_URL_KPI_API; //"http://localhost:7987"; // //
export var BASE_URL_KUBEFLOW_API = process.env.VUE_APP_API_URL_KUBEFLOW_API; // "http://localhost:7986"; // // //  //; //
// export var KUBEFLOW_SERVICE_BASE_URL = process.env.VUE_APP_KUBEFLOW_SERVICE_BASE_URL ? process.env.VUE_APP_KUBEFLOW_SERVICE_BASE_URL : null;

const axiosInstanceHdr = axios.create({ baseURL: BASE_URL_HDR_API });
const axiosInstanceBase = axios.create({ baseURL: BASE_URL_BASE_API });
const axiosInstanceData = axios.create({ baseURL: BASE_URL_DATA_API });
const axiosInstanceUser = axios.create({ baseURL: BASE_URL_USER_API });
const axiosInstanceWrapper = axios.create({ baseURL: BASE_URL_WRAPPER_API });
const axiosInstanceKpi = axios.create({ baseURL: BASE_URL_KPI_API });
const axiosInstanceKubeflow = axios.create({ baseURL: BASE_URL_KUBEFLOW_API });

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
    axiosApi: new AxiosAPI(
      [axiosInstanceBase, axiosInstanceData, axiosInstanceUser, axiosInstanceWrapper, axiosInstanceKubeflow, axiosInstanceHdr],
      vueInstance,
      this.auth,
    ),
    dashboardApi: new DashboardApi(axiosInstanceBase, vueInstance),
    dataApi: new DataApi(axiosInstanceData, vueInstance),
    managementApi: new ManagementApi(axiosInstanceBase, vueInstance),
    userApi: new UserApi(axiosInstanceUser, vueInstance),
    wrapperApi: new WrapperApi(axiosInstanceWrapper, vueInstance),
    kubeflowApi: new KubeflowAPI(axiosInstanceKubeflow, vueInstance, "/api/kubeflow"),
    hdrApi: new HDRAPI(axiosInstanceHdr, vueInstance),
    kpiApi: new KPIAPI(axiosInstanceKpi, vueInstance),
  };
}
