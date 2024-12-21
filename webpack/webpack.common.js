const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src");

module.exports = {
    entry: {
        background: path.join(srcDir, "background.ts"),
        newtab: path.join(srcDir, "newtab.tsx"),
        popup: path.join(srcDir, "popup.tsx"),
        options: path.join(srcDir, "options.tsx"),
    },
    output: {
        path: path.join(__dirname, "../dist/js"),
        filename: "[name].js",
    },
    optimization: {
        splitChunks: {
            name: "vendor",
            chunks(chunk) {
                return chunk.name !== "background";
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        // options: cssLoaderOptions,
                    },
                ],
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: ".",
                    to: "../",
                    context: "public",
                    filter: async (resPath) => {
                        if (resPath.includes("manifest")) return false;
                        return true;
                    },
                },
                {
                    from: "./manifest-firefox.json",
                    to: "../manifest.json",
                    context: "public",
                },
            ],
            options: {},
        }),
    ],
};
