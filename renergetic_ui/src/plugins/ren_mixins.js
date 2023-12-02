export default {
    computed: {
        tvMode: function () {
            return this.$route.meta.tvMode ? true : false;
        },
    },
    methods: {
        /**
         * 
         * @param {name,path} 
         * @returns true if current route matches 
         */
        checkPath({ name = null, path = null, params = null }) {
            if (params != null && this.$route.params != null) {
                let rparams = this.$route.params;
                if (rparams.size !== params.size) {
                    return false;
                }
                for (let k in params) {
                    if (!((rparams[k] == null && params[k] == null) || (rparams[k] != null && params[k] != null))
                        || ((rparams[k] + "") != (params[k] + ""))
                    ) {
                        return false;
                    }
                }
            }
            if (name != null) {
                if (this.$route.matched != null && this.$route.matched.name != null)
                    return this.$route.matched.name == name;
                if (this.$route.name != null)
                    return this.$route.name == name;
            }
            if (path != null) {
                if (this.$route.matched != null && this.$route.matched.path == path)
                    return true;
                if (this.$route.path == path) {
                    return true;
                }
            }
            return false;
        }
    }
};
