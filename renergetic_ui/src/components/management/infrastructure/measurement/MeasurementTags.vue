<template>
  <Dialog v-model:visible="measurementTagsDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <!-- {{ availableTags }}
    {{ availableTagsValues }} -->

    <div v-if="availableTags" :key="updateKey" class="ren">
      <div v-for="tag in availableTags" :key="tag" class="property-form">
        <!-- <ren-input v-model="tag.value" :text-label="tag.key" />
        <Button v-tooltip="$t('view.view_data')" icon="pi pi-chart-line" class="p-button-rounded" @click="manageTags()" /> -->

        <ren-input-wrapper :text-label="tag">
          <template #content>
            <Dropdown :id="`${tag}_value`" v-model="tags[tag]" show-clear :options="availableTagsValues[tag]" :placeholder="$t('view.no_tag')" />
          </template>
        </ren-input-wrapper>
      </div>
    </div>
    <!-- {{ tags }} -->
    <ren-submit @submit="submit" />

    <div class="flex justify-content-between flex-wrap">
      <div class="flex justify-content-start">
        <Button :label="$t('view.button.add_new_tag')" icon="pi pi-plus-circle" @click="addTagForm()" />
      </div>
      <div class="flex justify-content-end">
        <Button :label="$t('view.button.manage_tags')" icon="pi pi-list" @click="manageTags()" />
      </div>
    </div>
    <!-- <Button @click="submit">Submit</Button> -->
  </Dialog>
  <Dialog v-model:visible="newTagDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <!-- {{ availableTags }}
    {{ availableTagsValues }} -->
    <tag-form :tags="availableTags" @update:model-value="onTagSave" @cancel="tagCancel" />
  </Dialog>
  <Dialog v-model:visible="tagListDialog" :style="{ width: '75vw', height: '90vh' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <!-- {{ availableTags }}
    {{ availableTagsValues }} -->
    <TagManagement @on-delete="tagOnDelete" @on-create="onNewTag" />
  </Dialog>
</template>

<script>
import TagForm from "./TagForm.vue";
import TagManagement from "./TagManagement.vue";
export default {
  name: "MeasurementTags",
  components: { TagForm, TagManagement },
  props: { measurement: { type: Object, default: () => ({}) } },
  emits: ["update", "submit"],
  data() {
    return {
      tags: {},
      measurementTagsDialog: false,
      tagListDialog: false,
      newTagDialog: false,
      availableTags: null,
      availableTagsValues: null,
      updateKey: true,
    };
  },
  computed: {},
  watch: {
    // measurement: {
    //   // handler: function (newVal) {
    //   //   this.$emit("update", newVal);
    //   // },
    //   // deep: true,
    // },
  },
  async mounted() {
    await this.loadTags();
  },

  methods: {
    async loadTags() {
      var tags = await this.$ren.managementApi.listTags(this.measurement.id);
      var availableTagsValues = {};
      var availableTags = [];
      for (let t of tags) {
        if (availableTagsValues[t.key]) {
          availableTagsValues[t.key].push(t.value);
        } else {
          availableTagsValues[t.key] = [];
          availableTags.push(t.key);
          availableTagsValues[t.key].push(t.value);
        }
      }
      this.availableTags = availableTags;
      this.availableTagsValues = availableTagsValues;
    },
    manageTags() {
      this.tagListDialog = true;
    },
    async tagOnDelete() {
      await this.loadTags();
    },
    addTagForm() {
      this.newTagDialog = true;
    },
    async onTagSave(evt) {
      let newTag = await this.$ren.managementApi.createNewTag(evt);
      this.onNewTag(newTag);
    },
    onNewTag(newTag) {
      let tKey = newTag.key;
      let tValue = newTag.value;
      this.newTagDialog = false;
      if (this.availableTagsValues[tKey]) {
        this.availableTagsValues[tKey].push(tValue);
      } else {
        this.availableTagsValues[tKey] = [];
        this.availableTags.push(tKey);
        this.availableTagsValues[tKey].push(tValue);
      }
      this.updateKey = !this.updateKey;
    },

    tagCancel() {
      this.newTagDialog = false;
    },
    async open() {
      let tags = await this.$ren.managementApi.getMeasurementTags(this.measurement.id);
      let mTags = {};
      for (let t of tags) {
        mTags[t.key] = t.value;
      }
      this.tags = mTags;
      this.measurementTagsDialog = true;
    },
    async submit() {
      //TODO: yes no
      console.info(this.measurement);
      let tags = {};
      for (let tagKey in this.tags) {
        if (this.tags[tagKey] != null) {
          tags[tagKey] = this.tags[tagKey];
        }
      }
      console.info(tags);
      // odfiltrować puste tagi
      // TODO;
      await this.$ren.managementApi.updateMeasurementTags(this.measurement, tags);

      this.$emit("update", this.tags);

      this.measurementTagsDialog = false;
    },
  },
};
</script>
<style scoped lang="scss"></style>
