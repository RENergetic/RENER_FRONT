<template>
  <!-- <DataTable v-model:selection="selectedRoles" :value="renRoles" table-style="min-width: 50rem" @selection="onRoleSelect">
    <Column selection-mode="multiple" header-style="width: 3rem"></Column>
    <Column header="role">
      <template #body="slotProps"> {{ slotProps.data }}</template></Column
    >
  </DataTable> -->
  <MultiSelect
    v-model="selectedRoles"
    style="max-width: 30rem"
    display="chip"
    :options="renRoles"
    :placeholder="$t('view.select_role')"
    :max-selected-labels="3"
    @change="onRoleSelect"
  >
    <template #option="slotProps">
      {{ $t("enums.role." + slotProps.option) }}
    </template>
    <template #chip="slotProps">
      {{ $t("enums.role." + slotProps.value) }}
    </template>
  </MultiSelect>
  <Dialog v-model:visible="roleMatrixDialog" :style="{ width: '95vw', height: '95vh' }" :modal="true" :dismissable-mask="true">
    <RoleMatrix />
  </Dialog>
</template>

<script>
import { RenRolesStr } from "@/plugins/model/Enums";
import RoleMatrix from "@/components/miscellaneous/settings/RoleMatrix.vue";
//TODO: emit update
export default {
  name: "UserRoleForm",
  components: { RoleMatrix },
  props: {},
  emits: ["update:modelValue"],
  data() {
    return {
      renRoles: RenRolesStr.values(),

      selectedRoles: [],
      roleMatrixDialog: false,
    };
  },
  async mounted() {},
  methods: {
    async reloadRoles() {},
    onRoleSelect(evt) {
      // console.info(evt.value);

      this.$emit("update:modelValue", evt.value);
    },
    confirmAdd() {
      this.$confirm.require({
        message: this.$t("view.user_role_add_confirm", {
          role: this.selectedRole,
          username: this.mUser.username,
        }),
        header: this.$t("view.user_role_add"),
        icon: "pi pi-exclamation-triangle",
        accept: () => this.addRole(this.selectedRole),
        reject: () => this.$confirm.close(),
      });
    },
  },
};
</script>
