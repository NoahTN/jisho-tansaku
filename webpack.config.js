const path = require("path"); 
const CopyWebpackPlugin = require("copy-webpack-plugin");
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
      new CopyWebpackPlugin({
         patterns: [
            {from: "chrome"},
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

// TODO: dev webpack that edits manifest to run content script automatically