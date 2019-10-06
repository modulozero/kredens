import path from "path";
import VueLoaderPlugin from "vue-loader/lib/plugin"; // tslint:disable-line:no-implicit-dependencies
import webpack from "webpack"; // tslint:disable-line:no-implicit-dependencies

const config: webpack.Configuration = {
  devtool: "inline-source-map",
  entry: "./src/frontend/index.ts",
  mode: "development",
  module: {
    rules: [
      {
        exclude: /node_modules/,
        loader: "ts-loader",
        options: { appendTsSuffixTo: [/\.vue$/] },
        test: /\.ts?$/
      },
      {
        loader: "vue-loader",
        test: /.vue$/
      }
    ]
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/assets/"
  },
  plugins: [new VueLoaderPlugin()],
  resolve: {
    extensions: [".ts", ".js"]
  }
};

export default config;
