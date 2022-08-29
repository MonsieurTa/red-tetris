const path = require('path');

module.exports = {
  entry: './src/client/index.jsx',

  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
  },

  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
};
