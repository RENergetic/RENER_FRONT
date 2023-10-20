<template>
  <div>
    <iframe title="Renergetic survey" :src="url"></iframe>
  </div>
</template>

<script>
export default {
  name: "RenSurvey",
  data() {
    return {
      url: process.env.VUE_APP_SURVEY_URL,
    };
  },
  async created() {
    console.log("Created");
    console.log(process.env);
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
div {
  min-height: 90vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  iframe {
    min-height: 85vh;
    width: 90%;
    border: 2px solid #737373;
    border-radius: 8px;
    box-shadow: 4px 4px 15px 2px #000;

    &:hover,
    &:focus-within {
      border-color: #82f9a3;
      box-shadow: 4px 4px 15px 2px #000;
    }
  }
}
</style>
