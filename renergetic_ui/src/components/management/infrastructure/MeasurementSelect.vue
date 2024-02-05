<template>
  <Dialog v-model:visible="measurementDialog" :style="{ minWidth: '20rem' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <Card>
      <template #title> {{ $t("view.add_measurement") }} </template>
      <template #content>
        <div class="field grid">
          <AutoComplete
            v-model="selectedMeasurement"
            style="width: 100%"
            :placeholder="$t('view.find_measurement')"
            :suggestions="measurementList"
            field="name"
            @complete="searchMeasurement($event)"
          >
            <template #option="slotProps">
              <div>
                {{
                  slotProps.option.label
                    ? `${slotProps.option.label} (${slotProps.option.name}) - ${slotProps.option.domain}`
                    : `${slotProps.option.name} - ${slotProps.option.domain}`
                }}
              </div>
            </template>
          </AutoComplete>
        </div>
        <div class="field grid">
          <div class="col">
            <Button :label="$t('view.button.submit')" :disabled="selectedMeasurement == null || !selectedMeasurement.name" @click="submit" />
          </div>
          <div class="col">
            <Button :label="$t('view.button.cancel')" @click="cancel" />
          </div>
        </div>
      </template>
    </Card>
  </Dialog>
</template>
<script>
export default {
  name: "MeasurementSelect",
  components: {},
  props: { current: { type: Object, default: () => null }, assetId: { type: Number, default: null } },
  emits: ["select", "update:modelValue"],
  data() {
    return {
      measurementList: [],
      selectedMeasurement: null,
      measurementDialog: false,
    };
  },
  async mounted() {},
  methods: {
    // onChange(option) {},
    submit() {
      if (this.selectedMeasurement) {
        this.$emit("select", this.selectedMeasurement);
        this.$emit("update:modelValue", this.selectedMeasurement);
        this.measurementDialog = false;
      }
    },
    async searchMeasurement(event) {
      let q = event.query.trim();
      if (q.length > 0)
        await this.$ren.managementApi.searchMeasurement(q, this.assetId).then((measurementList) => {
          this.measurementList = measurementList;
        });
      else {
        await this.$ren.managementApi.listMeasurement().then((measurementList) => {
          this.measurementList = measurementList;
        });
      }
    },
    async open(current = null) {
      this.measurementDialog = true;
      this.selectedMeasurement = current;
    },
    cancel() {
      this.measurementDialog = false;
    },
  },
};
</script>

<style lang="scss"></style>
