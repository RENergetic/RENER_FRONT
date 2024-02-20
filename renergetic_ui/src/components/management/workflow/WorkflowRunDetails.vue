<template>
  <Card v-if="mModel">
    <template #content>
      <div class="ren">
        <ren-input v-model="mModel.run_id" :text-label="'model.workflowrun.run_id'" :read-only="true" />
        <ren-input v-model="startTime" :text-label="'model.workflowrun.start_time'" :read-only="true" :disabled="endTime == null" />
        <ren-input v-model="endTime" :text-label="'model.workflowrun.end_time'" :read-only="true" :disabled="endTime == null" />
        <h3 v-if="mModel.parameters">{{ $t("model.workflowrun.parameters") }}</h3>
        <ren-input v-for="key in mModel.parameters" :key="key" v-model="mModel.parameters[key]" :text-label="key" :read-only="true" />

        <!-- <ren-input
          v-model="mModel.name"
          :text-info="'model.name_description'"
          :text-label="'model.asset.name'"
          :invalid="v$.mModel.name.$invalid"
          :errors="v$.mModel.name.$silentErrors"
        />
        <ren-input v-model="mModel.label" :text-info="'model.label_description'" :text-label="'model.asset.label'" />
        <ren-input-wrapper :text-label="'model.asset.asset_type'" :invalid="v$.mModel.type.$invalid" :errors="v$.mModel.type.$silentErrors">
          <template #content>
            <Dropdown
              id="assetType"
              v-model="mModel.type"
              :options="assetTypes"
              option-label="label"
              option-value="value"
              :placeholder="$t('view.select_asset_type')"
            />
          </template>
        </ren-input-wrapper>
 
        <ren-input-wrapper :text-label="'model.asset.owner'">
          <template #content>
            <span v-if="ownerLabel" @click="selectOwner">{{ ownerLabel }}</span>
            <span v-else @click="selectOwner">{{ $t("view.select_owner") }}</span>
          </template>
        </ren-input-wrapper> -->
        <ren-input-wrapper v-if="workflowRun.start_time > 0">
          <template #content>
            <Button v-tooltip="$t('view.stop')" class="ren" icon="pi pi-times" @click="stopConfirm">{{ $t("view.button.stop") }}</Button>
          </template>
        </ren-input-wrapper>
      </div>
    </template>
  </Card>
</template>

<script>
export default {
  name: "WorkflowRunDetails",
  components: {},
  props: { workflowRun: { type: Object, default: () => ({}) } },
  emits: ["update"],
  data() {
    return {
      mModel: this.workflowRun,
      startTime: this.workflowRun ? this.$ren.utils.dateString(this.workflowRun.start_time) : null,
      endTime: this.workflowRun ? this.$ren.utils.dateString(this.workflowRun.end_time) : null,
    };
  },
  computed: {},
  methods: {
    async stop() {
      await this.$ren.kubeflowApi.stopExperiment(this.workflowRun.workflow.experiment_id);
    },
    async stopConfirm() {
      await this.$confirm.require({
        message: this.$t("view.stop_run_confirm_body", {
          label: this.workflowRun.name ? this.workflowRun.name : this.workflowRun.id,
        }),
        header: this.$t("view.stop_run_confirm"),
        icon: "pi pi-exclamation-triangle",
        accept: async () => {
          await this.stop();
        },
        reject: () => {
          this.$confirm.close();
        },
      });
    },
  },
};
</script>
<style scoped lang="scss"></style>
