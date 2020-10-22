// webpack.prod.js - production builds
const LEGACY_CONFIG = "legacy";
const MODERN_CONFIG = "modern";

// node modules
const glob = require("glob-all");
const path = require("path");
const fs = require('fs');
const { merge } = require('webpack-merge');
const webpack = require("webpack");

// webpack plugins
const rimraf = require("rimraf");
const CompressionPlugin = require("compression-webpack-plugin");
const ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const zopfli = require("@gfx/zopfli");

// config files
const common = require("./webpack.common.js");

let settings = require("./webpack.settings.js");
if (fs.existsSync(path.resolve(process.cwd(), './webpack.settings.js'))) {
  let projectSettings = require(path.resolve(process.cwd(), './webpack.settings.js'));
  settings = merge(settings, projectSettings);
}

let projectConfig = {};
if (fs.existsSync(path.resolve(process.cwd(), 'webpack.config.js'))) {
  projectConfig = require(path.resolve(process.cwd(), 'webpack.config.js'));
}

// Clean build assets before continuing
rimraf(path.resolve(settings.paths.working, settings.paths.dist.base), {}, () =>
  console.log("\n\nRemoved all previous build assets.\n")
);

// Configure Compression webpack plugin
const configureCompression = () => {
  return {
    filename: "[path].gz[query]",
    test: /\.(js|css|html|svg)$/,
    threshold: 10240,
    minRatio: 0.8,
    deleteOriginalAssets: false,
    compressionOptions: {
      numiterations: 15,
      level: 9,
    },
    algorithm(input, compressionOptions, callback) {
      return zopfli.gzip(input, compressionOptions, callback);
    },
  };
};

// Configure Image loader
const configureImageLoader = (buildType) => {
  if (buildType === LEGACY_CONFIG) {
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
  }
  if (buildType === MODERN_CONFIG) {
    return {
      test: /\.(png|jpe?g|gif|webp)$/i,
      use: [
        {
          loader: require.resolve("file-loader"),
          options: {
            name: "img/[name].[hash].[ext]",
          },
        },
        {
          loader: require.resolve("img-loader"),
          options: {
            plugins: [
              require("imagemin-gifsicle")({
                interlaced: true,
              }),
              require("imagemin-mozjpeg")({
                progressive: true,
                arithmetic: false,
              }),
              require("imagemin-optipng")({
                optimizationLevel: 5,
              }),
              require("imagemin-svgo")({
                plugins: [{ convertPathData: false }],
              }),
            ],
          },
        },
      ],
    };
  }
};

// Configure SVG loader
const configureSvgLoader = (buildType) => {
  if (buildType === LEGACY_CONFIG) {
    return {
      test: /\.svg$/,
      oneOf: [
        {
          loader: require.resolve("vue-svg-loader"),
        },
        {
          resourceQuery: /external/,
          loader: require.resolve("file-loader"),
          query: {
            name: "img/[name].[hash].[ext]",
          },
        },
      ],
    };
  }
  if (buildType === MODERN_CONFIG) {
    return {
      test: /\.svg$/,
      oneOf: [
        {
          loader: require.resolve("vue-svg-loader"),
        },
        {
          resourceQuery: /external/,
          use: [
            {
              loader: require.resolve("file-loader"),
              query: {
                name: "img/[name].[hash].[ext]",
              },
            },
            {
              loader: require.resolve("img-loader"),
              options: {
                plugins: [
                  require("imagemin-svgo")({
                    plugins: [{ convertPathData: false }],
                  }),
                ],
              },
            },
          ],
        },
      ],
    };
  }
};

// Configure optimization
const configureOptimization = (buildType) => {
  if (buildType === LEGACY_CONFIG) {
    return {
      splitChunks: {
        cacheGroups: {
          default: false,
          common: false,
          styles: {
            name: settings.vars.cssName,
            test: /\.(pcss|css|vue)$/,
            chunks: "all",
            enforce: true,
          },
        },
      },
      minimizer: [
        new TerserPlugin(configureTerser()),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            map: {
              inline: false,
              annotation: true,
            },
            safe: true,
            discardComments: true,
          },
        }),
      ],
    };
  }
  if (buildType === MODERN_CONFIG) {
    return {
      minimizer: [new TerserPlugin(configureTerser())],
    };
  }
};

// Configure Postcss loader
const configurePostcssLoader = (buildType) => {
  if (buildType === LEGACY_CONFIG) {
    return {
      test: /\.(css)$/,
      use: [
        MiniCssExtractPlugin.loader,
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
  }
  // Don't generate CSS for the modern config in production
  if (buildType === MODERN_CONFIG) {
    return {
      test: /\.(pcss|css)$/,
      loader: require.resolve("ignore-loader"),
    };
  }
};

// Configure terser
const configureTerser = () => {
  return {
    cache: true,
    parallel: true,
    sourceMap: true,
  };
};

// Production module exports
module.exports = [
  merge(common.legacyConfig, {
    output: {
      filename: path.join("./js", "[name]-legacy.[chunkhash].js"),
    },
    mode: "production",
    devtool: "source-map",
    optimization: configureOptimization(LEGACY_CONFIG),
    module: {
      rules: [
        configurePostcssLoader(LEGACY_CONFIG),
        configureImageLoader(LEGACY_CONFIG),
        configureSvgLoader(LEGACY_CONFIG),
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        path: path.resolve(settings.paths.working, settings.paths.dist.base),
        filename: path.join("./css", "[name].[chunkhash].css"),
      }),
      new CompressionPlugin(configureCompression()),
    ],
  }, projectConfig),
  merge(common.modernConfig, {
    output: {
      filename: path.join("./js", "[name].[chunkhash].js"),
    },
    mode: "production",
    devtool: "source-map",
    optimization: configureOptimization(MODERN_CONFIG),
    module: {
      rules: [
        configurePostcssLoader(MODERN_CONFIG),
        configureImageLoader(MODERN_CONFIG),
        configureSvgLoader(LEGACY_CONFIG),
      ],
    },
    plugins: [
      new ImageminWebpWebpackPlugin(),
      new CompressionPlugin(configureCompression()),
    ],
  }, projectConfig),
];
