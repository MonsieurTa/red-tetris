const path = require('path');

module.exports = {
  entry: './src/client/index.jsx',

  devtool: 'inline-source-map',

  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },
    hot: true,
  },

  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
  },

  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }, {
      test: /\.css$/i,
      include: path.resolve(__dirname, 'src'),
      use: ['style-loader', 'css-loader', 'postcss-loader'],
    }],
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
};
