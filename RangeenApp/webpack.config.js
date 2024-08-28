const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
    const isProduction = argv.mode === "production";

    return {
        entry: "./src/script.js",
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "bundle.js",
            publicPath: isProduction ? "https://rangeen.netlify.app/" : "/",
        },
        mode: isProduction ? "production" : "development",
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        isProduction
                            ? MiniCssExtractPlugin.loader
                            : "style-loader",
                        "css-loader",
                    ],
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./src/index.html",
            }),
            new ModuleFederationPlugin({
                name: "vanillaApp",
                filename: "remoteEntry.js",
                exposes: {
                    "./VanillaApp": "./src/script.js",
                },
                shared: [],
            }),
            ...(isProduction
                ? [
                      new MiniCssExtractPlugin({
                          filename: "bundle.css",
                      }),
                  ]
                : []),
        ],
        devServer: {
            static: {
                directory: path.join(__dirname, "dist"),
            },
            hot: true,
            port: 5049,
        },
    };
};
