const package = require('./package.json');
const path = require("path"); 
const CopyPlugin = require("copy-webpack-plugin");

function modify(buffer) {
   let manifest = JSON.parse(buffer.toString());
   manifest.version = package.version;
   manifest.content_scripts = [{
        "matches": ["https://www.google.com/*"],
        "js": ["content.js"]
   }];
   return JSON.stringify(manifest, null, 2);
}

module.exports = {
   mode: "development",
   devtool: 'cheap-module-source-map',
   entry: {
      background: "./src/background.js",
      content: "./src/content.js",
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