const webpack = require('webpack');
require('dotenv').config();

module.exports = {
  // Other configurations...
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    })
  ],
  // Add any other configurations you might have
};
