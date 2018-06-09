var webpack           = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var fs = require('fs');
const WebpackPluginHash = require('webpack-plugin-hash');

require('dotenv').config();
var DevelopmendMode = process.env.ENVIRONMENT === 'DEVELOPMENT';


module.exports = {

  entry: './public/javascripts/hawk.js',

  output: {
    filename: './public/build/bundle.js',
    library: 'hawkso',
    devtoolModuleFilenameTemplate: "[resource-path]"
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
              fix: DevelopmendMode,
              sourceType: 'module'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('public/build/bundle.css'),
    new WebpackPluginHash({
      callback: (error, hash) => {
        if (!error) {
          fs.writeFile("./public/build/revision.cfg", hash, function(err) {
            if(err) {
              return console.log(err);
            }

            console.log("Bundle revision saved at the ./public/build/revision.cfg:", hash);
          });
        }
      }
    }),
  ],

  devtool: 'source-map',

  watch: DevelopmendMode,

  watchOptions: {
    aggragateTimeout: 50
  }

};
