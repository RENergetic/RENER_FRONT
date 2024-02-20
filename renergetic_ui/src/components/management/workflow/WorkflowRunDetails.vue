<template>
  <Card v-if="workflow">
    <template #content>
      <div class="ren">
        {{ workflow }}
        { "run_id": "run_1708352625187", "workflow": { "pipelines": null, "experiment_id": "experiment_4", "name": null, "parameters": {}, "visible":
        false, "current_run": null }, "parameters": {}, "start_time": 1708352625187, "end_time": null }
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
        <ren-input-wrapper :text-label="'model.asset.parent'">
          <template #content>
            <span v-if="parentLabel" @click="selectAsset">{{ parentLabel }}</span>
            <span v-else @click="selectAsset">{{ $t("view.select_parent_asset") }}</span>
          </template>
        </ren-input-wrapper>
        <ren-input-wrapper :text-label="'model.asset.owner'">
          <template #content>
            <span v-if="ownerLabel" @click="selectOwner">{{ ownerLabel }}</span>
            <span v-else @click="selectOwner">{{ $t("view.select_owner") }}</span>
          </template>
        </ren-input-wrapper> -->
      </div>
    </template>
  </Card>
</template>

<script>
export default {
  name: "WorkflowRunDetails",
  components: {},
  props: { workflow: { type: Object, default: () => ({}) } },
  emits: ["update"],
  data() {
    return {};
  },
  computed: {},

  methods: {},
};
</script>
<style scoped lang="scss"></style>
