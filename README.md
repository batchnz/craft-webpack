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

## Scripts

First, add the scripts to your project's package.json

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