<template>
  <div :style="pageStyle">
    <Toast />
    <ConfirmDialog></ConfirmDialog>
    <SideMenu v-if="!tvMode && keycloakState == 1" :key="`menu_${refresh}`" ref="sideMenu" @refresh="onRefresh" />
    <div v-if="keycloakState == 1" :key="`content_${refresh}`" :class="layout() + ' flex flex-column card-container '">
      <!-- <div style="color: white; margin-top: 10rem">{{ $route.path }}  style="min-height: 95vh"</div>
    <div style="color: white">{{ $keycloak && $keycloak.isInitialized() }}</div> -->
      <div v-if="hasAccess" class="flex" style="display: initial !important; margin-bottom: 1rem">
        <router-view :key="$route.path" @update-menu="updateMenu()" />
      </div>
      <div v-else :class="layout()">no access TODO:</div>

      <div v-if="!$store.getters['auth/isAuthenticated'] || $store.getters['auth/tokenExpired']" class="grid flex flex-none" style="margin: 2rem 0">
        <div class="col"></div>
        <div class="col-fixed flex-none" style="width: 20rem; text-align: center">
          <Button icon="pi pi-sign-in" style="width: 100%" :label="$t('view.button.sign_in')" @click="login" />
        </div>
        <div class="col"></div>
      </div>

      <Footer>
        <template #right> </template>
      </Footer>
    </div>
    <div v-else-if="keycloakState == -1">
      <h2>Keycloak not initialized</h2>
    </div>
    <div v-else-if="keycloakState == 0">
      <h2>Keycloak not initialized</h2>
    </div>
  </div>
  <!-- TODO: v-else do something when keycloakState == -1 -->
</template>
<script>
import SideMenu from "./components/miscellaneous/SideMenu";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import Footer from "./components/miscellaneous/Footer.vue";
// import createKeyCloak from "@/plugins/auth2";
import { setLocale } from "@/plugins/locales.js";
export default {
  name: "App",
  components: {
    Toast,
    SideMenu,
    ConfirmDialog,
    Footer,
  },
  data() {
    return {
      keycloakState: -1,
      refresh: true,
    };
  },
  computed: {
    hasAccess() {
      if (this.$route.meta.roleFlag == null || this.$route.meta.roleFlag == undefined) return true;
      return this.$ren.utils.checkAccess(this.$route.meta.roleFlag);
    },
    pageStyle() {
      if (this.tvMode) {
        return "max-height:99vh;overflow:hidden";
      }
      return "";
    },
    tvMode() {
      return !(this.$route.meta.tvMode == null || this.$route.meta.tvMode == undefined);
    },
    isLoading() {
      return this.$store.getters["spinner/isLoading"];
    },
  },
  created() {
    this.$emitter.on("refresh", () => {
      this.onRefresh();
    });
    this.$emitter.on("error", (evt) => {
      // console.error(evt);
      let title = evt.titleCode ? this.$t(`error.${evt.titleCode}`) : evt.title ? evt.title : this.$t(`error.error`);
      let msg = evt.code ? this.$t(`error.${evt.code}`, evt.args) : evt.message;
      this.$toast.add({
        severity: "error",
        summary: title,
        detail: msg,
        life: 3000,
      });
    });
    this.$emitter.on("information", (evt) => {
      let title = evt.titleCode ? this.$t(`information.${evt.titleCode}`) : evt.title ? evt.title : this.$t(`information.information`);
      let msg = evt.code ? this.$t(`information.${evt.code}`, evt.args) : evt.message;
      this.$toast.add({
        severity: "information",
        summary: title,
        detail: msg,
        life: 3000,
      });
    });
  },
  async mounted() {
    await this.$keycloak.get();
    if (this.$keycloak.isInitialized()) {
      this.keycloakState = 1;
      let currentLocale = this.$store.getters["settings/locales"].locale;
      if (currentLocale) {
        setLocale(currentLocale);
        this.refresh = !this.refresh;
      }
    } else this.keycloakState = 0;
  },
  methods: {
    login() {
      this.$router.push("/login");
    },
    onRefresh() {
      this.refresh = !this.refresh;
    },
    layout() {
      let layout = this.$route.meta.layout == null ? "standard" : this.$route.meta.layout;
      return layout;
    },
    updateMenu() {
      this.$refs.sideMenu.reload();
    },
  },
};
</script>

<style lang="scss">
.standard {
  margin-top: 3rem;
}
.fullscr {
  margin-top: 0rem;
  position: relative;
}
#app {
  min-height: 95vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  // color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
