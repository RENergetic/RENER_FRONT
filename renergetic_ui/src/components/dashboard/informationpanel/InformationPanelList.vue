<template>
  <!-- <RenSpinner ref="spinner1"></RenSpinner> -->
  <div class="grid">
    <div class="col-8">
      <RenSpinner ref="spinner" :lock="true">
        <template #content>
          <Card>
            <template #title> {{ $t("view.information_panel_list") }} </template>
            <template #content>
              <DataTable :value="panelList">
                <Column v-for="h of headers" :key="h" :field="h" :header="$t('model.information_panel.' + h)"></Column>
                <Column field="link">
                  <template #body="item">
                    <i class="pi pi-chevron-circle-right" style="fontsize: 2rem" @click="view(item.data)" />
                  </template>
                </Column>
              </DataTable>
            </template>
          </Card>
        </template>
      </RenSpinner>
    </div>
  </div>
</template>
<script>
export default {
  name: "InformationPanelList",
  components: {},
  data() {
    return {
      panelList: [],
      headers: [],
      selectedArea: null,
    };
  },
  async mounted() {
    //todo: add some filters
    this.$refs.spinner.run(async () => {
      await this.$ren.dashboardApi.listInformationPanel().then((list) => {
        this.panelList = list;
        if (list.length > 0) {
          this.headers = Object.keys(list[0]).filter((it) => it != "tiles");
        } else {
          this.headers = [];
        }
      });
    });
  },
  methods: {
    view(selected) {
      let to = `/panel/view/${selected.id}`;
      this.$router.push(to);
    },
  },
};
</script>

<style lang="scss">
// i.pi {
//   margin-left: 0.25rem;
// }
// .flex > div {
//   flex-grow: 1;
// }
</style>
