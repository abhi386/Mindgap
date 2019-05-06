const path = require('path')
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')

const paths = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist'),
  data: path.join(__dirname, 'src',  'data')
}

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader'
        }],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name:'[name].[ext]',
          //outputPath:'assets' //the icons will be stored in dist/assets folder
        }
      } 
    ],
  },

  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new CopyWebpackPlugin([
      {
        from: paths.data,
        to: paths.dist + '/data'
      }
    ])
  ],
  devServer: {
    compress: true,
    disableHostCheck: true,
  }
}