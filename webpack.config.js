const path = require('path');

module.exports = {
  entry: [
    'regenerator-runtime/runtime',
    './src/index.ts',
  ],
  devtool : "source-map",
  devServer : {
    static : './',
    port : "3000",
    open : true,
    hot : true,
  },
  mode : "development",
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: [path.resolve(__dirname, 'src')],
        exclude: /node_module/,
        loader : "babel-loader",
      }
    ]
  },
  resolve : {
    extensions: ['.ts' , '.js']
  },
  output: {
    publicPath : '/public/',
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
};