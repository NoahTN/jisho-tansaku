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
   },
   output: {
      path: path.resolve(__dirname, "./build"),
      filename: "[name].js"
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
         template: "./static/index.html"
      }),
      new CopyPlugin({
         patterns: [
            { from: "chrome/images", to: "images" },
            { from: "app/background.js", to: "background.js" },
            { from: "app/content.js", to: "content.js" },
            { from: "app/jisho-iframe.js", to: "jisho-iframe.js" }
         ]
      }),
      new WebpackExtensionManifestPlugin({
         config: {
            base: baseManifest
         }
      })
   ],
   module: {
      rules: [
         {
            test: /\.js$/,
            exclude: /node_modules/,
            use: ["babel-loader"]
         },
         {
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
         },
         {
            test: /\.(png|svg|jpg|gif)$/,
            use: ["file-loader"]
         }
      ]
   }
};
module.exports = config;