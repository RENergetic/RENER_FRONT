<template>
  <Card class="ren-page-content">
    <template #content>
      <RenSpinner ref="spinner" :lock="true" style="min-width: 100%">
        <template #content>
          <DataTable v-if="paginatedTagList" :value="paginatedTagList" class="sticky-header">
            <template #header>
              <div class="flex justify-content-end align-content-end">
                <div class="flex align-items-center" style="flex-grow: 0">
                  <InputText v-model="filters['global'].value" :placeholder="$t('view.search')" />
                  <i v-if="filters.state" class="pi pi-filter-slash" :label="$t('view.button.clear_filter')" @click="clearFilter" />
                </div>
              </div>
              <div class="flex justify-content-between"></div>
            </template>
            <Column field="id" :header="$t('model.tag.id')">
              <template #body="item">
                <span> {{ item.data.id }} </span>
              </template>
            </Column>
            <Column v-for="col of columns" :key="col" :field="col" :header="$t('model.tag.' + col)"></Column>
            <Column field="delete" :show-filter-menu="false">
              <template #body="item">
                <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="deleteTag(item.data)" />
              </template>
            </Column>
          </DataTable>
          <ren-paginator
            v-if="mTagList"
            v-model:offset="mOffset"
            style="left: 0; bottom: 5rem"
            sticky
            :current-rows="paginatedTagList.length"
            :limit="limit"
            @update="onPagination"
          />

          <Toolbar class="ren-toolbar ren-sticky bottom">
            <template #end>
              <Button :label="$t('view.button.add_new_tag')" icon="pi pi-plus-circle" @click="newTagDialog = true" />
            </template>
            <template #start> </template>
          </Toolbar>
        </template>
      </RenSpinner>
    </template>
  </Card>
  <!-- <Column field="edit" :header="$t('view.edit')"> <template #body>todo:</template></Column> -->

  <Dialog v-model:visible="newTagDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <tag-form :tags="availableTags" @update:model-value="onNewTag" @cancel="tagCancel" />
  </Dialog>
</template>

<script>
import TagForm from "./TagForm.vue";
const PAGE_SIZE = 10;
export default {
  name: "TagManagement",
  components: { TagForm },
  props: {},
  emits: ["onDelete", "onCreate"],
  data() {
    return {
      newTagDialog: false,
      tagList: [],
      mTagList: [],
      paginatedTagList: this.tagList ? this.tagList.slice(0, PAGE_SIZE) : [],
      limit: PAGE_SIZE,
      mOffset: 0,
      columns: ["key", "value"],
      selectedRow: null,
      availableTags: null,
      availableTagsValues: null,
      filters: this.initFilter(),
      // measurementEditDialog: false,
      // measurementDetailsDialog: false,
    };
  },
  computed: {},
  watch: {
    filters: {
      handler: function (v) {
        if (v != null && v.global != null && v.global.value) {
          v.state = true;
          this.filter();
        } else {
          v.state = false;
          this.mOffset = 0;
          this.onPagination();
        }
      },
      deep: true,
    },
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    onPagination() {
      this.paginatedTagList = this.mTagList.slice(this.mOffset, this.mOffset + PAGE_SIZE);
    },
    async deleteTag(tag) {
      await this.$refs.spinner.run(async () => {
        await this.$ren.managementApi.deleteTag(tag).then(async (res) => {
          if (res) {
            this.$emitter.emit("information", { message: this.$t("information.tag_deleted") });
            await this.loadData();
            this.$emit("onDelete", tag);
          }
        });
      });
    },
    async loadData() {
      this.tagList = await this.$ren.managementApi.listTags();
      this.mTagList = this.tagList;
      this.paginatedTagList = this.mTagList.slice(this.mOffset, this.mOffset + PAGE_SIZE);
      var availableTagsValues = {};
      var availableTags = [];
      for (let t of this.mTagList) {
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
    filter() {
      if (!this.filters.state) {
        this.onPagination();
        return;
      }
      let q = this.filters.global.value;
      function f(d) {
        return d.key.toLowerCase().includes(q) || d.value.includes(q);
      }
      this.mTagList = this.tagList.filter(f);
      this.mOffset = 0;
      this.onPagination();
    },
    clearFilter() {
      this.mOffset = 0;
      this.paginatedTagList = this.tagList.slice(this.mOffset, this.mOffset + PAGE_SIZE);
      this.filters = this.initFilter();
      this.mTagList = this.tagList;
    },
    initFilter() {
      return {
        state: false,
        global: { value: null }, //, matchMode: FilterMatchMode.CONTAINS
      };
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
