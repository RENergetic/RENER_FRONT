// vue.config.js
module.exports = {
  configureWebpack: {
    resolve: {
      fallback: { crypto: false, util: false },
    },
    experiments: {
      // asyncWebAssembly: true,
      // buildHttp: true,
      // layers: true,
      // lazyCompilation: true,
      // outputModule: true,
      // syncWebAssembly: true,
      topLevelAwait: true,
    },
  },
};
