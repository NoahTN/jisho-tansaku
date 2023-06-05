const package = require('./package.json');
const path = require("path"); 
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ZipPlugin = require('zip-webpack-plugin');

function modify(buffer) {
   let manifest = JSON.parse(buffer.toString());
   manifest.version = package.version;
   return JSON.stringify(manifest, null, 2);
}

module.exports = {
   mode: "production",
   devtool: "inline-source-map",
   entry: {
      background: "./src/background.js",
      content: "./src/content.js",
      content_show_scroll_only: "./src/content_show_scroll_only.js"
   },
   optimization: {
        minimizer: [new TerserPlugin({
            terserOptions: {
                compress: {
                    drop_console: true
                }
            }
        })],
    },
   output: {
      path: path.resolve(__dirname, "build"),
      filename: "[name].js",
      clean: true
   },
   plugins: [
      new CopyPlugin({
         patterns: [
            {from: "./chrome/images", to: "images"},
            {from: "./chrome/manifest.json",
               to:  "manifest.json",
               transform (content, path) {
                  return modify(content);
               }
            }
         ]
      }),
      new ZipPlugin({
         path: "../",
         filename: "build.zip"
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