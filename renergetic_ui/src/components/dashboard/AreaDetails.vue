<template>
  <Card>
    <template v-if="mArea != null" #title>
      <span v-if="edit">{{ $t("view.edit_area") }}</span>
      <span v-else>{{ $t("view.view_area") }}</span>
      <i
        v-if="edit"
        class="pi pi-times"
        style="fontsize: 2rem"
        @click="deleteArea()"
      />
    </template>
    <template v-else #title>
      {{ $t("view.select_area") }}
    </template>
    <template v-if="mArea != null" #content>
      <!-- {{ area.id }} -->
      <div class="p-field p-grid">
        <label for="heatmapLabel">
          {{ $t("heatmap.label") }}
        </label>
        <InputText
          id="heatmapLabel"
          v-model="mArea.label"
          :aria-readonly="!edit"
        />
      </div>
    </template>
    <template v-else #content>
      <!-- {{ area.id }} -->
      <div class="p-field p-grid">
        <label for="heatmapLabel">
          {{ $t("heatmap.label") }}
        </label>
        <InputText
          id="heatmapLabel"
          aria-disabled="True"
          aria-placeholder="placeholder: todo:"
          :aria-readonly="!edit"
        />
      </div>
    </template>
  </Card>
</template>
<script>
import Card from "primevue/card";

export default {
  name: "AreaDetails",
  components: { Card },

  props: {
    edit: {
      type: Boolean,
      default: true,
    },
    modelValue: {
      type: Object,
      default: () => null,
    },
  },
  emits: ["delete", "update:modelValue"],
  data() {
    return {
      label: this.modelValue != null ? this.modelValue.label : null,
      mArea: null,
    };
  },
  watch: {
    mArea: {
      handler(newVal, oldValue) {
        if (oldValue == null) {
          return;
        }
        this.$emit("update:modelValue", newVal);
      },
      deep: true,
      immediate: true, //  the callback will be called immediately after the start of the observation
    },
    modelValue: function (newVal) {
      this.mArea = newVal;
    },
  },
  methods: {
    deleteArea() {
      this.$confirm.require({
        message: this.$t("view.heatmap_area_delete_confirm", {
          label: this.label,
        }),
        header: this.$t("view.heatmap_area_delete"),
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          this.$emit("delete", this.mArea);
        },
        reject: () => {
          this.$confirm.close();
        },
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
