<template>
  <Card v-if="mModel">
    <template #content>
      <div class="ren">
        <ren-input v-model="mModel.run_id" :text-label="'model.workflowrun.run_id'" :read-only="true" />
        <ren-input v-model="mModel.start_time" :text-label="'model.workflowrun.start_time'" :read-only="true" />
        <ren-input v-model="mModel.end_time" :text-label="'model.workflowrun.end_time'" :read-only="true" />
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

        todo: stop button
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
    return { mModel: this.workflowRun };
  },
  computed: {},

  methods: {},
};
</script>
<style scoped lang="scss"></style>
