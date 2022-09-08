const HtmlWebpackPlugin = require('html-webpack-plugin');

const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },
    hot: true,
  },
  plugins: [
    // Plugin for hot module replacement
    new HtmlWebpackPlugin({
      title: 'Hot Module Replacement',
    }),
  ],
});
