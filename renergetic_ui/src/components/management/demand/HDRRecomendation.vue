<template>
  <RenSpinner ref="spinner" :key="reloadChart" :lock="true" style="margin: auto; max-width: 95%">
    <template #content>
      <!-- {{ recommendationId }}{{ compareId }} -->

      <div v-if="pData && pData.timestamps && pData.timestamps.length > 0" :key="pData.timestamps.length" style="width: 100%">
        <TabView>
          <TabPanel v-for="(group, index) in mGroups" :key="index" :header="group.header">
            <!-- :style="'margin:auto;max-width: 90%;'" -->
            <!-- :immediate="false" -->
            <!-- {{ group.measurements }} -->

            <!-- :chart-type="chartType" -->
            <MeasurementChart
              :ref="`mChart_${index}`"
              :p-data="{ timeseries: pData }"
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
        return `${r1}-${r2}`;
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
      let assetId = m.asset ? m.asset.id : "";
      return `${m.name}_${m.sensor_name}_${m.type.id}_${assetId}_${m.direction}_${m.domain}`;
    },
    async loadCurrentMeasurements() {
      if (this.hdrRequest == null) {
        return;
      }
      let r = this.recommendation;
      // if (this.tagKey != r.tag.key)
      this.currentMeasurements = await this.$ren.hdrApi.getMeasurements(this.hdrRequest.timestamp, r.tag.key, "no_tag");
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
        await this.loadCurrentMeasurements();
        // alert(JSON.stringify(this.recommendation));
        // this.recommendationMeasurements = await this.$ren.hdrApi.getRecommendationsMeasurements(this.recommendation.id);
        this.recommendationMeasurements = await this.$ren.hdrApi.getMeasurements(
          this.recommendation.timestamp,
          this.recommendation.tag.key,
          this.recommendation.tag.value,
        );
        for (let m of this.recommendationMeasurements) {
          m.recommendation = this.recommendation.tag.value;
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
    async loadCompareMeasurements() {
      if (this.comparewith) {
        // this.recommendationCompareMeasurements = await this.$ren.hdrApi.getRecommendationsMeasurements(this.comparewith.id);
        this.recommendationMeasurements = await this.$ren.hdrApi.getMeasurements(
          this.comparewith.timestamp,
          this.comparewith.tag.key,
          this.comparewith.tag.value,
        );
        for (let m of this.recommendationCompareMeasurements) {
          m.recommendation = this.comparewith.tag.value;
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
      // console.info(measurements);
      //todo: filter last 24h and 24h ahead
      let nowTs = new Date().getTime();
      let from = new Date(nowTs - 24 * 3600 * 1000).getTime();
      let to = new Date(nowTs + 36 * 3600 * 1000).getTime();
      let filterCurrent = { from: from, to: to };
      // let filterRecommendations = { to: to };
      if (measurements.length > 0) {
        this.$refs.spinner.run(async () => {
          if (this.currentMeasurements != null) {
            console.debug(this.currentMeasurements);
            let curIds = this.currentMeasurements.map((it) => it.id);
            // let pDataCurrent = await this.$ren.dataApi.getMeasurementTimeseries(this.currentMeasurements, filterCurrent);
            // console.info(pDataCurrent);

            let pData = await this.$ren.dataApi.getMeasurementTimeseries(measurements, filterCurrent);
            let idx = pData.timestamps.findIndex((ts) => ts >= nowTs); //border  between past and future data
            if (idx < 1) {
              this.pData = pData;
              return;
            }
            for (let mId in pData.current) {
              if (!curIds.includes(Number(mId))) {
                //only recommendations
                let recomemndationMeasurement = mDict[mId];
                let timeseries = pData.current[mId];
                for (let i in timeseries) {
                  if (i < idx) {
                    timeseries[i] = null;
                  } else {
                    break;
                  }
                }
                //get the last point from the current timeseries
                let currentMeasurement = mGroups[this.measurementGroupKey(recomemndationMeasurement)].current;

                timeseries[idx - 1] = pData.current[currentMeasurement.id][idx - 1];
              }
            }
            this.pData = pData;
          } else {
            this.pData = await this.$ren.dataApi.getMeasurementTimeseries(measurements, filterCurrent);
          }

          // this.annotations = this.getAnnotations();
          // console.info(this.annotations);
          this.reloadChart = !this.reloadChart;
        });
      }
    },

    reload() {
      this.$emit("reload");
    },
    getAnnotations(group) {
      let annotations = [];
      if (this.hdrRequest == null) {
        return annotations;
      }
      // let minIdx = Math.round(this.pData["timestamps"].length * 0.7);
      // let maxIdx = Math.round(this.pData["timestamps"].length * 0.9);
      // let annotationMin = this._getAnnotation(this.pData["timestamps"][minIdx]);
      // let annotationMax = this._getAnnotation(this.pData["timestamps"][maxIdx]);
      // let annotationBox = this._getBoxAnnotation(this.pData["timestamps"][minIdx], this.pData["timestamps"][maxIdx]);
      let currentLine = this._getAnnotationX(new Date().getTime());
      annotations.push(currentLine);
      let cur = group.current;
      // console.info(cur.type);
      // console.info(this.currentMeasurements[index]);
      // console.info(this.hdrRequest.value_type);
      if (cur.domain == "heat" && cur.type.physical_name == this.hdrRequest.value_type.physical_name) {
        // console.info(this.hdrRequest.value_type);
        // console.error(this.pData.current[cur.id]);
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
