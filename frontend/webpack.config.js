const webpack = require('webpack');
require('dotenv').config();

module.exports = {
  // Entry point (if not defined already)
  entry: './src/index.js',

  // Output configuration
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
  },

  // Module rules for processing different file types
  module: {
    rules: [
      {
        test: /\.css$/, // Target all .css files
        use: [
          'style-loader', // Injects CSS into the DOM
          'css-loader', // Translates CSS into CommonJS modules
          'postcss-loader', // Processes CSS with PostCSS (for Tailwind)
        ],
      },
    ],
  },

  // Plugins
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
  ],

  // Other configurations...
  resolve: {
    extensions: ['.js', '.jsx', '.css'], // Include .css for module resolution
  },
};