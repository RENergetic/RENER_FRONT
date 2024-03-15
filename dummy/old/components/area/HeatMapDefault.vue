<template>
  <div class="grid">
    <div class="col-9">
      <div v-show="bgImage != null" id="heatmapContainer">
        <v-stage id="heatmap" ref="stage" :config="stageSize" @click="onClick">
          <v-layer v-show="bgImage != null">
            <v-image
              :config="{
                image: bgImage,
              }"
            />
          </v-layer>
        </v-stage>
      </div>
    </div>
  </div>
</template>
<script>
import Konva from "konva";

import { Colors } from "../../../plugins/model/Enums";

const defaultSceneWidth = 0.7 * window.innerWidth;
const defaultSceneHeight = (defaultSceneWidth * 9) / 16;

export default {
  name: "HeatMapDefault",
  components: {
    // HeatMapSettings,
  },
  props: {
    height: {
      type: Number,
      default: () => defaultSceneHeight,
    },
    width: {
      type: Number,
      default: () => defaultSceneWidth,
    },
    heatmap: {
      type: Object,
      default: () => null,
    },
    heatmapState: {
      type: Object,
      default: () => ({}),
    },
    selected: {
      type: Object,
      default: () => null,
    },
  },
  /**
   *  @select on selected: event.areas - selected areas
   *  @click on area click: event. area - clicked area
   */
  emits: ["update:selected", "click"],
  data() {
    return {
      selectedArea: null,
      scale: 1,
      bgImage: null,
      selectedAreas: {},
    };
  },
  computed: {
    stageSize() {
      return {
        width: this.width,
        height: this.height,
      };
    },
  },
  watch: {
    selectedAreas: {
      handler: async function (newValue) {
        this.$emit("update:selected", newValue);
      },
      deep: true,
    },
    heatmap: function () {
      if (this.heatmap != null) {
        this.drawBackground(this.heatmap);
      } else console.info("todo: null");
    },
  },
  mounted() {
    if (this.heatmap != null) {
      this.drawBackground(this.heatmap);
    }
  },
  methods: {
    drawBackground(heatmap) {
      const image = new window.Image();
      image.src = heatmap.imgUrl;
      image.onload = () => {
        // set image only when it is loaded
        this.bgImage = image;
        let stage = this.$refs.stage.getStage();
        this.scaleImage(stage, image);
        heatmap.areas.forEach((area, idx) => this.drawArea(area, idx));
      };
    },
    onAreaSelect(area) {
      if (this.selectedArea != null) {
        let oldId = this.selectedArea.id;
        this.toggleArea(oldId, false);
      }
      if (area != null) {
        Object.keys(this.selectedAreas).forEach((id) => {
          this.toggleArea(id, false);
        });
        let selectedAreas = {};
        selectedAreas[area.id] = area.label;
        this.selectedAreas = selectedAreas;
        let newId = area.id;
        this.toggleArea(newId, true);
      }
    },
    getColor(id, selected = false) {
      let state = this.heatmapState != null ? this.heatmapState[id] : null;
      let transparency = process.env.VUE_APP_HEATMAP_TRANSPARENCY;
      if (selected) {
        transparency = process.env.VUE_APP_HEATMAP_SELECTED_TRANSPARENCY;
        // return Colors.SELECTED + transparency;
      }
      switch (Colors[state]) {
        case Colors.OK:
          return Colors.OK + transparency;
        case Colors.WARNING:
          return Colors.WARNING + transparency;
        case Colors.ERROR:
          return Colors.ERROR + transparency;
        default:
          return Colors.DEFAULT + transparency;
      }
    },
    toggleArea(id, selected) {
      let shape = this.$refs.stage.getStage().findOne(`#${id}`);
      if (shape != null) {
        shape.fill(this.getColor(id, selected));
      }
    },
    onClick(evt) {
      // console.info(evt.target.nodeName);
      if (evt.target.nodeName == "CANVAS" && this.addMode) {
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
      }
    },

    drawArea(area, idx) {
      let layer = new Konva.Layer();
      let stage = this.$refs.stage.getStage();
      let item = new Konva.Shape(this.getConfig(area));
      let areaId = area.id;
      item.on("click", () => {
        this.selectedArea = this.heatmap.areas[idx];
        if (this.selectedAreas[areaId]) {
          if (this.selectedAreas.length == 1) {
            this.selectedAreas = {};
          } else delete this.selectedAreas[areaId];
          this.toggleArea(area.id, false);
        } else {
          this.selectedAreas[areaId] = area.label;
          this.toggleArea(area.id, true);
        }
        let keys = Object.keys(this.selectedAreas);
        if (keys.length != 1) {
          this.selectedArea = null;
        } else {
          let k = Object.keys(this.selectedAreas);
          this.heatmap.areas.forEach((area) => {
            if (area.id == k[0]) {
              this.selectedArea = area;
              this.$emit("click", { area: area });
            }
          });
        }
      });
      layer.add(item);
      stage.add(layer);
      stage.draw();
    },

    getConfig(area) {
      return {
        sceneFunc: function (context, shape) {
          context.beginPath();
          // console.info(area);
          area.roi.forEach((pnt) => {
            context.lineTo(pnt[0], pnt[1]);
          });
          context.closePath();
          // special Konva.js method
          context.fillStrokeShape(shape);
        },
        fill: this.getColor(area.id),
        stroke: "black",
        strokeWidth: 1,
        opacity: 0.75,
        listening: true,
        id: area.id,
      };
    },

    scaleImage(stage, bgImage) {
      if (bgImage != null) {
        var scale = Math.min(this.width / bgImage.width, this.height / bgImage.height);
        this.scale = scale;
        // console.info(this.scale);
        stage.width(bgImage.width * scale);
        stage.height(bgImage.height * scale);
        stage.scale({ x: scale, y: scale });
      }
    },
  },
};
</script>

<style lang="scss">
#heatmap {
  max-width: 90%;
  max-height: 80vh;
}
#heatmapContainer {
  padding: 0.5rem;
}
</style>
