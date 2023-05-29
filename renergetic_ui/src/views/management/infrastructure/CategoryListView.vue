<template>
  <Card class="col-12" style="width: 90%; margin: auto; margin-top: 1rem">
    <template #content>
      <RenSpinner ref="spinner" :lock="true" style="margin: auto; max-width: 80rem">
        <!--  max-width: 80vw -->
        <template #content>
          <category-list
            :category-list="categoryList"
            @reload="loadCategories"
            @update="updateCategory"
            @create="createCategory"
            @delete="deleteCategory"
          />
        </template>
      </RenSpinner>
    </template>
  </Card>
</template>

<script>
import CategoryList from "@/components/management/infrastructure/CategoryList.vue";

export default {
  name: "CategoryListView",
  components: { CategoryList },
  data() {
    return {
      categoryList: [],
    };
  },
  mounted() {
    this.loadCategories();
  },
  methods: {
    async loadCategories() {
      await this.$refs.spinner.run(async () => {
        this.categoryList = await this.$ren.managementApi.listCategories();
      });
    },
    async updateCategory(category) {
      const index = this.categoryList.findIndex((it) => it.id === category.id);
      this.categoryList[index] = category;
      await this.$ren.managementApi.updateCategory(category);
    },
    async createCategory(category) {
      this.$refs.spinner.start();
      const newCategory = await this.$ren.managementApi.addCategory(category);
      this.categoryList.push(newCategory);
      this.$refs.spinner.stop();
    },
    async deleteCategory(category) {
      const index = this.categoryList.findIndex((it) => it.id === category.id);
      this.categoryList.splice(index, 1);
      await this.$ren.managementApi.deleteCategory(category);
    },
  },
};
</script>

<style scoped></style>
