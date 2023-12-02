export default {
    computed: {
        tvMode: function () {
            return this.$route.meta.tvMode ? true : false;
        },
    },
};
