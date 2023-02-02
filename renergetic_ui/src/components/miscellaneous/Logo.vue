<template>
  <router-link id="pagelogo" :to="{ path: '/' }" />
</template>

<script>
export default {
  name: "RenLogo",
};
</script>
<style lang="scss">
#pagelogo {
  background-image: url("../../assets/logo.png");
  /* width: 7.5rem; */
  width: 25vw;
  display: inherit;
  height: inherit;
  // height: $sidemenu-logo-height; TODO: make working global variables
  /* background-size: 100%; */
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
</style>
