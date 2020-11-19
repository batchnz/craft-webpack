// webpack.dev.js - developmental builds
const LEGACY_CONFIG = "legacy";
const MODERN_CONFIG = "modern";

// node modules
const { merge } = require("webpack-merge");
const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
// config files
const common = require("./webpack.common.js");
const settings = require("./webpack.settings.js");

let projectConfig = {};
if (fs.existsSync(path.resolve(process.cwd(), "webpack.config.js"))) {
  projectConfig = require(path.resolve(process.cwd(), "webpack.config.js"));
}

// Configure the webpack-dev-server
const configureDevServer = (buildType) => {
  return {
    public: settings.devServerConfig.public(),
    contentBase: path.resolve(process.cwd(), settings.paths.templates),
    host: settings.devServerConfig.host(),
    port: settings.devServerConfig.port(),
    https: !!parseInt(settings.devServerConfig.https()),
    disableHostCheck: true,
    hot: true,
    overlay: true,
    watchContentBase: true,
    watchOptions: {
      poll: !!parseInt(settings.devServerConfig.poll()),
      ignored: [
        /node_modules/,
        path.resolve(
          __dirname,
          settings.paths.working,
          settings.paths.templates + "**"
        ),
      ],
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
};

// Configure Image loader
const configureImageLoader = (buildType) => {
  return {
    test: /\.(png|jpe?g|gif|webp)$/i,
    use: [
      {
        loader: require.resolve("file-loader"),
        options: {
          name: "img/[name].[hash].[ext]",
        },
      },
    ],
  };
};

// Configure SVG loader
const configureSVGLoader = () => {
  return {
    test: /\.svg$/,
    rules: [
      {
        oneOf: [
          {
            loader: require.resolve("vue-svg-loader"),
          },
          {
            resourceQuery: /^\?external/,
            loader: require.resolve("file-loader"),
            options: {
              name: "img/[name].[hash].[ext]",
            },
          },
        ],
      },
    ],
  };
};

// Configure the Postcss loader
const configurePostcssLoader = (buildType) => {
  return {
    test: /\.(pcss|css)$/,
    use: [
      {
        loader: require.resolve("style-loader"),
      },
      {
        loader: require.resolve("vue-style-loader"),
      },
      {
        loader: require.resolve("css-loader"),
        options: {
          importLoaders: 2,
          sourceMap: true,
        },
      },
      {
        loader: require.resolve("resolve-url-loader"),
      },
      {
        loader: require.resolve("postcss-loader"),
        options: {
          sourceMap: true,
        },
      },
    ],
  };
};

// Define the legacy webpack config
const legacyConfig = merge(
  common.legacyConfig,
  {
    output: {
      filename: path.join("./js", "[name]-legacy.[hash].js"),
      publicPath: settings.devServerConfig.public() + "/",
    },
    mode: "development",
    devtool: "eval-source-map",
    devServer: configureDevServer(LEGACY_CONFIG),
    module: {
      rules: [
        configurePostcssLoader(LEGACY_CONFIG),
        configureImageLoader(LEGACY_CONFIG),
        configureSVGLoader(LEGACY_CONFIG),
      ],
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
  },
  projectConfig
);

// Define the modern webpack config
const modernConfig = merge(
  common.modernConfig,
  {
    output: {
      filename: path.join("./js", "[name].[hash].js"),
      publicPath: settings.devServerConfig.public() + "/",
    },
    mode: "development",
    devtool: "eval-source-map",
    devServer: configureDevServer(MODERN_CONFIG),
    module: {
      rules: [
        configurePostcssLoader(MODERN_CONFIG),
        configureImageLoader(MODERN_CONFIG),
        configureSVGLoader(MODERN_CONFIG),
      ],
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
  },
  projectConfig
);

module.exports = (env) => {
  const BUILD_TYPE = env && env.BUILD_TYPE;

  // Output either a legacy, modern or combined config.
  // Defaults to modern for development.
  switch (BUILD_TYPE) {
    case "combined":
      return [legacyConfig, modernConfig];
    case "legacy":
      return [legacyConfig];
    case "modern":
    default:
      return [modernConfig];
  }
};
