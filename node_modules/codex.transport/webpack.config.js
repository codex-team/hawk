/**
 * Webpack config
 *
 * @author CodeX Team (team@ifmo.su)
 * @copyright CodeX 2017
 */

const webpack = require('webpack');

/**
 * Get package params
 */
var pkg = require('./package');

/**
 * Define entry point
 */
var entry = './src/transport.js';

/**
 * Set bundle params
 *
 * filename       - main bundle file from package.json
 * library        - module name from package.json
 * libraryTarget  - "umd" is a way for your library to work with all the module
 *                  definitions (and where aren't modules at all).
 *                  It will work with CommonJS, AMD and as global variable.
 */
var output = {
  filename: './lib/bundle.js',
  library: pkg.exportModuleName,
  libraryTarget: 'umd',
};


var useModule = {
  rules: [
    /**
     * Process JS files
     */
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          query: {
            presets: [ 'es2015' ],
          }
        },
        {
          loader: 'eslint-loader',
          options: {
            fix: true
          }
        },
      ]
    }
  ]
};

/**
 * List of plugins to run
 */
var plugins = [

  /** Minify JS and CSS */
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true
  }),

  /** Block biuld if errors found */
  new webpack.NoEmitOnErrorsPlugin(),
];

/**
 * Final webpack config
 */
var config = {
  entry: entry,
  output: output,
  module: useModule,
  plugins: plugins,
  watch: true,
  devtool: 'source-map'
};

module.exports = config;
