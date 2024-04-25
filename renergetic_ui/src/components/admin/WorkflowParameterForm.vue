<template>
  <!-- <InfoIcon :show-icon="false">
    <template #content> 
    </template>
  </InfoIcon> -->

  <Card v-if="mModel">
    <!-- <template #title> </template> -->
    <template #content>
      <!-- {{ mModel }}  -->
      <div class="ren">
        <ren-input v-model="mModel.key" :text-label="'model.workflow_parameter.key'" :read-only="true" />
        <ren-input
          v-model="mModel.label"
          :text-info="'model.label_description'"
          :text-label="'model.workflow_parameter.label'"
          :invalid="v$.mModel.label.$invalid"
          :errors="v$.mModel.label.$silentErrors"
        />
        <ren-input
          v-model="mModel.description"
          :text-info="'model.description'"
          :text-label="'model.workflow_parameter.description'"
          :invalid="v$.mModel.description.$invalid"
          :errors="v$.mModel.description.$silentErrors"
        />
        <ren-input-wrapper :text-label="'model.workflow_parameter.type'" :invalid="v$.mModel.type.$invalid" :errors="v$.mModel.type.$silentErrors">
          <template #content>
            <Dropdown
              id="workflowParameterType"
              v-model="mModel.type"
              :options="types"
              :option-label="(opt) => $t('settings.input_types.' + opt)"
              :placeholder="$t('view.select_workflow_parameter_type')"
            />
          </template>
        </ren-input-wrapper>

        <ren-input v-model="mModel.defaultValue" :text-label="'model.workflow_parameter.defaultValue'" />
      </div>
    </template>
  </Card>
  <ren-submit :cancel-button="true" :disabled="v$.$invalid" @cancel="cancel" @submit="submit" />
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength } from "@/plugins/validators.js"; //,requiredTr, maxLengthTr

export default {
  name: "WorkflowParameterForm",
  components: {},
  props: {
    modelValue: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["update:modelValue", "cancel", "update"],
  setup: () => ({ v$: useVuelidate() }),
  validationConfig: {
    $lazy: true,
  },
  data() {
    return {
      mModel: this.modelValue,
      types: ["boolean", "number", "array", "datetime", "string"],
    };
  },
  computed: {},
  watch: {},
  validations() {
    return {
      mModel: {
        label: {
          minLength: minLength(3),
          maxLength: maxLength(100),
        },
        description: {
          minLength: minLength(3),
          maxLength: maxLength(250),
        },
        type: { required },
      },
    };
  },
  methods: {
    submit() {
      this.$emit("update:modelValue", this.mModel);
      this.$emit("update", this.mModel);
    },
    cancel() {
      this.$emit("update:modelValue", this.modelValue);
      this.$emit("cancel", this.mModel);
    },
  },
};
</script>
