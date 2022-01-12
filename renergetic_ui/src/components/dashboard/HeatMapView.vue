<template>
  <div class="p-grid">
    <div class="p-col-8">
      <Card>
        <!-- {{ heatMap }}ssss {{ bgImage }} dddd -->
        <template #title> HeatMap View </template>
        <template #content>
          <div id="heatmapContainer">
            <v-stage
              id="heatmap"
              ref="stage"
              :config="stageSize"
              @click="onClick"
            >
              <v-layer v-show="bgImage != null">
                <v-image
                  :config="{
                    image: bgImage,
                  }"
                />
              </v-layer>
              <!-- <v-layer  v-for="area in heatMap.areas" :key="area.id">
                <v-shape :config="getConfig(area)" />
              </v-layer> -->
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
            v-if="heatMap != null"
            v-model="selectedArea"
            :options="heatMap.areas"
            option-label="label"
            style="width: 15rem"
          />
        </template>
      </Card>
    </div>
  </div>
</template>
<script>
import AreaDetails from "../../components/dashboard/AreaDetails.vue";
import Listbox from "primevue/listbox";

import Card from "primevue/card";
import Konva from "konva";

//TODO: update image,todo: spinner?
//initial canvas size  this.drawArea(this.current);
const sceneWidth = 900;
const sceneHeight = 450;
export default {
  name: "HeatMapView",
  components: { Card, Listbox, AreaDetails },
  props: {
    heatMap: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      //heat map area id
      stageSize: {
        width: sceneWidth,
        height: sceneHeight,
      },
      selectedArea: null,
      scale: 1,
      bgImage: null,
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
    heatMap: function () {
      if (this.heatMap != null) {
        const image = new window.Image();
        image.src = this.heatMap.imgUrl;
        image.onload = () => {
          // set image only when it is loaded
          this.bgImage = image;
          let stage = this.$refs.stage.getStage();
          this.scaleHeatMap(stage, image);
          for (var area in this.heatMap.areas) {
            this.drawArea(area);
          }
        };
      } else console.info("todo: null");
    },
  },
  mounted() {
    if (this.heatMap != null) {
      const image = new window.Image();
      image.src = this.heatMap.imgUrl;
      image.onload = () => {
        // set image only when it is loaded
        this.bgImage = image;
        let stage = this.$refs.stage.getStage();
        this.scaleHeatMap(stage, image);

        this.heatMap.areas.forEach((it) => this.drawArea(it));
      };
    }
  },
  methods: {
    onClick(evt) {
      // console.info(evt.target.nodeName);
      if (evt.target.nodeName == "CANVAS" && this.addMode) {
        // console.info([evt.layerX / this.scale, evt.layerY / this.scale]);
        // console.info(evt);var evt = e.evt;
        let stage = this.$refs.stage.getStage();
        var shape = stage.findOne(`#${this.current.id}`);
        if (shape != null) {
          this.current.points.push([
            evt.layerX / this.scale,
            evt.layerY / this.scale,
          ]);
          let pnts = this.current.points;
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
      }
    },

    drawArea(area) {
      let layer = new Konva.Layer();
      let stage = this.$refs.stage.getStage();
      let item = new Konva.Shape(this.getConfig(area));
      layer.add(item);
      stage.add(layer);
      stage.draw();
    },
    getConfig(area) {
      return {
        sceneFunc: function (context, shape) {
          context.beginPath();
          console.info(area);
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
    onSelect() {
      if (this.$refs.FileUpload !== undefined)
        this.hasFiles = this.$refs.FileUpload.files.length > 0;
      else this.hasFiles = false;
      if (this.hasFiles) {
        const image = new window.Image();
        image.src = this.$refs.FileUpload.files[0].objectURL;
        image.onload = () => {
          // set image only when it is loaded
          let stage = this.$refs.stage.getStage();
          this.bgImage = image;
          this.scaleHeatMap(stage, image);
          this.heatmap.imgUrl = image.src;
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
