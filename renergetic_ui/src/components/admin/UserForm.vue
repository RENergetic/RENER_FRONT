<template>
  <Card>
    <template #title>
      <span v-if="user"> {{ $t("view.edit_user", { username: user.username }) }}</span>
      <span v-else> {{ $t("view.add_user") }}</span>
    </template>
    <template #content>
      <div class="ren">
        <ren-input
          v-model="mUser.username"
          :invalid="v$.mUser.username.$invalid"
          :errors="v$.mUser.username.$silentErrors"
          :text-label="'model.user.username'"
        />
        <ren-input
          v-model="mUser.firstName"
          :invalid="v$.mUser.firstName.$invalid"
          :errors="v$.mUser.firstName.$silentErrors"
          :text-label="'model.user.firstname'"
        />
        <ren-input
          v-model="mUser.lastName"
          :invalid="v$.mUser.lastName.$invalid"
          :errors="v$.mUser.lastName.$silentErrors"
          :text-label="'model.user.lastname'"
        />
        <ren-input v-model="mUser.email" :invalid="v$.mUser.email.$invalid" :errors="v$.mUser.email.$silentErrors" :text-label="'model.user.email'" />
        <ren-password
          v-if="!user"
          v-model="mUser.password"
          :invalid="v$.mUser.password.$invalid"
          :errors="v$.mUser.password.$silentErrors"
          :text-label="'model.user.password'"
        />
        <ren-password
          v-if="!user && mUser.password"
          v-model="mUser.passwordRepeat"
          :invalid="v$.mUser.passwordRepeat.$invalid"
          :errors="v$.mUser.passwordRepeat.$silentErrors"
          :text-label="'model.user.password_repeat'"
        />
        <ren-submit :disabled="v$.$invalid" @submit="submit" />
      </div>
    </template>
  </Card>
</template>
<script>
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, email, maxLength, sameAs, minLengthTr, maxLengthTr } from "@/plugins/validators.js";
export default {
  name: "UserForm",
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
        password: { minLength: minLengthTr(null, "passMinLength")(7), maxLength: maxLengthTr(null, "passMaxLength")(20) },
        passwordRepeat: { sameAs: sameAs(this.mUser.password) },
      };
    } else {
      pass = {
        password: { required, minLength: minLengthTr(null, "passMinLength")(7), maxLength: maxLengthTr(null, "passMaxLength")(20) },
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
