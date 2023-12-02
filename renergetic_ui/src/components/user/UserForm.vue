<template>
  <Card>
    <template #title>
      <span> {{ $t("view.logged_in_as", { username: user.username }) }}</span>
    </template>
    <template #content>
      <div class="ren">
        <!-- <div class="field grid">
          <label for="firstName" class="col-12 mb-2 md:col-2 md:mb-0"> {{ $t("model.user.firstname") }} </label>
          <div class="col-12 md:col-10"><InputText id="firstName" v-model="mUser.firstName" :disabled="!mEdit" /></div>
          <span v-if="v$.mUser.firstName.$invalid">
            <span v-for="(error, index) of v$.mUser.firstName.$silentErrors" id="name-error" :key="index">
              <small class="p-error">{{ error.$message }}</small>
            </span>
          </span>
        </div> -->
        <ren-input
          v-model="mUser.firstname"
          :text-label="'model.user.firstname'"
          :invalid="v$.mUser.firstName.$invalid"
          :errors="v$.mUser.firstName.$silentErrors"
          :disabled="!mEdit"
        />
        <ren-input
          v-model="mUser.lastName"
          :text-label="'model.user.lastname'"
          :invalid="v$.mUser.lastName.$invalid"
          :errors="v$.mUser.lastName.$silentErrors"
          :disabled="!mEdit"
        />
        <ren-input
          v-model="mUser.email"
          :text-label="'model.user.email'"
          :invalid="v$.mUser.email.$invalid"
          :errors="v$.mUser.email.$silentErrors"
          :disabled="!mEdit"
        />
        <ren-password
          v-if="mEdit"
          v-model="mUser.password"
          :invalid="v$.mUser.password.$invalid"
          :errors="v$.mUser.password.$silentErrors"
          :text-label="'model.user.password'"
        />
        <ren-password
          v-if="mEdit && mUser.password"
          v-model="mUser.passwordRepeat"
          :invalid="v$.mUser.passwordRepeat.$invalid"
          :errors="v$.mUser.passwordRepeat.$silentErrors"
          :text-label="'model.user.password_repeat'"
        />
        <!-- <div v-if="mEdit" class="field grid">
          <label for="password" class="col-12 mb-2 md:col-2 md:mb-0"> {{ $t("model.user.password") }} </label>
          <div class="col-12 md:col-10">
            <Password id="password" v-model="mUser.password" autocomplete="off" />
          </div>
          <span v-if="v$.mUser.password.$invalid">
            <span v-for="(error, index) of v$.mUser.password.$silentErrors" id="name-error" :key="index">
              <small class="p-error">{{ error.$message }}</small>
            </span>
          </span>
        </div>
        <div v-if="mUser.password" class="field grid">
          <label for="passwordRepeat" class="col-12 mb-2 md:col-2 md:mb-0">
            {{ $t("model.user.password_repeat") }}
          </label>
          <div class="col-12 md:col-10"><Password id="passwordRepeat" v-model="mUser.passwordRepeat" /></div>
          <span v-if="v$.mUser.passwordRepeat.$invalid">
            <span v-for="(error, index) of v$.mUser.passwordRepeat.$silentErrors" id="name-error" :key="index">
              <small class="p-error">{{ error.$message }}</small>
            </span>
          </span>
        </div> -->
        <ren-submit v-if="mEdit" :disabled="v$.$invalid" :cancel-button="true" @submit="submit" @cancel="stopEdit" />
        <div class="field grid">
          <Button v-if="!mEdit" :label="$t('view.button.edit')" @click="startEdit" />
          <!-- <Button :label="$t('view.button.cancel')" @click="cancel" /> -->
        </div>
      </div>
    </template>
  </Card>
</template>
<script>
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, minLengthTr, email, maxLength, maxLengthTr, sameAs } from "@/plugins/validators.js";
export default {
  name: "UserForm",
  components: {},
  props: {
    user: {
      type: Object,
      required: true,
    },
    edit: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "update:edit", "save", "cancel"],
  setup: () => ({ v$: useVuelidate() }),
  data() {
    let mUser = this.user ? JSON.parse(JSON.stringify(this.user)) : {};
    return {
      mUser: mUser,
      mEdit: this.edit,
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
        // username: {
        //   required,
        //   minLength: minLength(5),
        //   maxLength: maxLength(50),
        // },
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
    startEdit() {
      this.mEdit = true;
      this.$emit("update:edit", this.mEdit);
    },
    stopEdit() {
      this.mUser = this.user ? JSON.parse(JSON.stringify(this.user)) : {};
      this.mEdit = false;
      this.$emit("update:edit", this.mEdit);
    },
    async submit() {
      this.$emit("save", this.mUser);
      this.mEdit = false;
      this.$emit("update:edit", this.mEdit);
    },
  },
};
</script>

<style lang="scss"></style>
