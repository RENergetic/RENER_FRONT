const path = require("path");
module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: ["@babel/plugin-syntax-top-level-await"],
  exclude: [path.resolve("./src/assets/scripts")],
};
