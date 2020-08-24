import path from "path";
import webpack from "webpack";

const config: webpack.Configuration = {
  mode: "development",
  entry: "./src/frontend/index.tsx",
  devtool: "inline-source-map",
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/assets/",
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        loader: "ts-loader",
        test: /\.tsx?$/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      "@kredens": path.resolve(__dirname, "src/"),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      API_URL: JSON.stringify("http://localhost:3000/api/"),
    }),
  ],
};

export default config;
