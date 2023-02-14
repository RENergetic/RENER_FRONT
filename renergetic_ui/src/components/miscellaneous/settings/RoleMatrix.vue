<template>
  <DataTable id="role-matrix" :value="roles">
    <Column :header="$t('view.role_name')">
      <template #body="row">
        {{ $t("enums.role." + row.data) }}
      </template>
    </Column>
    <Column
      v-for="feature of headers"
      :key="feature"
      :field="feature"
      :name="feature"
      :header="$t('enums.role_features.' + feature)"
    >
      <template #body="row">
        <div :class="`cell-state-${featureState(row.data, feature)}`">
          <span v-if="featureState(row.data, feature) != 0">X</span>
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<script>
import { RenFeatures } from "@/plugins/model/Enums";
import RoleMatrix from "@/plugins/model/role_matrix.js";

export default {
  name: "RoleMatrix",
  components: {},
  props: {},
  data() {
    return {
      headers: [...RenFeatures.values()],
      roles: [...RoleMatrix.keys()],
      roleMatrix: RoleMatrix,

      schema: {},
    };
  },
  computed: {},
  async mounted() {},
  methods: {
    featureState(role, feature) {
      try {
        return this.roleMatrix.get(role).get(feature);
      } catch (Exception) {
        return 0;
      }
    },
  },
};
</script>
<style lang="scss">
.cell-state-1 {
  background-color: $ren-state-color-ok;
  color: $secondary-font-color;
  display: flex;
  height: 100%;
}

.cell-state-0 {
  background-color: $secondary-color;
  color: $secondary-color;
  display: flex;
  height: 100%;
}
.cell-state-null {
  background-color: gray; // $ren-state-color-unknown;;
  color: $secondary-font-color;
  display: flex;
  height: 100%;
}

.p-datatable-tbody td > div > span {
  margin: auto;
}
#role-matrix.p-datatable .p-datatable-tbody > tr > td {
  padding: 0;
  height: 5rem;
  width: 5rem;
}
#role-matrix.p-datatable .p-datatable-tbody > tr > td:first-child {
  height: 5rem;
  width: 5rem;
  padding: 1rem 1rem;
}
</style>
