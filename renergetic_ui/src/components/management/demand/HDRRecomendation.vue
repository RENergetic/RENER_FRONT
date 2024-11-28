<template>
  <RenSpinner ref="spinner" :key="reloadChart" :lock="true" style="margin: auto; max-width: 95%">
    <template #content>
      <!-- {{ recommendationId }}{{ compareId }} -->

      <div v-if="pData && pData.timestamps && pData.timestamps.length > 0" :key="pData.timestamps.length" style="width: 100%">
        <TabView>
          <TabPanel v-for="(group, index) in mGroups" :key="index" :header="group.header">
            <MeasurementChart
              :ref="`mChart_${index}`"
              :pdata="{ timeseries: pData }"
              :filter="filter"
              style="width: 100%"
              :width="1200"
              :height="500"
              :title="chartTitle"
              :title-visible="true"
              :legend="true"
              :measurements="group.measurements"
              :annotations="getAnnotations(group)"
              :immediate="false"
            />
            <div v-if="pData && pData.statistics">
              <!-- {{ baseMeasurement }} -->
              <div v-for="(measurement, mIdx) in group.measurements.filter((it) => it.recommendation != null && pData.statistics[it.id])" :key="mIdx">
                <h3>
                  <div>
                    <!-- {{ measurement }} -->
                    {{ measurement.recommendation }}: avg= {{ $ren.utils.roundValue(pData.statistics[measurement.id].avg) }}[{{
                      measurement.type.unit
                    }}], peak = {{ $ren.utils.roundValue(pData.statistics[measurement.id].peak) }}[{{ measurement.type.unit }}]
                  </div>
                  <div v-if="measurement._recommendation">Recommendation: {{ measurement._recommendation.label }}</div>
                  <div v-if="pData.statistics[measurement.id].demand_stats">
                    demand: {{ pData.statistics[measurement.id].demand_stats.demand }}[{{ pData.statistics[measurement.id].demand_stats.unit }}],
                    predicted: {{ pData.statistics[measurement.id].demand_stats.predicted }}[{{ pData.statistics[measurement.id].demand_stats.unit }}]
                  </div>
                </h3>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>
      <!-- {{ recommendationMeasurements }}  {{ recommendationCompareMeasurements }}  -->
      <!-- {{ mGroups }} -->
      <!-- {{ pData }} -->
    </template>
  </RenSpinner>
</template>
<script>
import MeasurementChart from "@/components/dashboard/measurement/MeasurementChart.vue";

export default {
  name: "HDRRecomendation",
  components: { MeasurementChart },

  props: {
    recommendation: {
      type: Object,
      default: null,
    },
    comparewith: {
      type: Object,
      default: null,
    },
    baseRecommendation: {
      type: Object,
      default: null,
    },
    hdrRequest: {
      type: Object,
      default: null,
    },
  },
  emits: ["reload"],
  data() {
    return {
      measurementGroups: [],
      recommendationMeasurements: [],
      recommendationCompareMeasurements: [],
      pData: {},
      mDict: {},
      mGroups: [],
      reloadChart: false,
      annotations: null,
      currentMeasurements: [],
      baseMeasurement: null,
      tagKey: null,
    };
  },
  computed: {
    recommendationId() {
      return this.recommendation ? this.recommendation.id : null;
    },
    compareId() {
      return this.comparewith ? this.comparewith.id : null;
    },
    chartTitle() {
      let r1 = "";
      let r2 = "";
      if (this.recommendation) {
        r1 = this.recommendation.label ? `${this.recommendation.label}(${this.recommendation.tag.value})` : this.recommendation.tag.value;
      }
      if (this.comparewith) {
        r2 = this.comparewith.label ? `${this.comparewith.label}(${this.comparewith.tag.value})` : this.comparewith.tag.value;
      }
      if (r1 && r2) {
        return [r1, r2];
      }
      return `${r1}${r2}`;
    },
  },
  watch: {
    recommendation: {
      handler: async function () {
        await this.loadMeasurements();
        await this.loadData();
      },
      deep: true,
    },
    comparewith: {
      handler: async function () {
        await this.loadCompareMeasurements();
        await this.loadData();
      },
      deep: true,
    },
  },
  async mounted() {
    await this.loadMeasurements();
    await this.loadCompareMeasurements();
    await this.loadData();
  },
  methods: {
    measurementGroupKey(m) {
      let assetId = m.asset ? `_${m.asset.id}` : "";
      let direction = "";
      let domain = "";
      if (m.direction) {
        direction = `_${m.direction}`;
      }
      if (m.domain) {
        domain = `_${m.domain}`;
      }
      return `${m.name}_${m.sensor_name}_${m.type.id}${assetId}${direction}${domain}`;
    },
    async loadCurrentMeasurements() {
      // if (this.hdrRequest == null) {
      //   return;
      // }
      let r = this.recommendation;
      // if (this.tagKey != r.tag.key)
      this.currentMeasurements = await this.$ren.hdrApi.getMeasurements(this.hdrRequest ? this.hdrRequest.timestamp : null, r.tag.key, "no_tag");
      for (let m of this.currentMeasurements) {
        m.recommendation = null; //this.recommendation.tag.value;
        m._current = true;
        // m.label = `${m.recommendation}:${m.label ? m.label : m.name}`;
        if (m.measurement_details) {
          m.measurement_details.color = "#90A4AE";
          m.measurement_details["fill_chart"] = false;
        } else {
          m.measurement_details = { fill_chart: false, color: "#90A4AE" };
        }
      }
    },
    async loadMeasurements() {
      if (this.recommendation) {
        await this.loadBaseMeasurement();
        await this.loadCurrentMeasurements();
        // alert(JSON.stringify(this.recommendation));
        // this.recommendationMeasurements = await this.$ren.hdrApi.getRecommendationsMeasurements(this.recommendation.id);

        this.recommendationMeasurements = await this.$ren.hdrApi.getMeasurements(
          this.hdrRequest ? this.hdrRequest.timestamp : null,
          this.recommendation.tag.key,
          this.recommendation.tag.value,
        );
        for (let m of this.recommendationMeasurements) {
          m.recommendation = this.recommendation.tag.value;
          m._recommendation = this.recommendation;
          m.label = `${m.recommendation}:${m.label ? m.label : m.name}`;
          if (m.measurement_details) {
            m.measurement_details.color = "#03fc90";
            m.measurement_details["fill_chart"] = false;
          } else {
            m.measurement_details = { fill_chart: false, color: "#03fc90" };
          }
        }
      }
    },
    async loadBaseMeasurement() {
      if (this.baseRecommendation) {
        //TODO compare it.type.physical_name === "power" with ther reuqest type
        this.baseMeasurement = await this.$ren.hdrApi.getMeasurements(
          this.hdrRequest ? this.hdrRequest.timestamp : null,
          this.baseRecommendation.tag.key,
          "recommendation_0",
        );
        this.baseMeasurement = this.baseMeasurement.find((it) => it.type.physical_name === "power"); //|| it.type.physical_name === "energy");

        this.baseMeasurement.recommendation = this.baseRecommendation.tag.value;
        this.baseMeasurement._recommendation = this.baseRecommendation;
        this.baseMeasurement.label = `${this.baseMeasurement.recommendation}:${
          this.baseMeasurement.label ? this.baseMeasurement.label : this.baseMeasurement.name
        }`;
        if (this.baseMeasurement.measurement_details) {
          this.baseMeasurement.measurement_details.color = "#03fc90";
          this.baseMeasurement.measurement_details["fill_chart"] = false;
        } else {
          this.baseMeasurement.measurement_details = { fill_chart: false, color: "#03fc90" };
        }
      }
    },
    async loadCompareMeasurements() {
      if (this.comparewith) {
        // this.recommendationCompareMeasurements = await this.$ren.hdrApi.getRecommendationsMeasurements(this.comparewith.id);
        this.recommendationCompareMeasurements = await this.$ren.hdrApi.getMeasurements(
          this.hdrRequest ? this.hdrRequest.timestamp : null,
          this.comparewith.tag.key,
          this.comparewith.tag.value,
        );
        for (let m of this.recommendationCompareMeasurements) {
          m.recommendation = this.comparewith.tag.value;
          m._recommendation = this.comparewith;
          m.label = `${m.recommendation}:${m.label ? m.label : m.name}`;
          if (m.measurement_details) {
            m.measurement_details.color = "#0044ff";
            m.measurement_details["fill_chart"] = false;
          } else {
            m.measurement_details = { fill_chart: false, color: "#0044ff" };
          }
        }
      }
    },
    async loadData() {
      let mDict = {};
      let mGroups = {};
      if (this.recommendationCompareMeasurements)
        for (let m of this.recommendationCompareMeasurements) {
          mDict[m.id] = m;
        }
      if (this.recommendationMeasurements)
        for (let m of this.recommendationMeasurements) {
          mDict[m.id] = m;
        }
      if (this.currentMeasurements)
        for (let m of this.currentMeasurements) {
          mDict[m.id] = m;
        }
      if (this.baseMeasurement) {
        mDict[this.baseMeasurement.id] = this.baseMeasurement;
      }
      this.mDict = mDict;
      let measurements = Object.values(mDict);
      for (let m of measurements) {
        let k = this.measurementGroupKey(m);
        if (!mGroups[k]) mGroups[k] = { header: k, measurements: [] };
        mGroups[k].measurements.push(m);
        if (m._current) {
          let mLabel = m.label ? m.label : m.name;
          mGroups[k].header = mLabel + (m.asset ? (m.asset.label ? ` - ${m.asset.label}` : `" - ${m.asset.name}`) : "");
          mGroups[k].current = m;
        }
      }
      this.mGroups = Object.values(mGroups);
      // console.debug(this.mGroups);
      // console.debug(this.currentMeasurements);
      //todo: filter last 24h and 24h ahead
      console.error("todo hdr recommendation setttings for: date_from and date_to");
      let nowTs = new Date().getTime();
      let from = new Date(nowTs - 24 * 3600 * 1000).getTime();
      let to = new Date(nowTs + 36 * 3600 * 1000).getTime();
      let filterCurrent = { from: from, to: to };
      // let filterRecommendations = { to: to };
      if (measurements.length > 0) {
        this.$refs.spinner.run(async () => {
          if (this.currentMeasurements != null) {
            let curIds = this.currentMeasurements.map((it) => it.id);

            let pData = await this.$ren.dataApi.getMeasurementTimeseries(measurements, filterCurrent);
            let idx = pData.timestamps.findIndex((ts) => ts >= nowTs); //border  between past and future data

            if (idx < 1) {
              this.pData = pData;
              return;
            }

            pData.statistics = {};
            for (let mId in pData.current) {
              if (!curIds.includes(Number(mId))) {
                //only recommendations
                let timeseries = pData.current[mId];
                let recommendationMeasurement = mDict[mId];
                for (let i in timeseries) {
                  if (i < idx) {
                    timeseries[i] = null;
                  } else {
                    break;
                  }
                }
                let demand_stats = this.calcEnergyStats(nowTs, pData, recommendationMeasurement);
                var avg = timeseries.reduce((partialSum, a) => partialSum + (a === null ? 0 : a), 0) / (timeseries.length - idx);

                pData.statistics[mId] = { avg: avg, peak: Math.max(...timeseries), demand_stats: demand_stats };
                //get the last point from the current timeseries
                let currentMeasurement = mGroups[this.measurementGroupKey(recommendationMeasurement)].current;
                if (!currentMeasurement) {
                  console.error("Missing mdefault measurement: " + this.measurementGroupKey(recommendationMeasurement));
                  console.debug(recommendationMeasurement);
                  this.$emitter.emit("error", {
                    message: this.$t("error.missing_hdr_default_measurement", [this.measurementGroupKey(recommendationMeasurement)]),
                  });
                  this.$emitter.emit("error", {
                    message: this.measurementGroupKey(recommendationMeasurement),
                  });
                  return;
                }
                timeseries[idx - 1] = pData.current[currentMeasurement.id][idx - 1];
              }
            }
            this.pData = pData;
          } else {
            this.pData = await this.$ren.dataApi.getMeasurementTimeseries(measurements, filterCurrent);
          }
          this.pData.timestamps.findIndex((it) => it > nowTs);
          // this.annotations = this.getAnnotations();
          this.reloadChart = !this.reloadChart;
        });
      }
    },

    reload() {
      this.$emit("reload");
    },
    calcValueChange(from_idx, to_idx, tdf, pData) {
      if (this.baseRecommendation == null) {
        return;
      }
      var timeseries = pData.current[this.baseMeasurement.id].slice(from_idx, to_idx + 1);
      var avg = timeseries.reduce((partialSum, a) => partialSum + (a === null ? 0 : a), 0) / timeseries.length;

      var avgPow = this.$store.getters["view/convertValue"](this.baseMeasurement.type, avg, "W");
      console.debug(this.baseMeasurement);
      console.debug("basepow");
      console.debug(avgPow);

      if (this.hdrRequest.value_type.physical_name === "energy") {
        //todo: change to relative value

        let valueChange = this.$store.getters["view/convertValue"](this.hdrRequest.value_type, this.hdrRequest.value_change, "Wh");
        var energy = (avgPow * (tdf / 1000.0)) / 3600;
        return energy + valueChange;
      } else if (this.hdrRequest.value_type.physical_name === "power" || 1 == 1) {
        //todo: change to relative value
        let valueChange = this.$store.getters["view/convertValue"](this.hdrRequest.value_type, this.hdrRequest.max_value, "W");
        return avgPow + valueChange;
      }
      //
      return avg;
      // this.baseRecommendation.
      // var avg = timeseries.reduce((partialSum, a) => partialSum + (a === null ? 0 : a), 0) / (timeseries.length - idx);
    },

    calcEnergyStats(nowTs, pData, recommendationMeasurement) {
      if (this.hdrRequest == null) return;
      var tdf = Math.max(nowTs, this.hdrRequest.date_to) - Math.max(nowTs, this.hdrRequest.date_from);
      var from_idx = pData.timestamps.findIndex((ts) => ts >= Math.max(nowTs, this.hdrRequest.date_from));
      var to_idx = pData.timestamps.findIndex((ts) => ts >= Math.max(nowTs, this.hdrRequest.date_to));
      if (to_idx <= from_idx) {
        return;
      }

      if (recommendationMeasurement.type.physical_name === "power") {
        console.debug("calc stats");
        console.debug(recommendationMeasurement);
        var timeseries = pData.current[recommendationMeasurement.id].slice(from_idx, to_idx + 1);
        var avg = timeseries.reduce((partialSum, a) => partialSum + (a === null ? 0 : a), 0) / timeseries.length;

        var avgPow = this.$store.getters["view/convertValue"](recommendationMeasurement.type, avg, "W");
        if (this.hdrRequest.value_change != null) {
          var v = this.calcValueChange(from_idx, to_idx, tdf, pData);
        }
        if (this.hdrRequest.value_type.physical_name === "energy") {
          var energy = (avgPow * (tdf / 1000.0)) / 3600;

          // console.error(avgPow);
          // console.error(energy);
          // console.error(v);
          // console.error(this.hdrRequest.value_change > 0 ? energy > v : energy < v);
          let res = {
            result: this.hdrRequest.max_value || this.hdrRequest.value_change < 0 ? energy < v : energy > v,
            demand: this.$store.getters["view/convertSIValue"]("energy", v, this.hdrRequest.value_type.unit),
            predicted: this.$store.getters["view/convertSIValue"]("energy", energy, this.hdrRequest.value_type.unit),
            unit: this.hdrRequest.value_type.unit,
          };
          console.info(res);
          return res;
        } else if (this.hdrRequest.value_type.physical_name === "power" || 1 == 1) {
          let res = {
            result: this.hdrRequest.max_value || this.hdrRequest.value_change < 0 ? avgPow < v : avgPow > v,
            demand: this.$store.getters["view/convertSIValue"]("power", v, this.hdrRequest.value_type.unit),
            predicted: this.$store.getters["view/convertSIValue"]("power", avgPow, this.hdrRequest.value_type.unit),
            unit: this.hdrRequest.value_type.unit,
          };
          return res;
        }
      }
      return null;
    },
    getAnnotations(group) {
      let annotations = [];
      var now = new Date().getTime();
      let currentLine = this._getAnnotationX(now);
      annotations.push(currentLine);
      if (this.hdrRequest == null) {
        return annotations;
      }
      // let minIdx = Math.round(this.pData["timestamps"].length * 0.7);
      // let maxIdx = Math.round(this.pData["timestamps"].length * 0.9);
      // let annotationMin = this._getAnnotation(this.pData["timestamps"][minIdx]);
      // let annotationMax = this._getAnnotation(this.pData["timestamps"][maxIdx]);
      // let annotationBox = this._getBoxAnnotation(this.pData["timestamps"][minIdx], this.pData["timestamps"][maxIdx]);

      let cur = group.current;
      if (cur.domain === "heat" && cur.type.physical_name == this.hdrRequest.value_type.physical_name) {
        console.error("todo: convert hdr request and current measurement units");
        if (this.hdrRequest.max_value != null) {
          let requestLine = this._getAnnotationY(this.hdrRequest.max_value);
          annotations.push(requestLine);
        } else if (this.hdrRequest.value_change != null) {
          let v = Math.max(...this.pData.current[cur.id]) + this.hdrRequest.value_change;
          let requestLine = this._getAnnotationY(v);
          annotations.push(requestLine);
        }
      }
      if (this.hdrRequest != null) {
        let annotationBox = this._getBoxAnnotation(this.hdrRequest.date_from, this.hdrRequest.date_to);
        annotations.push(annotationBox);
      }

      return annotations;
      // return [annotationMin, annotationMax, annotationBox];
    },
    _getAnnotationX(x) {
      return {
        type: "line",
        drawTime: "afterDatasetsDraw",
        borderColor: "black",
        borderDash: [6, 6],
        borderWidth: 1.5,
        xMax: x,
        xMin: x,
        xScaleID: "x",
        // yMax: 0,
        // yMin: 150110,
        // yScaleID: "y",
      };
    },
    _getAnnotationY(y) {
      return {
        type: "line",
        drawTime: "afterDatasetsDraw",
        borderColor: "red",
        borderDash: [6, 6],
        borderWidth: 1.5,
        yMax: y,
        yMin: y,
        yScaleID: "y",
        // yMax: 0,
        // yMin: 150110,
        // yScaleID: "y",
      };
    },
    _getBoxAnnotation(minX, maxX) {
      return {
        type: "box",
        backgroundColor: "#0071ff20",
        drawTime: "afterDatasetsDraw",
        borderColor: "#0071ffFF",
        borderDash: [6, 6],
        borderWidth: 4,
        xMax: maxX,
        xMin: minX,
        xScaleID: "x",
        // yMax: 0,
        // yMin: 150110,
        // yScaleID: "y",
      };
    },
  },
};
</script>

<style lang="scss"></style>
