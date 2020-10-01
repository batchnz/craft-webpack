# Webpack Craft

[Batch](https://batch.nz)'s Webpack setup made for the [Craft Starter](https://github.com/batchnz/craft-starter).

A Craft Specific Tailwind/Vue Webpack Configuration with:

* Core JS 3
* Vue Loader
* Post CSS
* Purge CSS
* Manifest Configuration for use with [Twigpack](https://github.com/nystudio107/craft-twigpack)
* State Preserving Hot Reload
* Build and Development Pipelines
* Source Maps
* Modern/Legacy Builds using Browserlist
* Compression

## Getting Started

### Installation

`yarn add/npm install @batch/craft-webpack`

### Scripts

Add the build scripts to your project's package.json

```json
  "scripts": {
    "dev": "webpack-dev-server --progress --hide-modules --config=node_modules/@batch/craft-webpack/webpack.dev.js",
    "build": "webpack --progress --hide-modules --config=node_modules/@batch/craft-webpack/webpack.prod.js",
    "dev-legacy": "webpack-dev-server --progress --hide-modules --config=node_modules/@batch/craft-webpack/webpack.dev.js --env.BUILD_TYPE=legacy",
    "dev-combined": "webpack-dev-server --progress --hide-modules --config=node_modules/@batch/craft-webpack/webpack.dev.js --env.BUILD_TYPE=combined"
  }
```

**Production**

`npm run/yarn build`

**Development**

Run the development pipeline, it will create a local webserver using webpack-dev-server to serve the assets

`npm run/yarn dev`

If want to use the legacy or combined build types during development, you use the`dev-modern` or `dev-combined` tasks

## Configuration

**Settings**

The settings in webpack.settings.js can be overridden at a project level by placing a webpack.settings.js file in the project root. This will be merged with the base webpack.settings.js file during build.

eg.

```javascript
module.exports = {
    paths: {
        src: {
            base: "./resources/",
            css: "./resources/css/",
            js: "./resources/js/"
        }
    }
};
```

**Webpack Config**

Any custom Webpack config can be included by adding a webpack.config.js in the project root. This will be merged with the final Webpack config during build.

eg. 

```javascript
const path = require("path");

module.exports = {
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/vue/")
    }
  }
};
```

**Source Maps**

Out of the box, source maps are generated using webpack's "eval-source-map" devtool, which provides a "true" source map to the original code which makes debugging using breakpoints straightforward.

Other [devtools for webpack](https://webpack.js.org/configuration/devtool) are available which have different performance and accuracy characteristics. You can easily override the chosen devtool by adding a `devtool` option to your webpack.config.js overrides.
