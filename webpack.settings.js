// webpack.settings.js - webpack settings config

// node modules
require("dotenv").config();

// Webpack settings exports
// noinspection WebpackConfigHighlighting
module.exports = {
  name: "Batch Craft Starter",
  copyright: "Batch Development",
  paths: {
    working: process.cwd(),
    src: {
      base: "./src/",
      css: "./src/css/",
      js: "./src/js/",
    },
    dist: {
      base: `${process.env.DOCROOT || "public"}/dist/`,
      clean: ["**/*"],
    },
    templates: "./templates/",
  },
  urls: {
    publicPath: () => process.env.PUBLIC_PATH || "/dist/",
  },
  vars: {
    cssName: "styles",
  },
  entries: {
    app: "app.js",
  },
  babelLoaderConfig: {
    exclude: [/(node_modules|bower_components)/],
  },
  devServerConfig: {
    public: () => process.env.DEVSERVER_PUBLIC || "http://localhost:8080",
    host: () => process.env.DEVSERVER_HOST || "localhost",
    poll: () => process.env.DEVSERVER_POLL || false,
    port: () => process.env.DEVSERVER_PORT || 8080,
    https: () => process.env.DEVSERVER_HTTPS || false,
  },
  manifestConfig: {
    basePath: "",
  },
  eslintConfig: {
    files: "src",
    extensions: [".js", ".vue"],
    baseConfig: {
      root: true,
      parser: "vue-eslint-parser",
      parserOptions: {
        parser: "babel-eslint",
        sourceType: "module",
        ecmaVersion: 2020,
      },
      extends: [
        "airbnb-base",
        "plugin:vue/recommended",
        "plugin:prettier/recommended",
        "prettier/vue",
      ],
      env: {
        node: true,
        browser: true,
      },
    },
  },
};
