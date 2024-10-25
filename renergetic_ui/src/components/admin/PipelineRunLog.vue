<template>
  <Card>
    <template #content>
      <RenSpinner ref="renspinner" :lock="true" style="width: 100%">
        <template #content>
          <DataTable v-if="runLogList" :lazy="true" data-key="run_id" :value="runLogList" class="sticky-header">
            <Column field="run_id" :header="$t('model.workflowrun.run_id')" />

            <Column field="pipeline" :header="$t('model.workflowrun.pipeline')">
              <template #body="slotProps">
                {{ slotProps.data.pipeline.pipeline_id }}
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
            <Column>
              <template #body="slotProps">
                <i class="pi pi-chevron-circle-right" @click="showRunDetails(slotProps.data)" />
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
import WorkflowRunDetails from "./WorkflowRunDetails.vue";
export default {
  name: "PipelineRunLog",
  components: { WorkflowRunDetails },
  props: {
    workflow: { type: Object, default: null },
  },
  emits: ["onStop"],
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
