<template>
  <div class="p-grid">
    <div class="p-col-8">
      <Card>
        <template #title> HeatMap editor </template>
        <template #content>
          <!-- file upload-->
          <!-- {{ areas }} {{ scale }} -->
          <div v-if="bgImage == null" class="p-field p-grid">
            <div class="p-col">
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
                    {{ $t("form.heat_map_image") }}
                  </p>
                </template>
              </FileUpload>
            </div>
          </div>
          <div v-show="bgImage != null" id="heatmapContainer">
            <!-- test: {{ points }}{{ current }} -->
            <v-stage
              id="heatmap"
              ref="stage"
              :config="stageSize"
              @click="onClick"
            >
              <v-layer>
                <v-image
                  :config="{
                    image: bgImage,
                  }"
                />
              </v-layer>
              <!-- <v-layer v-for="(pnt, index) in points" :key="pnt.id">
          <v-shape :config="getConfig(pnt, index)" />
        </v-layer> -->
              <v-layer v-if="current != null" :id="current.id">
                <v-shape
                  v-if="current.points.length > 1"
                  :config="getConfig(current)"
                />
              </v-layer>
            </v-stage>
          </div>
        </template>
      </Card>
    </div>
    <div v-if="bgImage" class="p-col-3 ren">
      <AreaDetails
        class="tile"
        :model-value="selectedArea"
        @update:model-value="selectedArea = $event"
        @delete="areaDelete(selectedArea)"
      ></AreaDetails>
      <Card class="tile">
        <template #title> {{ $t("heatmap.areas") }}</template>
        <template #content>
          <Listbox
            v-model="selectedArea"
            :options="areas"
            option-label="label"
            style="width: 15rem"
          />
        </template>
      </Card>
    </div>
  </div>

  <div class="card gf">
    <div class="p-fluid p-formgrid p-grid ren-submit">
      <div class="p-field p-md-3 p-sm-6">
        <Button :label="$t('view.button.add_point')" @click="addPoint" />
      </div>
      <div v-if="addMode" class="p-field p-md-3 p-sm-6">
        <Button
          :label="$t('view.button.confirm_point')"
          @click="confirmPoint"
        />
      </div>
    </div>
    <div class="p-field p-grid ren-submit">
      <div class="p-col">
        <Button
          :disabled="!hasFiles"
          :label="$t('view.button.submit')"
          @click="submit"
        />
      </div>
      <div class="p-col">
        <Button :label="$t('view.button.cancel')" @click="cancel" />
      </div>
    </div>
    <div class="p-field p-grid">
      <div v-if="inspectionId">
        {{ $t("view.current_inspection", { inspection_id: inspectionId }) }}
      </div>
    </div>

    <ProgressSpinner
      v-if="spinner"
      style="width: 10rem; height: 10rem; margin: auto; display: flex"
      stroke-width="4"
    />
  </div>
</template>
<script>
import FileUpload from "primevue/fileupload";
import AreaDetails from "./AreaDetails.vue";
import Listbox from "primevue/listbox";
import { MapArea } from "../../plugins/model/Area";

import Card from "primevue/card";
import Konva from "konva";
//initial canvas size
const sceneWidth = 900;
const sceneHeight = 450;
var nextId = 0;
export default {
  name: "HeatMapCreator",
  components: { FileUpload, Card, Listbox, AreaDetails },
  data() {
    return {
      //heat map area id
      stageSize: {
        width: sceneWidth,
        height: sceneHeight,
      },
      image: null,
      bgImage: null,
      hasFiles: false,
      current: null,
      areas: [],
      selectedArea: null,
      scale: 1,
      addMode: false,
    };
  },
  watch: {
    selectedArea: function (newValue, oldValue) {
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
  created() {
    this.current = new MapArea(`area_${nextId++}`);
  },
  mounted() {},
  methods: {
    areaDelete(area) {
      this.areas = this.areas.filter((f) => f.id != area.id);
      this.deletePoint(area.id);
      if (this.current != null && this.current.id == area.id) {
        this.current = null;
      }
    },
    onClick(evt) {
      // console.info(evt.target.nodeName);
      if (evt.target.nodeName == "CANVAS" && this.addMode) {
        console.info([evt.layerX / this.scale, evt.layerY / this.scale]);
        // console.info(evt);var evt = e.evt;
        this.current.points.push([
          evt.layerX / this.scale,
          evt.layerY / this.scale,
        ]);
      }
    },
    addPoint() {
      this.current.points = []; // new MapArea(`area_${nextId++}`);
      this.addMode = true;
    },
    deletePoint(id) {
      let layer = this.$refs.stage.getStage().findOne(`#${id}`);
      if (layer != null) layer.destroy();
      //else: TODO:
    },
    confirmPoint() {
      let area = new MapArea(`area_${nextId++}`, this.current.points);
      let layer = new Konva.Layer();
      let stage = this.$refs.stage.getStage();
      let item = new Konva.Shape(this.getConfig(area));
      layer.add(item);
      stage.add(layer);
      stage.draw();
      // console.info(this.$refs.stage);
      this.areas.push(area);
      this.current.points = [];
      this.addMode = false;
      // this.current = new Area(`area_${this.nextId++}`);
    },
    getConfig(area) {
      return {
        sceneFunc: function (context, shape) {
          context.beginPath();
          area.points.forEach((pnt) => {
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
      if (this.$refs.FileUpload != null) this.$refs.FileUpload.clear();
      this.bgImage = null;
    },
    onSelect() {
      // console.info(this.$refs.FileUpload.files[0]);
      this.inspectionId = null;
      this.decision = null;
      if (this.$refs.FileUpload !== undefined)
        this.hasFiles = this.$refs.FileUpload.files.length > 0;
      else this.hasFiles = false;
      if (this.hasFiles) {
        const image = new window.Image();
        console.info(image);
        image.src = this.$refs.FileUpload.files[0].objectURL;
        let stage = this.$refs.stage.getStage();
        image.onload = () => {
          // set image only when it is loaded
          this.bgImage = image;
          this.scaleHeatMap(stage);
        };
      }
    },
    scaleHeatMap(stage) {
      if (this.bgImage != null) {
        var scale = sceneWidth / this.bgImage.width;
        this.scale = scale;
        // alert(this.$refs.stage);

        // // console.info( stage);
        stage.width(this.bgImage.width);
        stage.height(this.bgImage.height);
        stage.scale({ x: scale, y: scale });
      }
    },
    async submit() {
      var dashoard = { name: this.name, label: this.label, url: this.url };
      this.$ren.dashboardApi.add(dashoard).then((id) => {
        dashoard.id = id;
        this.$store.commit("view/dashboardsAdd", dashoard);
        //todo: emit event
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
