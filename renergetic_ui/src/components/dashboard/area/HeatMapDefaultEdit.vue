<template>
  <div class="grid">
    <div class="col-12">
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
    <div class="card gf">
      <div class="field grid">
        <div v-if="!addMode && bgImage" class="col">
          <Button :label="$t('view.button.add_area')" @click="addPoint" />
        </div>
        <div v-if="!addMode && selectedArea" class="col">
          <Button :label="$t('view.button.edit_area')" @click="editPoint" />
        </div>
        <div v-if="!addMode && selectedArea" class="col">
          <Button :label="$t('view.button.show_details')" @click="showDetails" />
        </div>
        <div v-if="addMode" class="col">
          <Button :label="$t('view.button.confirm_area')" @click="confirmPoint" />
          <!-- <Button v-if="selectedArea" :label="$t('view.button.add_area')" @click="confirmEditPoint" /> -->
        </div>
        <div v-if="addMode" class="col">
          <Button :label="$t('view.button.cancel')" @click="cancelPoint" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Konva from "konva";
import { MapArea } from "@/plugins/model/Area";
import { Colors } from "@/plugins/model/Enums";

const defaultSceneWidth = 0.7 * window.innerWidth;
const defaultSceneHeight = (defaultSceneWidth * 9) / 16;

export default {
  name: "HeatMapDefaultEdit",
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
    selected: {
      type: Object,
      default: () => null,
    },
  },
  /**
   *  @areaDetails show details: event.area - selected areas
   *  @click on area click: event. area - clicked area
   */
  emits: ["click", "areaDetails", "update:heatmap"],
  data() {
    return {
      selectedArea: null,
      scale: 1,
      addMode: false,
      bgImage: null,
      mHeatmap: this.heatmap,
      // selectedAreas: {},
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
    // heatmap: function () {
    //   if (this.mHeatmap != null) {
    //     this.drawBackground(this.mHeatmap);
    //   } else console.info("todo: null");
    // },

    mHeatmap: {
      handler: function (newVal) {
        this.$emit("update:heatmap", { area: newVal });
      },
      deep: true,
    },
  },
  mounted() {
    if (this.mHeatmap != null) {
      this.drawBackground(this.mHeatmap);
    }
  },
  created() {
    if (this.heatmap != null) {
      this.drawBackground(this.heatmap);
    }
  },
  methods: {
    drawBackground(heatmap) {
      if (heatmap == null || heatmap.imgUrl == null) return;
      const image = new window.Image();
      console.info(heatmap.imgUrl);
      image.src = heatmap.imgUrl;
      image.onload = () => {
        // set image only when it is loaded
        this.bgImage = image;
        let stage = this.$refs.stage.getStage();
        this.scaleImage(stage, image);
        heatmap.areas.forEach((area, idx) => this.drawArea(area, idx));
      };
    },

    areaDelete(area) {
      this.mHeatmap.areas = this.mHeatmap.areas.filter((f) => f.id != area.id);
      this.deletePoint(area.id);
      if (this.selectedArea != null && this.selectedArea.id == area.id) {
        this.selectedArea = null;
      }
    },
    onAreaSelect(area) {
      if (this.selectedArea != null) {
        let oldId = this.selectedArea.id;
        this.toggleArea(oldId, false);
      }
      if (area != null) {
        // Object.keys(this.selectedAreas).forEach((id) => {
        //   this.toggleArea(id, false);
        // });
        // let selectedAreas = {};
        // selectedAreas[area.id] = area.label;
        // this.selectedAreas = selectedAreas;
        let newId = area.id;
        this.toggleArea(newId, true);
      }
      this.selectedArea = area;
    },

    getColor(selected = false) {
      let transparency = process.env.VUE_APP_HEATMAP_TRANSPARENCY;
      if (selected) {
        transparency = process.env.VUE_APP_HEATMAP_SELECTED_TRANSPARENCY;
        // return Colors.SELECTED + transparency;
      }
      return Colors.DEFAULT + transparency;
    },
    toggleArea(id, selected) {
      let shape = this.$refs.stage.getStage().findOne(`#${id}`);
      if (shape != null) {
        shape.fill(this.getColor(selected));
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

    drawArea(area) {
      //,idx
      let layer = new Konva.Layer();
      let stage = this.$refs.stage.getStage();
      let item = new Konva.Shape(this.getConfig(area));
      // let areaId = area.id;
      item.on("click", () => {
        this.$emit("click", { area: area });
        this.onAreaSelect(area); //this.mHeatmap.areas[idx]

        // if (this.selectedAreas[areaId]) {
        //   if (this.selectedAreas.length == 1) {
        //     this.selectedAreas = {};
        //   } else delete this.selectedAreas[areaId];
        //   this.toggleArea(area.id, false);
        // } else {
        //   this.selectedAreas[areaId] = area.label;
        //   this.toggleArea(area.id, true);
        // }
        // let keys = Object.keys(this.selectedAreas);
        // if (keys.length != 1) {
        //   this.selectedArea = null;
        // } else {
        //   let k = Object.keys(this.selectedAreas);
        //   this.mHeatmap.areas.forEach((area) => {
        //     if (area.id == k[0]) {
        //       this.selectedArea = area;
        //       this.$emit("click", { area: area });
        //     }
        //   });
        // }
      });
      layer.add(item);
      stage.add(layer);
      stage.draw();
    },
    showDetails() {
      this.$emit("areaDetails", { area: this.selectedArea });
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
        fill: this.getColor(),
        stroke: "black",
        strokeWidth: 1,
        opacity: 0.75,
        listening: true,
        id: area.id,
      };
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
          this.scaleImage(stage, image);
          this.mHeatmap.imgUrl = image.src;
        };
      }
    },
    confirmPoint() {
      //todo: validate
      if (this.selectedArea != null) {
        this.deletePoint(this.selectedArea.id);
        this.selectedArea.roi = this.current.roi;
        this.cancelPoint();
        this.drawArea(this.selectedArea);
      } else {
        this.mHeatmap.areas.push(this.current);
        this.current = null;
      }
      this.addMode = false;
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
    addPoint() {
      this.selectedArea = null;
      this.current = new MapArea(this.$ren.utils.uuid());
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
