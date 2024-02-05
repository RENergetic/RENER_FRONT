<template>
  <div id="pagefooter">
    <div>
      <slot name="left" />
    </div>
    <div id="logoSlot"><Logo /></div>
    <div>
      <slot name="right" />
    </div>
  </div>
</template>

<script>
import Logo from "./Logo.vue";
export default {
  name: "Footer",
  components: { Logo },
};
</script>
<style>
#pagefooter {
  max-height: 2rem;
  flex-grow: 0;
  height: 2rem;
  display: flex;
  /* position: relative; */
  bottom: 0;
  left: 0;
  height: 2rem;
  min-height: 2rem;
  bottom: 0;
  left: 0;
  margin: 0;
  padding-top: 0.5vh;
  padding-bottom: 0.5vh;
  width: 100%;
  padding-left: 0.5vw;
  padding-right: 0.5vw;
  /* float: left; */
  /* justify-content: space-evenly; */
  justify-content: space-between;
  flex-wrap: wrap;
}
#logoSlot {
  /* margin: 0; */
  z-index: 1001;
  /* margin: auto; */
  display: flex;
  /* margin-left: 1rem; */
}
</style>
