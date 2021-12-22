<template>
  <div>
    <Toast />
    <ConfirmDialog></ConfirmDialog>
    <SideMenu />
    <router-view />
    <Footer>
      <template #right>
        <!-- <div style="margin: auto">{{ standName }}</div> -->
      </template>
    </Footer>
  </div>
</template>
<script>
import SideMenu from "./components/miscellaneous/SideMenu";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import Footer from "./components/miscellaneous/Footer.vue";
export default {
  name: "App",
  components: {
    Toast,
    SideMenu,
    ConfirmDialog,
    Footer,
  },
  computed: {
    isLoading() {
      return this.$store.getters["spinner/isLoading"];
    },
  },
  watch: {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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
