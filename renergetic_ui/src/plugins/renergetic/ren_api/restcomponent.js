const HEADERS = { "Content-type": "application/json; charset=UTF-8" };
export default class RestComponent {
  //TODO: remove temmporary user id
  // USER_ID = 2;

  constructor(axiosInstance, vueInstance) {
    this.vueInstance = vueInstance;
    this.axios = axiosInstance;
  }
  /**
   * convert dictionary to URL query string
   * @param {*} args
   * @returns query string
   */
  parseArgs(args = {}) {
    var q = "";
    if (!args || args.len == 0) {
      return "";
    }
    Object.keys(args).forEach(function (k) {
      let v = args[k];
      if (v !== undefined && v != null) {
        if (v instanceof Set || Array.isArray(v)) {
          v.forEach((item) => {
            q += `&${k}=${item}`;
          });
        } else {
          q += `&${k}=${v}`;
        }
      }
    });
    return q;
  }
  /**
   *
   * @param {*} path
   * @param {*} params
   * @param {*} headers
   * @param {*} onError - error handler, return `false` to fire default handler
   * @returns
   */
  get(path, params = null, headers = null, onError = null) {
    let _this = this;
    if (headers == null) {
      headers = HEADERS;
    }
    return this.securizeAPI(headers).then((headers) => {
      return (params ? this.axios.get(path, { headers: headers, params: params }) : this.axios.get(path, { headers: headers }))
        .then((response) => {
          return response.data;
        })
        .catch(function (error) {
          let defaultErrorHandler = (error) => _this.emitError(`GET: ${path}: ${error.message}`);
          if (onError == null || !onError(error)) {
            defaultErrorHandler(error);
          }
        });
    });
  }

  /**
   *
   * @param {*} path
   * @param {*} params
   * @param {*} headers
   * @param {*} onError - error handler, return `false` to fire default handler
   * @returns
   */
  delete(path, params = null, headers = null, onError = null) {
    let _this = this;
    if (headers == null) {
      headers = HEADERS;
    }
    return this.securizeAPI(headers).then((headers) => {
      return (
        (params ? this.axios.delete(path, { headers: headers, params: params }) : this.axios.delete(path, { headers: headers }))
          // : this.axios.get(path, { headers: headers })
          .then((response) => {
            return response.data;
          })
          .catch(function (error) {
            let defaultErrorHandler = (error) => _this.emitError(`DELETE: ${path}: ${error.message}`);
            if (onError == null || !onError(error)) {
              defaultErrorHandler(error);
            }
          })
      );
    });
  }
  /**
   *
   * @param {*} path
   * @param {*} data
   * @param {*} params
   * @param {*} headers
   * @param {*} onError - error handler, return `false` to fire default handler
   * @returns
   */
  post(path, data, params = null, headers = null, onError = null) {
    let _this = this;
    if (headers == null) {
      headers = HEADERS;
    }
    return this.securizeAPI(headers).then((headers) => {
      // console.error("POST REQUEST OAUTH");
      return (params ? this.axios.post(path, data, { headers: headers, params: params }) : this.axios.post(path, data, { headers: headers }))
        .then((response) => {
          return response.data;
        })
        .catch(function (error) {
          let defaultErrorHandler = (error) => _this.emitError(`POST: ${path}: ${error.message}`);
          if (onError == null || !onError(error)) {
            defaultErrorHandler(error);
          }
        });
    });
  }
  /**
   *
   * @param {*} path
   * @param {*} data
   * @param {*} params
   * @param {*} headers
   * @param {*} onError - error handler, return `false` to fire default handler
   * @returns
   */
  put(path, data, params = null, headers = null, onError = null) {
    let _this = this;
    if (headers == null) {
      headers = HEADERS;
    }
    return this.securizeAPI(headers).then((headers) => {
      return (params ? this.axios.put(path, data, { headers: headers, params: params }) : this.axios.put(path, data, { headers: headers }))
        .then((response) => {
          return response.data;
        })
        .catch(function (error) {
          let defaultErrorHandler = (error) => _this.emitError(`PUT: ${path}: ${error.message}`);
          if (onError == null || !onError(error)) {
            defaultErrorHandler(error);
          }
        });
    });
  }

  get $ren() {
    return this.vueInstance.config.globalProperties.$ren;
  }
  get $router() {
    return this.vueInstance.config.globalProperties.$router;
  }
  /**
   *
   * @param {*} msg  error msg
   * @param {*} ctx context object to present more details to the user
   */
  emitError(msg, ctx = null) {
    console.error(msg);
    if (ctx != null) this.vueInstance.config.globalProperties.$emitter.emit("error", { ...ctx, message: msg });
    else this.vueInstance.config.globalProperties.$emitter.emit("error", { message: msg });
  }

  securizeAPI(headers) {
    if (process.env.VUE_APP_API_OAUTH == "true") {
      console.error("OAUTH_REQUEST");
      const headersOAuth = {
        "Content-type": "application/x-www-form-urlencoded",
        Accept: "*/*",
      };
      const auth = {
        username: process.env.VUE_APP_API_OAUTH_CLIENT,
        password: process.env.VUE_APP_API_OAUTH_SECRET,
      };
      const OAuthparams = new URLSearchParams();
      OAuthparams.append("grant_type", "client_credentials");
      return this.axios
        .request({
          url: "/realms/master/protocol/openid-connect/token",
          method: "post",
          baseURL: process.env.VUE_APP_KEY_CLOAK_URL,
          auth: auth,
          data: OAuthparams,
          headers: headersOAuth,
        })
        .then((response) => {
          headers["Authorization"] = "Bearer " + response.data["access_token"];
          return headers;
        });
    } else if (process.env.VUE_APP_API_KEY) {
      console.error("APIKEY_REQUEST");
      headers["apikey"] = process.env.VUE_APP_API_KEY;
      return Promise.resolve(headers);
    } else return Promise.resolve(headers);
  }
}
