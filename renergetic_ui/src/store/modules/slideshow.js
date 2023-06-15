export default {
  namespaced: true,
  state: {
    data: {
      //#region keyclock data:
      links: [],
      current: null,
    },
    // role:null,
  },
  mutations: {
    reset(state) {
      state.current = -1;
    },
    _setCurrent(state, current) {
      state.current = current;
    },
    /**
     *
     * @param {*} state
     * @param {*} {links} ->  [ { assetId, panelId }]
     */
    set(state, { links }) {
      state.links = links;
      state.current = -1;
    },
  },
  actions: {
    set({ commit, rootState }) {
      // console.info("set slideshow");
      var links = [];
      if (rootState.view.featuredPanels && rootState.settings.home.publicLoop) {
        links.push(
          ...rootState.view.featuredPanels.map((panel) => {
            return {
              // label: panel.label ? panel.label : panel.name,
              // icon: "pi pi-fw pi-th-large",
              panelId: panel.id,
              assetId: null,
            };
          }),
        );
      }
      if (rootState.view.assetPanels && rootState.settings.home.privateLoop) {
        links.push(
          ...rootState.view.assetPanels.map((assetPanel) => {
            return {
              // label: assetPanel.panel.label.replace("{asset}", assetPanel.asset.label),
              // icon: "pi pi-fw pi-th-large",
              assetId: assetPanel.asset.id,
              panelId: assetPanel.panel.id,
            };
          }),
        );
      }
      if (links) commit("set", { links: links });
    },
    next({ state, commit }) {
      console.debug(state);
      // console.error(commit);
      if (state.links) {
        let current = (state.current + 1) % state.links.length;
        commit("_setCurrent", current);
        return state.links[state.current];
      }
      return null;
    },
  },
  getters: {
    links: (state /* getters*/) => {
      return state.links;
    },
    current: (state /* getters*/) => {
      return state.current;
    },
  },
};
