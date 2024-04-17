export default {
  aggKey(measurement, settings) {
    let key = `${measurement.type.base_unit}_${measurement.aggregation_function}`;
    if (!settings.groupByDirection) {
      key += `_${measurement.direction}`;
    }
    if (!settings.groupByMeasurement) {
      key += `_${measurement.name}`;
    }
    if (!settings.groupByDomain) {
      key += `_${measurement.domain}`;
    } else {
      switch (measurement.domain) {
        case "heat":
        case "electricity":
          key += "_he";
          break;
        default:
          key += "_none";
      }
    }
    return key;
  },
  getUnit(measurement, panelSettings, conversionSettings) {
    if (measurement == null) {
      return "";
    }
    if (panelSettings && panelSettings.relativeValues) {
      return "%";
    }
    let domainKey = measurement.domain + "_" + measurement.type.physical_name;
    let mt;
    let defaultKey = "default_" + measurement.type.physical_name;
    if (conversionSettings) mt = conversionSettings[domainKey] ? conversionSettings[domainKey] : conversionSettings[defaultKey];
    else mt = null;
    // console.info(conversionSettings);
    let unit = mt ? mt : measurement.type.unit;
    if (unit == "any" || unit == "ratio") {
      return null;
    }
    return unit;
  },
  convertDemandData(demandList, pData, settings) {
    var cp = pData;
    var mDict = {};
    for (let demand of demandList) {
      if (demand.demand_definition && demand.demand_definition.tile) {
        let tile = demand.demand_definition.tile;
        for (let m of tile.measurements) {
          // mDict[m.id] = m;
          mDict[`${m.id}_${m.aggregation_function}`] = m;
        }
      }
    }
    for (let mId in mDict) {
      let m = mDict[mId];
      var newUnit = this.getUnit(m, null, settings); // settings[m.type.physical_name];
      if (newUnit) {
        let value = pData.current[m.aggregation_function][m.id];
        let newV = this.app.$store.getters["view/convertValue"](m.type, value, newUnit);
        cp.current[m.aggregation_function][m.id] = newV;
        if (pData.max && pData.max[m.aggregation_function]) {
          let value = pData.max[m.aggregation_function][m.id];
          let newV = this.app.$store.getters["view/convertSIValue"](m.type.physical_name, value, newUnit);
          cp.max[m.aggregation_function][m.id] = newV;
        }
      }
    }
    //todo:
    return cp;
  },
  convertPanelData(panel, pData, settings) {
    var mDict = {};
    //TODO: initialize this dictionary in the vuex store
    var cp = pData; //
    if (panel && panel.tiles) {
      for (let tile of panel.tiles) {
        for (let m of tile.measurements) {
          mDict[`${m.id}_${m.aggregation_function}`] = m;
          // mDict[m.id] = m;
        }
      }
    }
    //TODO: convert min, max, prediction etc
    for (let mId in mDict) {
      let m = mDict[mId];
      var newUnit = this.getUnit(m, null, settings); // settings[m.type.physical_name];
      // console.info(m.type.physical_name + " " + newUnit);
      if (newUnit) {
        let value = pData.current[m.aggregation_function][m.id];
        let newV = this.app.$store.getters["view/convertValue"](m.type, value, newUnit);
        cp.current[m.aggregation_function][m.id] = newV;
        if (pData.max && pData.max[m.aggregation_function]) {
          let value = pData.max[m.aggregation_function][m.id];
          let newV = this.app.$store.getters["view/convertSIValue"](m.type.physical_name, value, newUnit);
          cp.max[m.aggregation_function][m.id] = newV;
        }
      }
    }
    return cp;
  },
  calcPanelRelativeValues(panel, pData, settings) {
    var accuDict = {};
    // var aggDict = { current: { last: {} }, predictions: pData.predictions };
    //TODO: aggregate also predictions - not only current values
    //TODO: include min values
    var mDict = {};
    //TODO: initialize this dictionary in the vuex store
    if (panel && panel.tiles) {
      for (let tile of panel.tiles) {
        if (tile.props && !tile.props.ignore_grouping) {
          for (let m of tile.measurements) {
            //TODO: ignore percentage type ?
            if (m.id != null && m.type.base_unit != "%") mDict[`${m.id}_${m.aggregation_function}`] = m;
          }
        }
      }
    }
    console.debug(mDict);
    console.info(settings);
    for (let mId in mDict) {
      let m = mDict[mId];
      let key = this.aggKey(m, settings);
      // let key = `${m.name}_${m.direction}_${m.domain}_${m.type.base_unit}`;
      // console.error(key);
      let factor = m.type.factor;
      let value = pData.current[m.aggregation_function][m.id] * factor; //todo: raise exception if value not found
      accuDict = this.valueAccu(key, value, m.type.base_unit, accuDict);
    }
    pData.max = {};
    for (let mId in mDict) {
      let m = mDict[mId];
      // let key = `${m.name}_${m.direction}_${m.domain}_${m.type.base_unit}`;
      let key = this.aggKey(m, settings);
      // let factor = m.type.factor;
      // let value = pData.current.last[m.id] * factor;
      // let aggValue = this.valueAgg(key, value, m.type.base_unit, accuDict);
      // pData.current.last[m.id] = aggValue;
      if (!pData.current.min) {
        pData.current.min = {};
      }
      pData.current.min[m.id] = 0;
      // if (!pData.current.max) {
      //   pData.current.max = {};
      // }
      // pData.current.max[m.id] = accuDict[key].accu * factor;
      if (!pData.max[m.aggregation_function]) {
        pData.max[m.aggregation_function] = {};
      }
      // if (!pData.max[m.aggregation_function][m.id]) {
      //   pData.max[m.aggregation_function][m.id] = {};
      // }
      pData.max[m.aggregation_function][m.id] = accuDict[key].accu;
    }
    console.info(accuDict);
    return pData;
  },
  valueAccu(key, value, baseUnit, dict) {
    if (baseUnit == "ratio") {
      dict[key] = { accu: 1.0, counter: 1 };
      return dict;
    }
    if (dict[key] == null) {
      dict[key] = { accu: value, counter: 1 };
      return dict;
    }
    dict[key].counter += 1;
    switch (baseUnit) {
      case "W":
      case "Wh":
      case "any":
        dict[key].accu += value;
        break;
      case "ratio":
        dict[key].accu = 1.0;
        break;
      default:
        console.error(`measurement type accu not defined for ${baseUnit}, ${key}`);
        break;
    }
    return dict;
  },
  getConvertedValue(measurement, data, tileSettings) {
    try {
      if (tileSettings.panel.relativeValues && measurement.type.base_unit != "%") {
        return (data.current[measurement.aggregation_function][measurement.id] / data.max[measurement.aggregation_function][measurement.id]) * 100.0;
      }
      return data.current[measurement.aggregation_function][measurement.id];
    } catch (e) {
      return null;
    }
  },
};
// valueAgg(key, value, baseUnit, dict) {
//   switch (baseUnit) {
//     case "W":
//     case "Wh":
//       return dict[key].accu != 0 ? (value / dict[key].accu) * 100.0 : 0.0;
//     default:
//       console.error(`measurement type agreggation not defined for ${baseUnit}, ${key}`);
//       break;
//   }
//   return dict;
// }};
