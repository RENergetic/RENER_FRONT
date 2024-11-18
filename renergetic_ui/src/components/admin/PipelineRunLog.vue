<template>
  <Card>
    <template #content>
      <RenSpinner ref="renspinner" :lock="true" style="width: 100%">
        <template #content>
          <DataTable v-if="runLogList" :lazy="true" data-key="run_id" :value="runLogList" class="sticky-header">
            <!-- <Column field="run_id" :header="$t('model.workflowrun.run_id')" /> -->

            <Column field="run" :header="$t('model.workflowrun.run_id')">
              <template #body="slotProps">
                <div>
                  <h4>{{ slotProps.data.run_id }}</h4>
                </div>
                <div class="disabled">({{ slotProps.data.pipeline.pipeline_id }})</div>
              </template>
            </Column>

            <Column field="name" :header="$t('model.workflowrun.name')" />

            <Column field="start_time" :header="$t('model.workflowrun.start_time')">
              <template #body="slotProps">
                {{ $ren.utils.dateString(slotProps.data.start_time) }}
              </template>
            </Column>
            <Column field="end_time" :header="$t('model.workflowrun.end_time')">
              <template #body="slotProps">
                {{ $ren.utils.dateString(slotProps.data.end_time) }}
              </template>
            </Column>
            <Column field="state" :header="$t('model.workflowrun.state')">
              <template #body="slotProps">
                {{ slotProps.data.state }}
              </template>
            </Column>
            <Column field="ext" :header="$t('model.workflowrun.ext')">
              <template #body="slotProps">
                <Button :disabled="!slotProps.data.ext" :label="$t('view.copy_clipboard')" @click="toClipboard(slotProps.data.ext)" />
              </template>
            </Column>

            <Column :header="$t('model.workflowrun.details')">
              <Button v-if="slotProps.data.results" :label="$t('view.show_run_details')" @click="showResults(slotProps.data)" />

              <template #body="slotProps"> <i class="pi pi-chevron-circle-right" @click="showRunDetails(slotProps.data)" /> </template>
            </Column>
            <Column field="results" :header="$t('model.workflowrun.results')">
              <template #body="slotProps">
                <Button v-if="slotProps.data.results" :label="$t('view.show_results')" @click="showResults(slotProps.data)" />
                <span v-else>{{ $t("model.workflowrun.no_results") }}</span>
              </template>
            </Column>
          </DataTable>
        </template>
      </RenSpinner>
    </template>
  </Card>
  <Dialog v-model:visible="workflowRunDetailsDialog" :style="{ width: '75vw' }" :maximizable="true" :modal="true" :dismissable-mask="true">
    <WorkflowRunDetails :workflow-run="selectedWorkflowRunDetails" @on-stop="onWorkflowStop" />
  </Dialog>
</template>

<script>
import WorkflowRunDetails from "@/components/admin/workflow/WorkflowRunDetails.vue";
export default {
  name: "PipelineRunLog",
  components: { WorkflowRunDetails },
  props: {
    workflow: { type: Object, default: null },
  },
  emits: ["onStop", "select"],
  data() {
    return {
      runLogList: null,
      selectedWorkflowRunDetails: null,
      workflowRunDetailsDialog: false,
    };
  },
  computed: {},
  watch: {
    workflow: function (v) {
      this.loaddata(v);
    },
  },
  mounted() {
    if (this.workflow) {
      this.loaddata(this.workflow);
    }
  },
  methods: {
    showRunDetails(workflowRun) {
      this.selectedWorkflowRunDetails = workflowRun;
      this.workflowRunDetailsDialog = true;
    },
    showResults(workflowRun) {
      this.$ren.utils.openNewTab(`/management/wasteheat/result/${workflowRun.run_id}`);
    },
    async loaddata(workflow) {
      var last30days = this.$ren.utils.currentTimestamp() - 1000 * 3600 * 24 * 30;
      await this.$refs.renspinner.run(async () => {
        this.runLogList = await this.$ren.kubeflowApi.listRuns({ pipelineId: workflow.pipeline_id, from: last30days });
        this.runlogDialog = true;
      });
    },
  },
};
</script>
<style scoped lang="scss"></style>
