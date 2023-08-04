<template>
  <Card class="col-12" style="width: 90%; margin: auto; margin-top: 1rem">
    <template #content>
      <RenSpinner ref="spinner" :lock="true" style="margin: auto; max-width: 80rem">
        <!--  max-width: 80vw -->
        <template #content>
          <asset-list v-model:filters="filters" :asset-list="assetList" @reload="loadAssets" />
        </template>
      </RenSpinner>
    </template>
  </Card>
</template>
<script>
import AssetList from "@/components/management/infrastructure/AssetList.vue";
var PAGE_SIZE = 10;
export default {
  name: "AssetListView",
  components: {
    AssetList,
  },
  data() {
    return {
      assetAdd: false,
      assetList: [],
      columns: [],
      selectedRow: null,
      childDialog: false,
      measurementDialog: false,
      filters: null,
    };
  },
  watch: {
    // page: function () {
    //   //TODO pass newval ?
    //   this.loadAssets();
    // },
    filters: function () {
      //TODO pass newval ?
      this.loadAssets();
    },
  },
  mounted() {
    this.loadAssets();
  },
  methods: {
    async loadAssets(evt) {
      let offset = 0;
      let limit = PAGE_SIZE;
      if (evt) {
        offset = evt.offset;
        limit = evt.limit;
      }
      //TODO: tomek will manage filtering feature with api
      let params = null;
      if (this.filters)
        params = {
          label: this.filters.label.value,
          name: this.filters.name.value,
          type: this.filters["type.label"] && this.filters["type.label"].value ? this.filters["type.label"].value.name : null,
          category: this.filters["category.label"] && this.filters["category.label"].value ? this.filters["category.label"].value.name : null,
        };
      // console.error(params);
      await this.$refs.spinner.run(async () => {
        this.assetList = await this.$ren.managementApi.listAsset(params, offset, limit);
      });
    },
    // async deleteUser(user) {
    //   await this.$refs.spinner.run(async () => {
    //     await this.$ren.userApi.deleteUser(user.id);
    //   });
    //   await this.loadUsers();
    // },
    // confirmDeleteUser(user) {
    //   this.$confirm.require({
    //     message: this.$t("view.user_delete_confirm", {
    //       user: user,
    //       username: user.username,
    //     }),
    //     header: this.$t("view.user_delete"),
    //     icon: "pi pi-exclamation-triangle",
    //     accept: () => this.deleteUser(user),
    //     reject: () => this.$confirm.close(),
    //   });
    // },
  },
};
</script>

<style lang="scss"></style>
