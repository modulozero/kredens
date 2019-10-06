import path from "path";
import webpack from "webpack"; // tslint:disable-line:no-implicit-dependencies

const config: webpack.Configuration = {
  devtool: "inline-source-map",
  entry: "./src/frontend/index.ts",
  mode: "development",
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: "ts-loader"
      }
    ]
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/assets/"
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  }
};

export default config;
