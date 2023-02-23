<template>
  <Card>
    <template #title>
      <span v-if="user"> {{ $t("view.edit_user", { username: user.username }) }}</span>
      <span v-else> {{ $t("view.add_user") }}</span>
    </template>
    <template #content>
      <div class="ren">
        <!-- {{ mUser }} -->
        <div v-if="!user" class="field grid">
          <label for="username" class="col-12 mb-2 md:col-2 md:mb-0"> {{ $t("model.user.username") }} </label>
          <div class="col-12 md:col-10">
            <InputText id="username" v-model="mUser.username" :disabled="user != null" />
          </div>
          <span v-if="v$.mUser.username.$invalid">
            <span v-for="(error, index) of v$.mUser.username.$silentErrors" id="name-error" :key="index">
              <small class="p-error">{{ error.$message }}</small>
            </span>
          </span>
        </div>
        <!-- firstName -->
        <div class="field grid">
          <label for="firstName" class="col-12 mb-2 md:col-2 md:mb-0"> {{ $t("model.user.firstname") }} </label>
          <div class="col-12 md:col-10"><InputText id="firstName" v-model="mUser.firstName" /></div>
          <span v-if="v$.mUser.firstName.$invalid">
            <span v-for="(error, index) of v$.mUser.firstName.$silentErrors" id="name-error" :key="index">
              <small class="p-error">{{ error.$message }}</small>
            </span>
          </span>
        </div>
        <!-- lastName -->
        <div class="field grid">
          <label for="lastName" class="col-12 mb-2 md:col-2 md:mb-0"> {{ $t("model.user.lastname") }} </label>
          <div class="col-12 md:col-10"><InputText id="lastName" v-model="mUser.lastName" /></div>
          <span v-if="v$.mUser.lastName.$invalid">
            <span v-for="(error, index) of v$.mUser.lastName.$silentErrors" id="name-error" :key="index">
              <small class="p-error">{{ error.$message }}</small>
            </span>
          </span>
        </div>
        <!-- email -->
        <div class="field grid">
          <label for="email" class="col-12 mb-2 md:col-2 md:mb-0"> {{ $t("model.user.email") }} </label>
          <div class="col-12 md:col-10">
            <InputText id="email" v-model="mUser.email" :disabled="user != null && user.email != null" />
          </div>
          <span v-if="v$.mUser.email.$invalid">
            <span v-for="(error, index) of v$.mUser.email.$silentErrors" id="name-error" :key="index">
              <small class="p-error">{{ error.$message }}</small>
            </span>
          </span>
        </div>

        <!-- password -->
        <div v-if="!user" class="field grid">
          <label for="password" class="col-12 mb-2 md:col-2 md:mb-0"> {{ $t("model.user.password") }} </label>
          <div class="col-12 md:col-10"><Password id="password" v-model="mUser.password" /></div>
          <span v-if="v$.mUser.password.$invalid">
            <span v-for="(error, index) of v$.mUser.password.$silentErrors" id="name-error" :key="index">
              <small class="p-error">{{ error.$message }}</small>
            </span>
          </span>
        </div>
        <div v-if="!user && mUser.password" class="field grid">
          <label for="passwordRepeat" class="col-12 mb-2 md:col-2 md:mb-0">
            {{ $t("model.user.password_repeat") }}
          </label>
          <div class="col-12 md:col-10"><Password id="passwordRepeat" v-model="mUser.passwordRepeat" /></div>
          <span v-if="v$.mUser.passwordRepeat.$invalid">
            <span v-for="(error, index) of v$.mUser.passwordRepeat.$silentErrors" id="name-error" :key="index">
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
import { required, minLength, email, maxLength, sameAs } from "@/plugins/validators.js";
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
    let mUser = this.user ? JSON.parse(JSON.stringify(this.user)) : {};

    return {
      mUser: mUser,
    };
  },
  validationConfig: {
    $lazy: true,
  },
  validations() {
    let pass;
    // TODO: password validator
    if (this.user) {
      pass = {
        password: { minLength: minLength(7), maxLength: maxLength(20) },
        passwordRepeat: { sameAs: sameAs(this.mUser.password) },
      };
    } else {
      pass = {
        password: { required, minLength: minLength(7), maxLength: maxLength(20) },
        passwordRepeat: { sameAs: sameAs("test")(this.mUser.password) },
      };
    }

    return {
      mUser: {
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
        ...pass,
        // password: {
        //   //

        // },

        firstName: { minLength: minLength(3), maxLength: maxLength(20) },
        lastName: { minLength: minLength(3), maxLength: maxLength(20) },
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
