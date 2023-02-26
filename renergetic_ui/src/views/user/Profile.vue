<template>
  <div class="ren-profile">
    <ProfileComponent />
  </div>
</template>
<script>
import ProfileComponent from "@/components/user/Profile.vue";
export default {
  name: "ProfileView",
  components: {
    ProfileComponent,
  },

  watch: {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss">
.ren-profile {
  width: 90%;
  margin: auto;
  margin-top: 1rem;
  max-width: 50rem;
}
</style>
