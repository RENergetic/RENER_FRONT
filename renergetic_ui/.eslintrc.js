//https://javifm.com/en/blog/vue-3-with-typescript-eslint-and-prettier/
module.exports = {
  root: true,
  env: {
    node: true,
  },
  plugins: ["vue", "@babel"],
  extends: [
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "@vue/prettier",
  ],
  parserOptions: {
    ecmaVersion: 2020,
    // parser: "@typescript-eslint/parser",
    parser: "@babel/eslint-parser",
    sourceType: "module",
  },
  parser: "vue-eslint-parser",
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    // "arrow-parens": "off",
    "eol-last": "error",
    "vue/no-v-model-argument": "off",
    "vue/multi-word-component-names": "off",
    "prettier/prettier": ["off", { endOfLine: "auto" }],
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)",
      ],
      env: {
        jest: true,
      },
    },
    // {
    //   files: ["src/**/*.{js,vue}"],
    //   rules: {
    //     "vue/multi-word-component-names": 0,
    //     "vue/no-v-model-argument": "off",
    //     "prettier/prettier": ["error", { endOfLine: "auto" }],
    //   },
    // },
  ],
};
