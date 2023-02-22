<template>
  <Card>
    <template #title>
      <span v-if="user"> {{ $t("view.edit_user") }}</span>
      <span v-else> {{ $t("view.add_user") }}</span>
    </template>
    <template #content>
      <div class="ren">
        <!-- {{ $store.getters["view/dashboardUnits"] }} -->
        <!-- {{ mDashboard }} -->
        <div class="field grid">
          <label for="username" class="col-12 mb-2 md:col-2 md:mb-0"> {{ $t("model.user.username") }} </label>
          <div class="col-12 md:col-10"><InputText id="username" v-model="mUser.username" :aria-disabled="user" /></div>
          <span v-if="v$.mUser.username.$invalid">
            <span v-for="(error, index) of v$.mUser.username.$silentErrors" id="name-error" :key="index">
              <small class="p-error">{{ error.$message }}</small>
            </span>
          </span>
        </div>
        <!-- firstName -->
        <div class="field grid">
          <label for="firstName" class="col-12 mb-2 md:col-2 md:mb-0"> {{ $t("model.user.firstName") }} </label>
          <div class="col-12 md:col-10"><InputText id="firstName" v-model="mUser.firstName" /></div>
          <span v-if="v$.mUser.firstName.$invalid">
            <span v-for="(error, index) of v$.mUser.firstName.$silentErrors" id="name-error" :key="index">
              <small class="p-error">{{ error.$message }}</small>
            </span>
          </span>
        </div>
        <!-- lastName -->
        <div class="field grid">
          <label for="lastName" class="col-12 mb-2 md:col-2 md:mb-0"> {{ $t("model.user.firstName") }} </label>
          <div class="col-12 md:col-10"><InputText id="lastName" v-model="mUser.lastName" /></div>
          <span v-if="v$.mUser.lastName.$invalid">
            <span v-for="(error, index) of v$.mUser.lastName.$silentErrors" id="name-error" :key="index">
              <small class="p-error">{{ error.$message }}</small>
            </span>
          </span>
        </div>
        <!-- email -->
        <div class="field grid">
          <label for="email" class="col-12 mb-2 md:col-2 md:mb-0"> {{ $t("model.user.firstName") }} </label>
          <div class="col-12 md:col-10"><InputText id="email" v-model="mUser.email" :aria-disabled="user" /></div>
          <span v-if="v$.mUser.email.$invalid">
            <span v-for="(error, index) of v$.mUser.email.$silentErrors" id="name-error" :key="index">
              <small class="p-error">{{ error.$message }}</small>
            </span>
          </span>
        </div>

        <!-- password -->
        <div class="field grid">
          <label for="password" class="col-12 mb-2 md:col-2 md:mb-0"> {{ $t("model.user.firstName") }} </label>
          <div class="col-12 md:col-10"><InputText id="password" v-model="mUser.password" /></div>
          <span v-if="v$.mUser.password.$invalid">
            <span v-for="(error, index) of v$.mUser.password.$silentErrors" id="name-error" :key="index">
              <small class="p-error">{{ error.$message }}</small>
            </span>
          </span>
        </div>

        <div class="field grid">
          <Button :disabled="v$.$invalid" :label="$t('view.button.submit')" @click="submit" />
          <!-- <Button :label="$t('view.button.cancel')" @click="cancel" /> -->
        </div>
      </div>
    </template>
  </Card>
</template>
<script>
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, email, maxLength } from "@/plugins/validators.js";
export default {
  name: "UserForm",
  components: {},
  props: {
    user: {
      type: Object,
      default: null,
    },
  },
  emits: ["update:modelValue", "save", "cancel"],
  setup: () => ({ v$: useVuelidate() }),
  data() {
    //TODO: copy dashboard object to mDashboard - otherwise we modife element  from the list and it hhas to be refreshed
    let mUser = this.user ? this.user : {};

    return {
      mDashboard: mUser,
    };
  },
  validationConfig: {
    $lazy: true,
  },
  validations() {
    return {
      mDashboard: {
        username: {
          required,
          minLength: minLength(5),
          maxLength: maxLength(50),
        },
        email: {
          required,
          email,
          // uri: or(url, ipAddress),
        },
        password: {
          //TODO: password
          required,
          minLength: minLength(7),
          maxLength: maxLength(20),
        },
        firstname: { minLength: minLength(3), maxLength: maxLength(20) },
        lastname: { minLength: minLength(3), maxLength: maxLength(20) },
      },
    };
  },
  watch: {
    mUser: {
      handler(newVal, oldValue) {
        if (oldValue == null && newVal == null) {
          return;
        }
        this.$emit("update:modelValue", newVal);
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {},

  methods: {
    clear() {
      this.mUser = {};
    },
    async submit() {
      this.$emit("save", this.mUser);
    },
  },
};
</script>

<style lang="scss"></style>
