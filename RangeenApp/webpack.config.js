const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
    entry: "./src/script.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
        publicPath: "https://vishalthakur-rangeen.netlify.app/", // Adjust this if your deployment URL differs
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
        new ModuleFederationPlugin({
            name: "rangeen",
            filename: "remoteEntry.js",
            exposes: {
                "./Rangeen": "./src/script.js",
            },
            shared: [],
        }),
    ],
};
