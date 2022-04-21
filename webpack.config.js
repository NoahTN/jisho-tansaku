const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const baseManifest = require("./chrome/manifest.json");
const WebpackExtensionManifestPlugin = require("webpack-extension-manifest-plugin");
const config = {
   mode: "development",
   devtool: "cheap-module-source-map",
   entry: {
      app: path.join(__dirname, "./static/index.js"),
      background: path.join(__dirname, "./app/background.js"),
      content: path.join(__dirname, "./app/content.js"),
   },
   output: {
      path: path.resolve(__dirname, "./build"),
      filename: "[name].js",
      publicPath: "",
      clean: true
   },
   resolve: {
      extensions: ["*", ".js"]
   },
   plugins: [
      new HtmlWebpackPlugin({
         title: "jisho-tansaku",
         meta: {
            charset: "utf-8",
            viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
            "theme-color": "#000000"
         },
         manifest: "manifest.json",
         filename: "index.html",
         chunks: ["app"],
         template: "./static/index.html"
      }),
      new CopyPlugin({
         patterns: [
            { from: "chrome/images", to: "images" },
         ]
      }),
      new WebpackExtensionManifestPlugin({
         config: {
            base: baseManifest
         }
      }),
   ],
   module: {
      rules: [
         {
            test: /\.js/,
            exclude: /node_modules/,
            use: ["babel-loader"]
         },
         {
            test: /\.css/,
            use: ["style-loader", "css-loader"]
         },
         {
            test: /\.png/,
            type: "asset/resource"
         },
      ]
   },
};
module.exports = config;