<template>
  <!--  TODO: edit measuremet tpes -->
  <InfoIcon :show-icon="false">
    <template #content>
      <!-- some info -->
    </template>
  </InfoIcon>
  <RenSpinner ref="spinner" :lock="true" style="margin: auto; max-width: 100%; width: 100%">
    <!--  max-width: 80vw -->

    <template #content>
      <Card>
        <template #content>
          <DataTable :value="tagList" paginator :rows="15">
            <!-- <Column field="id" :header="$t('model.measurement_type.id')">
          <template #body="item">
            <span> ({{ item.data.id }}) {{ item.data.label ? `${item.data.label} (${item.data.name})` : item.data.name }}</span>
          </template>
        </Column> -->
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
</template>

<script>
import InfoIcon from "../../../miscellaneous/InfoIcon.vue";
export default {
  name: "TagManagement",
  components: { InfoIcon },
  props: {},
  emits: ["onDelete"],
  data() {
    return {
      // measurementAdd: false,
      tagList: [],
      columns: ["key", "value"],
      selectedRow: null,
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
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
