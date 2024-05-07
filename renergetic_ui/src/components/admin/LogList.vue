<template>
  <DataTable
    v-model:expandedRows="expanded"
    lazy
    v-model:filters="filters"
    :value="logs.data"
    data-key="id"
    filterDisplay="menu"
    :globalFilterFields="['severity', 'service', 'timestamp']"
    @filter="onFilter"
  >
    <template #header>
      <div class="flex flex-wrap align-items-center justify-content-end gap-2">
        <Button icon="pi pi-refresh" rounded raised @click="refresh" />
      </div>
    </template>
    <Column :expander="true" header-style="width: 3rem" />
    <Column field="timestamp" header="TimeStamp" :showFilterMatchModes="false" filterField="timestamp" dataType="date">
      <template #filter="{ filterModel }">
        <h4>From</h4>
        <Calendar v-model="filterModel.valueFrom" showTime hourFormat="24" dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" mask="99/99/9999 99:99" />
        <h4>Until</h4>
        <Calendar v-model="filterModel.valueTo" showTime hourFormat="24" dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" mask="99/99/9999 99:99" />
        <!-- <Calendar v-model="filterModel.value" showTime hourFormat="24" dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" mask="99/99/9999 99:99" /> -->
      </template>
    </Column>
    <Column field="severity" header="Severity" :showFilterMatchModes="false" filterField="severity">
      <template #filter="{ filterModel }">
        <MultiSelect v-model="filterModel.value" :options="severities" optionLabel="label" placeholder="Any" class="p-column-filter"></MultiSelect>
      </template>
    </Column>
    <Column field="service" header="Service" :showFilterMatchModes="false" filterField="service">
      <template #filter="{ filterModel }">
        <MultiSelect v-model="filterModel.value" :options="services" optionLabel="label" placeholder="Any" class="p-column-filter"></MultiSelect>
      </template>
    </Column>
    <Column field="title" header="Title">
      <template #body="slotProps">
        <span>{{ truncateText(slotProps.data.title, 50) }}</span>
      </template>
    </Column>
    <Column field="description" header="Description">
      <template #body="slotProps">
        <span>{{ truncateText(slotProps.data.description, 50) }}</span>
      </template>
    </Column>
    <template #expansion="data">
      <h3>{{ data.data.title }}</h3>
      <div>{{ data.data.description }}</div>
    </template>
    <template #footer>
      <RenPaginator :total-records="logs.total" @update="(e) => $emit('update:pagination', e)" @created="(e) => $emit('update:pagination', e)" />
    </template>
  </DataTable>
</template>

<script>
import MultiSelect from "primevue/multiselect";
import { FilterMatchMode } from "primevue/api";
export default {
  name: "LogList",
  components: {
    MultiSelect,
  },
  props: {
    logs: {
      total: 0,
      data: [],
    },
    severities: [],
    services: [],
    pagination: { type: Object, default: () => {} },
  },
  emits: ["onRefresh", "onFilter", "update:pagination"],
  data() {
    return {
      filters: {
        timestamp: { value: null, valueFrom: null, valueTo: null, matchMode: FilterMatchMode.DATE_IS },
        //timestamp: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        service: { value: null, matchMode: FilterMatchMode.IN },
        severity: { value: null, matchMode: FilterMatchMode.IN },
      },
      expanded: [],
      initDate: false,
    };
  },
  async created() {},
  mounted() {},
  methods: {
    truncateText(str, max) {
      if (str.length <= max) {
        return str;
      }
      return str.slice(0, max) + "...";
    },
    async refresh() {
      this.$emit("onRefresh", this.filters);
    },
    onFilter(ev) {
      console.log("========= onFilter");
      this.filters = ev.filters;

      //This is to overcome the fact that the date input is not used as it should with the datatable filter.
      if (this.initDate) {
        if (this.filters.timestamp.value == null) {
          this.filters.timestamp.valueFrom = null;
          this.filters.timestamp.valueTo = null;
          this.initDate = false;
        }
      }

      if (this.filters.timestamp.valueFrom !== null) {
        this.filters.timestamp.value = this.filters.timestamp.valueFrom;
        this.initDate = true;
      } else if (this.filters.timestamp.valueTo !== null) {
        this.filters.timestamp.value = this.filters.timestamp.valueTo;
        this.initDate = true;
      } else {
        this.filters.timestamp.value = null;
      }
      this.$emit("onFilter", this.filters);
    },
  },
};
</script>

<style lang="scss" scoped></style>
