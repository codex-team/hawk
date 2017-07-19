var webpack           = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

require('dotenv').config();
var DevelopmendMode = process.env.ENVIRONMENT === 'DEVELOPMENT';

module.exports = {

  entry: './public/javascripts/hawk.js',

  output: {
    filename: './public/build/bundle.js',
    library: 'hawk'
  },

  module: {
    rules: [
      {
        test : /\.(png|jpg|svg)$/,
        use : 'file-loader?name=[path][name].[ext]'
      },
      {
        /**
         * Use for all CSS files loaders below
         * - extract-text-webpack-plugin
         * - postcss-loader
         */
        test: /\.css$/,
        /** extract-text-webpack-plugin */
        use: ExtractTextPlugin.extract([
          {
            loader: 'css-loader',
            options: {
              minimize: 1,
              importLoaders: 1
            }
          },
          /** postcss-loader */
          'postcss-loader'
        ])
      },
      {
        /**
         * Use for all JS files loaders below
         * - babel-loader
         * - eslint-loader
         */
        test: /\.js$/,
        use : [
          /** Babel loader */
          {
            loader: 'babel-loader',
            options: {
              presets: [ 'env' ]
            },
          },
          /** ES lint For webpack build */
          {
            loader: 'eslint-loader',
            options: {
              fix: DevelopmendMode
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('public/build/bundle.css')
  ],

  devtool: 'source-map',

  watch: DevelopmendMode,

  watchOptions: {
    aggragateTimeout: 50
  }

};
