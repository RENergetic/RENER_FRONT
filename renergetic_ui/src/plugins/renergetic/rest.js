import AuthApi from "./ren_api/auth";
import DashboardApi from "./ren_api/dashboardapi";
import { DashboardApi as DummyDashboardApi, MeasurementApi as DummyMeasurementApi } from "../../assets/dummy/api";
import MeasurementdApi from "./ren_api/measurementapi"; 
// import UserApi from './renergetic/ren_api/user'
// import i18n from "../locale";
import axios from "axios";

const USE_DUMMY = false;//process.env.VUE_APP_DUMMY_API 
export var BASE_URL = process.env.VUE_APP_API_URL;

const axiosInstance = axios.create({ baseURL: BASE_URL });

class AxiosAPI {
  constructor(axiosInstance, vueInstance, authApi) {
    this.axios = axiosInstance;
    this.vueInstance = vueInstance;
    this.authApi = authApi;
    this.init();
  }
  //wrapper for store
  storeCommit(action) {
    this.vueInstance.config.globalProperties.$store.commit(action);
  }
  //wrapper for i18n
  $t(msgCode) {
    // return i18n.global.t("error." + msgCode);
    return this.vueInstance.config.globalProperties.$t("error." + msgCode);
  }
  //wrapper for global toast service
  toastError(code = "rest_error") {
    this.vueInstance.config.globalProperties.$toast.add({
      severity: "error",
      summary: this.$t("error_title"),
      detail: this.$t(code),
      life: 30000,
    });
  }

  /**
   * init axxios interceptors
   */
  init() {
    this.axios.interceptors.request.use(
      (req) => {
        if (req.spinner) {
          this.storeCommit("spinner/start");
        }
        req.withCredentials = false;
        console.log(`${req.method} ${req.url} ${req.spinner}`);
        // Important: request interceptors **must** return the request.
        return req;
      },
      (error) => {
        console.error("Request error: " + error.message);
        if (error.config.spinner) {
          this.storeCommit("spinner/stop");
        }
        this.toastError("connection_error");
      }
    );

    this.axios.interceptors.response.use(
      (res) => {
        if (res.config.spinner) {
          this.storeCommit("spinner/stop");
        }
        // Important: response interceptors **must** return the response.
        return res;
      },
      (error) => {
        console.error("Response error: " + error.message);
        if (error.config.spinner) {
          this.storeCommit("spinner/stop");
        }
        return this._onRequestError(error);
      }
    );
  }

  async _onRequestError(error) {
    const origReq = error.config;
    var response = error.response;
    if (error.message == "Network Error") {
      this.toastError("connection_error");
      return Promise.reject(error);
    } else if (response.status == 403) {
      console.error(
        `REST ${origReq.url}:  code=${response.status}: msg=${error.message}`
      );
      error.message = "PRIVILEGE_ERROR";
      return Promise.reject(error);
    } else if (response.status == 401) {
      this.toastError("AUTHORIZATION_ERROR");
    } else {
      console.error(`REST ${origReq.url}:  code=${response.status}`);
      return Promise.reject(error);
    }
  }
}

// export default class RestClient {
//   constructor(vueInstance) {
//     this.auth = new AuthApi(axiosInstance, vueInstance);
//     this.axiosApi = new AxiosAPI(axiosInstance, vueInstance, this.auth);
//     // this.user = new UserApi(axiosInstance, vueInstance);
//   }
// }
export default function createRest(vueInstance) {
  return {
    auth: new AuthApi(axiosInstance, vueInstance),
    axiosApi: new AxiosAPI(axiosInstance, vueInstance, this.auth),
    dashboardApi: !USE_DUMMY 
      ? new DashboardApi(axiosInstance, vueInstance )  
      : new DummyDashboardApi(),
    measurementApi: !USE_DUMMY
      ? new MeasurementdApi(axiosInstance, vueInstance)
      : new DummyMeasurementApi(),

    // this.user = new UserApi(axiosInstance, vueInstance);
  };
}
