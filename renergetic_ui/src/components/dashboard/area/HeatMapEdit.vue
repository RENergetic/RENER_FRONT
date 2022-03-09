<template>
  <div class="grid">
    <div class="col-8">
      <Card>
        <template #title> HeatMap editor </template>
        <template #content>
          <!-- file upload-->
          <!-- {{ areas }} {{ scale }} -->
          <div v-if="bgImage == null" class="field grid">
            <div class="col">
              <FileUpload
                ref="FileUpload"
                with-credentials="true,"
                name="images[]"
                :custom-upload="true"
                :multiple="false"
                accept="image/*"
                :max-file-size="21000000"
                :show-upload-button="false"
                :disabled="false"
                :cancel-label="$t('view.button.clear')"
                :choose-label="$t('view.button.choose')"
                @uploader="customUpload"
                @upload="onUpload"
                @select="onSelect"
              >
                <template #empty>
                  <p>
                    {{ $t("view.select_heatmap_image") }}
                  </p>
                </template>
              </FileUpload>
            </div>
          </div>
          <div v-show="bgImage != null" id="heatmapContainer">
            <v-stage id="heatmap" ref="stage" :config="stageSize" @click="onClick">
              <v-layer>
                <v-image
                  :config="{
                    image: bgImage,
                  }"
                />
              </v-layer>
            </v-stage>
          </div>
        </template>
      </Card>
    </div>
    <div v-if="bgImage" class="col-3 ren">
      <AreaDetails
        :edit="true"
        class="tile"
        :model-value="selectedArea"
        @update:model-value="selectedArea = $event"
        @delete="areaDelete(selectedArea)"
      ></AreaDetails>
      <Card class="tile">
        <template #title> {{ $t("model.heatmap.areas") }}</template>
        <template #content>
          <Listbox
            v-if="mHeatmap != null"
            v-model="selectedArea"
            :options="mHeatmap.areas"
            option-label="label"
            style="width: 15rem"
          />
        </template>
      </Card>
    </div>
  </div>

  <div class="card gf">
    <div class="field grid">
      <div v-if="!addMode && bgImage" class="col">
        <Button :label="$t('view.button.add_area')" @click="addPoint" />
        <Button v-if="selectedArea" :label="$t('view.button.add_area')" @click="editPoint" />
      </div>
      <div v-if="addMode" class="col">
        <Button :label="$t('view.button.confirm_area')" @click="confirmPoint" />
        <Button v-if="selectedArea" :label="$t('view.button.add_area')" @click="confirmEditPoint" />
      </div>
      <div v-if="addMode" class="col">
        <Button :label="$t('view.button.cancel')" @click="cancelPoint" />
      </div>
    </div>
    <!-- <div class="p-fluid p-formgrid grid ren-submit">
      <div v-if="!addMode && bgImage" class="field md-3 sm-6">
        <Button :label="$t('view.button.add_area')" @click="addPoint" />
      </div>
      <div v-if="addMode" class="field md-3 sm-6">
        <Button :label="$t('view.button.confirm_area')" @click="confirmPoint" />
      </div>
      <div v-if="addMode" class="field md-3 sm-6">
        <Button :label="$t('view.button.cancel')" @click="cancelPoint" />
      </div>
    </div> -->
    <div class="field grid ren-submit">
      <div class="col">
        <Button :disabled="!hasFiles" :label="$t('view.button.submit')" @click="submit" />
      </div>
      <div class="col">
        <Button :label="$t('view.button.cancel')" @click="cancel" />
      </div>
    </div>
  </div>
</template>
<script>
import AreaDetails from "./AreaDetails.vue";
import { MapArea } from "@/plugins/model/Area";

import Konva from "konva";
const sceneWidth = 900;
const sceneHeight = 450;
var nextId = 0;
export default {
  name: "HeatMapEdit",
  components: { AreaDetails },
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      //heat map area id
      stageSize: {
        width: sceneWidth,
        height: sceneHeight,
      },
      mHeatmap: this.modelValue,
      hasFiles: false,
      current: null,
      selectedArea: null,
      scale: 1,
      bgImage: null,
      addMode: false,
    };
  },
  watch: {
    selectedArea: function (newValue, oldValue) {
      //toggle colors
      if (oldValue != null) {
        let oldId = oldValue.id;
        let oldShape = this.$refs.stage.getStage().findOne(`#${oldId}`);
        if (oldShape != null) {
          //oldShape  -> after delete
          oldShape.fill("#00D2FFAA");
        }
      }
      if (newValue != null) {
        let newId = newValue.id;
        this.$refs.stage.getStage().findOne(`#${newId}`).fill("#AAAAFFAA");
      }
    },
  },
  async created() {
    if (this.mHeatmap != null && this.mHeatmap.imgUrl != null) {
      const image = new window.Image();
      image.src = this.mHeatmap.imgUrl;
      image.onload = () => {
        // set image only when it is loaded
        this.bgImage = image;
        let stage = this.$refs.stage.getStage();
        this.scaleHeatMap(stage, image);
        this.mHeatmap.areas.forEach((area, idx) => this.drawArea(area, idx));
      };
    }
  },
  mounted() {},
  methods: {
    areaDelete(area) {
      this.mHeatmap.areas = this.mHeatmap.areas.filter((f) => f.id != area.id);
      this.deletePoint(area.id);
      if (this.selectedArea != null && this.selectedArea.id == area.id) {
        this.selectedArea = null;
      }
    },
    onClick(evt) {
      // console.info(evt.target.nodeName);
      if (evt.target.nodeName == "CANVAS" && this.addMode) {
        // console.info([evt.layerX / this.scale, evt.layerY / this.scale]);
        // console.info(evt);var evt = e.evt;
        let stage = this.$refs.stage.getStage();
        var shape = stage.findOne(`#${this.current.id}`);
        if (shape != null) {
          this.current.roi.push([evt.layerX / this.scale, evt.layerY / this.scale]);
          let pnts = this.current.roi;
          let f = (context, shape) => {
            context.beginPath();
            pnts.forEach((pnt) => {
              context.lineTo(pnt[0], pnt[1]);
            });
            context.closePath();
            // special Konva.js method
            context.fillStrokeShape(shape);
          };
          shape.setSceneFunc(f);
        }
        // stage.draw();
        // this.deletePoint(this.current.id);
        // this.drawArea(this.current);
      }
    },
    addPoint() {
      this.current = new MapArea(`area_${nextId++}`);
      this.current.roi = []; // new MapArea(`area_${nextId++}`);
      this.addMode = true;
      this.drawArea(this.current);
    },
    editPoint() {
      this.current = new MapArea(`area_temp`);
      this.current.roi = []; // new MapArea(`area_${nextId++}`);
      this.addMode = true;
      this.drawArea(this.current);
    },

    cancelPoint() {
      this.deletePoint(this.current.id);
      this.current = null;
      this.addMode = false;
    },

    deletePoint(id) {
      let layer = this.$refs.stage.getStage().findOne(`#${id}`);
      if (layer != null) layer.destroy();
      //else: TODO:
    },
    drawArea(area) {
      let layer = new Konva.Layer();
      let stage = this.$refs.stage.getStage();
      let item = new Konva.Shape(this.getConfig(area));
      layer.add(item);
      stage.add(layer);
      stage.draw();
    },
    confirmPoint() {
      // let area = new MapArea(`area_${nextId++}`, this.current.roi);
      //todo: validate
      this.mHeatmap.areas.push(this.current);
      this.current = null;
      this.addMode = false;
    },

    confirmEditPoint() {
      // let area = new MapArea(`area_${nextId++}`, this.current.roi);
      //todo: validate
      this.deletePoint(this.selectedArea.id);
      this.selectedArea.roi = this.current.roi;
      this.cancelPoint();
      this.drawArea(this.selectedArea);
    },
    getConfig(area) {
      return {
        sceneFunc: function (context, shape) {
          context.beginPath();
          area.roi.forEach((pnt) => {
            context.lineTo(pnt[0], pnt[1]);
          });
          context.closePath();
          // special Konva.js method
          context.fillStrokeShape(shape);
        },
        fill: "#00D2FFAA",
        stroke: "black",
        strokeWidth: 1,
        opacity: 0.75,
        listening: true,
        id: area.id,
      };
    },
    cancel() {
      // TOdo: go back
      if (this.$refs.FileUpload != null) this.$refs.FileUpload.clear();
      // this.bgImage = null;
    },
    onSelect() {
      if (this.$refs.FileUpload !== undefined) this.hasFiles = this.$refs.FileUpload.files.length > 0;
      else this.hasFiles = false;
      if (this.hasFiles) {
        const image = new window.Image();
        image.src = this.$refs.FileUpload.files[0].objectURL;
        image.onload = () => {
          // set image only when it is loaded
          let stage = this.$refs.stage.getStage();
          this.bgImage = image;
          this.scaleHeatMap(stage, image);
          this.mHeatmap.imgUrl = image.src;
        };
      }
    },
    scaleHeatMap(stage, bgImage) {
      if (bgImage != null) {
        var scale = sceneWidth / bgImage.width;
        this.scale = scale;
        stage.width(bgImage.width);
        stage.height(bgImage.height);
        stage.scale({ x: scale, y: scale });
      }
    },
    async submit() {
      //todo: validate:

      alert("");
      await this.$ren.dashboardApi.addHeatMap(this.mHeatmap).then(() => {
        // dashoard.id = id;
        // this.$store.commit("view/dashboardsAdd", dashoard);
        // TODO: router back?
        this.$router.push(this.$route.meta.from);
      });
    },
  },
};
</script>

<style lang="scss">
#heatmap {
  max-width: 75%;
  max-height: 75vh;
}
#heatmapContainer {
  padding: 0.5rem;
}
</style>
