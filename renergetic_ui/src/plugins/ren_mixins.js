export default {
  computed: {
    unitLabel: function () {
      return this.$ren.utils.unitLabel(this.measurement, this.settings.panel, this.conversionSettings);
    },
    tvMode: function () {
      return this.$route.meta.tvMode ? true : false;
    },
    isTileHorizontal: function () {
      try {
        let w =
          this.settings.panel && this.settings.panel.cellWidth
            ? this.settings.panel.cellWidth * this.tile.layout.w
            : (this.$parent.$el.parentElement.clientWidth * 0.9);
        let h =
          this.settings.panel && this.settings.panel.cellHeight
            ? this.settings.panel.cellHeight * this.tile.layout.h
            : this.$parent.$el.parentElement.clientHeight * 0.9;
        return w > h;
      } catch (ex) {
        if (this.$parent.$el == null) {
          return false
        }
        console.error(ex)
        return true;
      }
    },
    tileOrientationClass: function () {
      return this.isTileHorizontal ? 'horizontal-tile' : 'vertical-tile'
    }
  },

  methods: {
    async deleteConfirm({ message, header = null, action }) {
      await this.$confirm.require({
        message: message,
        header: header ? header : this.$t("view.confirm_delete"),
        icon: "pi pi-exclamation-triangle",
        accept: async () => {
          await action()
        },
        reject: () => {
          this.$confirm.close();
        },
      });
    },

    tileContentSize1D() {
      let w =
        this.settings.panel && this.settings.panel.cellWidth
          ? this.settings.panel.cellWidth * this.tile.layout.w
          : this.$parent.$el.parentElement.clientWidth * 0.9;
      let h =
        this.settings.panel && this.settings.panel.cellHeight
          ? this.settings.panel.cellHeight * this.tile.layout.h
          : this.$parent.$el.parentElement.clientHeight * 0.9;
      let minD = Math.min(w, h);
      console.error(this.settings.panel.cellHeight)
      console.info(this.settings.panel)
      console.error(this.$parent.$el)
      return minD
    },
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
