<template>
  <Panel :header="$t('view.current_request')" toggleable>
    <InfoIcon :show-icon="true">
      <template #content>
        <HDRRequestForm v-if="currentRequest" v-model="currentRequest" :disabled="true" />
        <span v-else> {{ $t("view.current_request_null") }}</span>
      </template>
    </InfoIcon>
    <Card v-if="currentRequest" :key="currentRequest" class="ren">
      <template #content>
        <ren-input-wrapper :text-label="'model.hdrrequest.date_from'">
          <template #content> <Calendar v-model="currentRequest.dateFrom" :disabled="true" :show-time="true" /> </template>
        </ren-input-wrapper>
        <ren-input-wrapper :text-label="'model.hdrrequest.date_to'">
          <template #content> <Calendar v-model="currentRequest.dateTo" :disabled="true" :show-time="true" /> </template>
        </ren-input-wrapper>
        <ren-input v-model="currentRequest.msg" :disabled="true" />
      </template>
    </Card>
    <span v-else> {{ $t("view.current_request_null") }}</span>

    <!-- {{ currentRequest }} -->
    <Button :label="$t('view.button.set_hdr')" @click="hdrRequestDialog = true" />
    <Button :label="$t('view.button.hdr_settings')" @click="hdrSettingsDialog = true" />
  </Panel>
  <Panel :header="$t('view.select_base_recommendation')" toggleable>
    <Dropdown
      v-model="selectedCompareWith"
      style="width: 100%"
      show-clear
      :options="recommendationList"
      option-label="tag.value"
      :placeholder="$t('view.base_recommendation')"
    />
  </Panel>
  <Panel :header="$t('view.recommendation_list')" toggleable>
    <Listbox v-if="recommendationList" v-model="selectedRecommendation" :options="recommendationList" style="width: 100%">
      <template #option="slotProps">
        <div class="flex align-items-center">
          <i class="pi pi-chevron-right" style="font-size: 1rem" /> {{ slotProps.option.tag.value }}({{ slotProps.option.id }})
        </div>
      </template>
    </Listbox>
  </Panel>
  <Dialog v-model:visible="hdrRequestDialog" :style="{ width: '50vw' }" :maximizable="false" :modal="true" :dismissable-mask="true">
    <HDRRequestForm @update="onHDR" @cancel="hdrRequestDialog = false" />
  </Dialog>
  <Dialog v-model:visible="hdrSettingsDialog" :style="{ width: '50vw' }" :maximizable="false" :modal="true" :dismissable-mask="true">
    <HDRSettings @update="onHDR" @cancel="hdrSettingsDialog = false" />
  </Dialog>
</template>
<script>
import HDRRequestForm from "@/components/management/demand/HDRRequestForm.vue";
import HDRSettings from "@/components/management/demand/HDRSettings.vue";
import InfoIcon from "@/components/miscellaneous/InfoIcon.vue";
export default {
  name: "HDRRecomendationList",
  components: { HDRRequestForm, HDRSettings, InfoIcon },
  props: {
    modelValue: {
      type: Object,
      default: null,
    },
    hdrRequest: {
      type: Object,
      default: null,
    },
    comparewith: {
      type: Object,
      default: null,
    },

    recommendationList: { type: Array, default: () => [] },
  },
  emits: ["update:modelValue", "select", "update:comparewith", "update:hdrRequest"], //"reload",
  data() {
    return {
      currentRequest: this.hdrRequest,
      hdrRequestDialog: false,
      hdrSettingsDialog: false,
      selectedRecommendation: this.modelValue,
      selectedCompareWith: this.comparewith ? this.comparewith : this.recommendationList ? this.recommendationList[0] : null,
    };
  },
  watch: {
    selectedRecommendation: function (value) {
      this.onSelect(value);
    },
    selectedCompareWith: function (value) {
      this.$emit("update:comparewith", value);
    },
    hdrRequest: {
      handler: function (hdrRequest) {
        this.currentRequest = hdrRequest;
      },
      deep: true,
    },
  },
  async mounted() {
    if (this.currentRequest == null) {
      this.currentRequest = await this.getRequest();
      this.$emit("update:hdrRequest", this.currentRequest);
    }
  },
  methods: {
    // reload() {
    //   this.$emit("reload");
    // },
    onSelect(v) {
      this.$emit("select", v);
      this.$emit("update:modelValue", v);
    },
    async onHDR(hdr) {
      //todo:
      // await this.$refs.spinner.run(async () => {
      await this.$ren.hdrApi.setCurrentRequest(hdr).then(async () => {
        this.hdrRequestDialog = false;
        this.currentRequest = await this.getRequest();
        this.$emit("update:hdrRequest", this.currentRequest);
      });
      // });
      // console.error(hdr);
    },
    async getRequest() {
      let requests = await this.$ren.hdrApi.getCurrentRequest();
      let request = null;
      if (requests && requests.length == 1) {
        request = requests[0];
        request.dateFrom = request.date_from ? new Date(request.date_from) : null;
        request.dateTo = request.date_to ? new Date(request.date_to) : null;
        let unitStr = request.value_type.unit ? `[${request.value_type.unit}]` : "";
        if (request.max_value != null) {
          request.msg = this.$t("view.hdr_request_limit", {
            property: this.$t("enums.physical_type." + request.value_type.physical_name),
            value: `${request.max_value} ${unitStr}`,
          });
        } else {
          request.msg = this.$t("view.hdr_request_change", {
            property: this.$t("enums.physical_type." + request.value_type.physical_name),
            value: `${request.value_change} ${unitStr}`,
          });
        }
      }
      return request;
    },
  },
};
</script>

<style lang="scss"></style>
