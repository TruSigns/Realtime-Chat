const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[contenthash].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: { presets: ["@babel/preset-env", "@babel/preset-react"] },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: { extensions: [".js", ".jsx"] },
  plugins: [
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
    new webpack.DefinePlugin({
      "process.env.SOCKET_URL": JSON.stringify(process.env.SOCKET_URL || ""),
      "process.env.API_URL": JSON.stringify(process.env.API_URL || ""),
    }),
  ],
  devServer: {
    port: 8080,
    historyApiFallback: true,
    proxy: [{ context: ["/api"], target: "http://localhost:4000" }],
  },
};
