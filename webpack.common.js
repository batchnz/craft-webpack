// webpack.common.js - common webpack config
const LEGACY_CONFIG = "legacy";
const MODERN_CONFIG = "modern";

// node modules
const path = require("path");
const fs = require("fs");
const { merge, mergeWithCustomize, customizeObject } = require("webpack-merge");

// webpack plugins
const ESLintPlugin = require("eslint-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const WebpackNotifierPlugin = require("webpack-notifier");

// config files
const pkg = require("./package.json");
let settings = require("./webpack.settings.js");
if (fs.existsSync(path.resolve(process.cwd(), "./webpack.settings.js"))) {
  let projectSettings = require(path.resolve(
    process.cwd(),
    "./webpack.settings.js"
  ));
  settings = merge(settings, projectSettings);
}

// Configure Babel loader
const configureBabelLoader = (browserList) => {
  return {
    test: /\.js$/,
    exclude: settings.babelLoaderConfig.exclude,
    use: {
      loader: require.resolve("babel-loader"),
      options: {
        cacheDirectory: true,
        presets: [
          [
            "@babel/preset-env",
            {
              modules: false,
              corejs: {
                version: "3.6",
                proposals: true,
              },
              useBuiltIns: "usage",
              targets: {
                browsers: browserList,
              },
            },
          ],
        ],
        plugins: [
          "@babel/plugin-syntax-dynamic-import",
          "@babel/plugin-transform-runtime",
        ],
      },
    },
  };
};

// Configure Entries
const configureEntries = () => {
  let entries = {};
  for (const [key, value] of Object.entries(settings.entries)) {
    entries[key] = path.resolve(
      settings.paths.working,
      settings.paths.src.js + value
    );
  }

  return entries;
};

// Configure Font loader
const configureFontLoader = () => {
  return {
    test: /\.(ttf|eot|woff2?)$/i,
    use: [
      {
        loader: require.resolve("file-loader"),
        options: {
          name: "fonts/[name].[ext]",
        },
      },
    ],
  };
};

// Configure Manifest
const configureManifest = (fileName) => {
  return {
    fileName: fileName,
    basePath: settings.manifestConfig.basePath,
    map: (file) => {
      file.name = file.name.replace(/(\.[a-f0-9]{32})(\..*)$/, "$2");
      return file;
    },
  };
};

// Configure Vue loader
const configureVueLoader = () => {
  return {
    test: /\.vue$/,
    loader: require.resolve("vue-loader"),
  };
};
// The base webpack config
const baseConfig = {
  name: pkg.name,
  entry: configureEntries(),
  output: {
    path: path.resolve(settings.paths.working, settings.paths.dist.base),
    publicPath: settings.urls.publicPath(),
  },
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js",
    },
  },
  module: {
    rules: [configureFontLoader(), configureVueLoader()],
  },
  plugins: [
    new WebpackNotifierPlugin({
      title: "Webpack",
      excludeWarnings: true,
      alwaysNotify: true,
    }),
    new VueLoaderPlugin(),
  ],
};

// Legacy webpack config
const legacyConfig = {
  module: {
    rules: [
      configureBabelLoader(Object.values(pkg.browserslist.legacyBrowsers)),
    ],
  },
  plugins: [new ManifestPlugin(configureManifest("manifest-legacy.json"))],
};

// Modern webpack config
const modernConfig = {
  module: {
    rules: [
      configureBabelLoader(Object.values(pkg.browserslist.modernBrowsers)),
    ],
  },
  plugins: [
    new ESLintPlugin(settings.eslintConfig),
    new ManifestPlugin(configureManifest("manifest.json")),
  ],
};

let legacyMerged = mergeWithCustomize({
  legacyConfig: customizeObject({
    module: "prepend",
    plugins: "prepend",
  }),
})(baseConfig, legacyConfig);

let modernMerged = mergeWithCustomize({
  modernConfig: customizeObject({
    module: "prepend",
    plugins: "prepend",
  }),
})(baseConfig, modernConfig);

// Common module exports
// noinspection WebpackConfigHighlighting
module.exports = {
  legacyConfig: legacyMerged,
  modernConfig: modernMerged,
};
