[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/batchnz/craft-webpack">
    <img src="https://www.batch.nz/batch-logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Batch Craft Webpack</h3>

  <p align="center">
    A zero config Webpack package made for Craft CMS
    <br />
    <a href="https://github.com/batchnz/craft-webpack"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/batchnz/craft-webpack/issues">Report Bug</a>
    ·
    <a href="https://github.com/batchnz/craft-webpack/issues">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Made For](#made-for)
  * [Features](#features)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)

<!-- ABOUT THE PROJECT -->
## About The Project

This package provides a quick and easy way to get setup with a fully featured Webpack setup.

[![Product Name Screen Shot][product-screenshot]](https://github.com/batchnz/craft-webpack)

We've tailored this package to our own requirements based on developing a multitude of Craft CMS projects ranging from simple to complex. It was originally based on the fine work by [nystudio107](https://github.com/nystudio107/annotated-webpack-4-config/) and refined into this package.

### Made For

* Craft CMS (with Twigpack)
* VueJS

### Features

* [Webpack 4](https://webpack.js.org/)
* [Core JS 3](https://github.com/zloirock/core-js)
* [Vue Loader](https://vue-loader.vuejs.org/)
* [Post CSS](https://postcss.org/)
* Manifest Configuration for use with [Twigpack](https://github.com/nystudio107/craft-twigpack)
* [State Preserving Hot Reload](https://vue-loader.vuejs.org/guide/hot-reload.html)
* Build and Development Pipelines
* [Source Maps](https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/)
* [Modern/Legacy Builds using Browserlist](https://browserl.ist/)
* [Compression](https://github.com/google/zopfli)


<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.


### Installation

1. Install the package
```sh
npm install @batch/craft-webpack -D
```
2. Add the build scripts to your project's package.json
```json
  "scripts": {
    "dev": "webpack-dev-server --progress --hide-modules --config=node_modules/@batch/craft-webpack/webpack.dev.js",
    "build": "NODE_ENV=production && webpack --progress --hide-modules --config=node_modules/@batch/craft-webpack/webpack.prod.js",
    "dev-legacy": "webpack-dev-server --progress --hide-modules --config=node_modules/@batch/craft-webpack/webpack.dev.js --env.BUILD_TYPE=legacy",
    "dev-combined": "webpack-dev-server --progress --hide-modules --config=node_modules/@batch/craft-webpack/webpack.dev.js --env.BUILD_TYPE=combined"
  }
```

<!-- USAGE EXAMPLES -->
## Usage

This package provides two pipelines out of the box, one for development and one for production builds.

Development builds default to using the `modern` config and will only output transpiled JS based on the [modernBrowsers](https://github.com/batchnz/craft-webpack/blob/master/package.json#L31) browserlist config defined in package.json. To test in legacy browers (e.g. IE11) you can use the `legacy` config (see below) which uses the [legacyBrowsers](https://github.com/batchnz/craft-webpack/blob/master/package.json#L40) browserlist config. A third mode, `combined`, will serve modern and legacy build artifacts.


### Development

Runs the development pipeline. It'll create a local webserver using webpack-dev-server to serve the assets.

```sh
npm run dev
```

If you want to use the legacy or combined build types during development, you use the `dev-legacy` or `dev-combined` tasks

### Production

Runs the production pipeline. This will compress the build artifacts ready for sites in production.

```sh
npm run build
```

## Configuration

### Settings

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

### Webpack Config

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

### Source Maps**

Out of the box, source maps are generated using webpack's "eval-source-map" devtool, which provides a "true" source map to the original code which makes debugging using breakpoints straightforward.

Other [devtools for webpack](https://webpack.js.org/configuration/devtool) are available which have different performance and accuracy characteristics. You can easily override the chosen devtool by adding a `devtool` option to your webpack.config.js overrides.

<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/batchnz/craft-webpack/issues) for a list of proposed features (and known issues).

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->
## Contact

* Josh Smith - [@batchnz](https://twitter.com/batchnz) - josh@batch.nz
* Jude Reid - [@batchnz](https://twitter.com/batchnz) - jude@batch.nz

Project Link: [https://github.com/batchnz/craft-webpack](https://github.com/batchnz/craft-webpack)

<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements

* [nystudio107 annotated webpack config](https://github.com/nystudio107/annotated-webpack-4-config/)
* [nystudio107 twigpack](https://github.com/nystudio107/craft-twigpack)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/batchnz/craft-webpack.svg?style=flat-square
[contributors-url]: https://github.com/batchnz/craft-webpack/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/batchnz/craft-webpack.svg?style=flat-square
[forks-url]: https://github.com/batchnz/craft-webpack/network/members
[stars-shield]: https://img.shields.io/github/stars/batchnz/craft-webpack.svg?style=flat-square
[stars-url]: https://github.com/batchnz/craft-webpack/stargazers
[issues-shield]: https://img.shields.io/github/issues/batchnz/craft-webpack.svg?style=flat-square
[issues-url]: https://github.com/batchnz/craft-webpack/issues
[license-shield]: https://img.shields.io/github/license/batchnz/craft-webpack.svg?style=flat-square
[license-url]: https://github.com/batchnz/craft-webpack/blob/master/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/company/batchnz/
[product-screenshot]: images/screenshot.jpg
