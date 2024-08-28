import RestComponent from "./restcomponent";
export default class KPIAPI extends RestComponent {
  constructor(axiosInstance, vueInstance) {
    super(axiosInstance, vueInstance);
  }
  getAbstracMeterList() {
    return this.get(`/api/meter/list`, null, null, (e) => {
      if (e.response.status == 404) {
        this.emitError(`Abstract meter list not found`, {
          code: "abstract_meter_list_error",
        });
        return true;
      }
    });
  }
  getNotConfiguredAbstracMeters() {
    return this.get(`/api/meter/list/notconfigured`);
  }

  getAbstractMeterConfiguration(meterName, domain) {
    return this.get(`/api/meter/${domain}/${meterName}`, null, null, (e) => {
      if (e.response.status != 404) {
        this.emitError(`Abstract meter list not found`, {
          code: "abstract_meter_list_error",
        });
      }
      return true;
    });
  }

  addAbstractMeter(abstractMeter) {
    return this.post(`/api/meter`, abstractMeter, null, null, (e) => {
      // if (e.response.status === 404) {
      this.emitError(`Abstract meter not added: ${e.message}`, {
        code: "abstract_meter_adding_error",
      });
      return true;
      // }
    });
  }
  updateAbstractMeter(abstractMeter) {
    return this.put(`/api/meter`, abstractMeter, null, null, (e) => {
      if (e.response.status == 404) {
        this.emitError(`The abstract meter doesn´t exist: ${e.message}`, {
          code: "update_abstract_meter_error",
        });
        return true;
      }
    });
  }
  deleteAbstractMeter(name, domain) {
    return this.delete(`/api/meter/${domain}/${name}`, null, null, (e) => {
      if (e.response.status == 404) {
        this.emitError(`There was a problem trying to delete de abstract meter: ${e.message}`, { code: "del_abstract_meter_error" });
        return true;
      }
    });
  }
}
