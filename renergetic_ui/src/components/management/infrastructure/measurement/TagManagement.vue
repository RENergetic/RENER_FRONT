<template>
  <InfoIcon :show-icon="false">
    <template #content>
      <!-- some info -->
    </template>
  </InfoIcon>
  <RenSpinner ref="spinner" :lock="true" style="margin: auto; max-width: 100%; width: 100%">
    <template #content>
      <Card>
        <template #content>
          <Button :label="$t('view.button.add_new_tag')" icon="pi pi-plus-circle" @click="newTagDialog = true" />
          <DataTable :value="tagList" paginator :rows="15">
            <Column field="id" :header="$t('model.measurement_type.id')">
              <template #body="item">
                <span> ({{ item.data.id }}) {{ item.data.label ? `${item.data.label} (${item.data.name})` : item.data.name }}</span>
              </template>
            </Column>
            <Column v-for="col of columns" :key="col" :field="col" :header="$t('model.tag.' + col)"></Column>

            <Column field="delete" :show-filter-menu="false">
              <template #body="item">
                <!-- {{ item.data }} -->
                <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="deleteTag(item.data)" />
              </template>
            </Column>
            <!-- <Column field="edit" :header="$t('view.edit')"> <template #body>todo:</template></Column> -->
          </DataTable>
        </template>
      </Card>
    </template>
  </RenSpinner>
  <Dialog v-model:visible="newTagDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <!-- {{ availableTags }}
    {{ availableTagsValues }} -->
    <tag-form :tags="availableTags" @update:model-value="onNewTag" @cancel="tagCancel" />
  </Dialog>
</template>

<script>
import InfoIcon from "../../../miscellaneous/InfoIcon.vue";
import TagForm from "./TagForm.vue";
export default {
  name: "TagManagement",
  components: { InfoIcon, TagForm },
  props: {},
  emits: ["onDelete", "onCreate"],
  data() {
    return {
      newTagDialog: false,
      tagList: [],
      columns: ["key", "value"],
      selectedRow: null,
      availableTags: null,
      availableTagsValues: null,
      // measurementEditDialog: false,
      // measurementDetailsDialog: false,
    };
  },
  computed: {},
  watch: {},
  async mounted() {
    await this.loadData();
  },
  methods: {
    async deleteTag(tag) {
      await this.$refs.spinner.run(async () => {
        await this.$ren.managementApi.deleteTag(tag).then(async (res) => {
          if (res) {
            this.$emitter.emit("information", { message: this.$t("information.tag_deleted") });
            await this.loadData();
            this.$emit("onDelete", tag);
          }
          // else {          }
          // if (res ) {
          //   this.$emitter.emit("information", { message: this.$t("information.visibility_changed") });
          //
          // } else this.$emitter.emit("error", { message: this.$t("information.visibility_changed") });
        });
      });
      // console.info(selectedPanel);
      // console.info(state);
    },
    async loadData() {
      this.tagList = await this.$ren.managementApi.listTags();
      var availableTagsValues = {};
      var availableTags = [];
      for (let t of this.tagList) {
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
    async onNewTag(evt) {
      let newTag = await this.$ren.managementApi.createNewTag(evt);
      this.$emit("onCreate", newTag);
      this.newTagDialog = false;
      await this.loadData();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
