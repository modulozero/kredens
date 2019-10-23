import path from "path";
import webpack from "webpack"; // tslint:disable-line:no-implicit-dependencies

const config: webpack.Configuration = {
  mode: "development",
  entry: "./src/frontend/index.tsx",
  devtool: "inline-source-map",
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/assets/"
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        loader: "ts-loader",
        test: /\.tsx?$/
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      "@kredens": path.resolve(__dirname, "src/")
    }
  }
};

export default config;
