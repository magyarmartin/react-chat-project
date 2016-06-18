const path = require('path');
const join = path.join;

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    './src/main.js'
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel'],
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      },
      { 
        test: /\.(png|jpg)$/, 
        loader: 'url-loader?limit=8192' 
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', 'scss']
  },
  output: {
    path: __dirname + '/dist',
    publicPath:'/dist',
    filename: 'bundle.js'
  },
  devServer: {
    port: 8080,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  }
};