const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src");

const tsLoaderOptions = {
    getCustomTransformers: () => ({
        before: [require("typescript-plugin-css-modules").default()],
    }),
};
const cssLoaderOptions = {
    modules: {
        localIdentName: "[name]__[local]___[hash:base64:5]",
    },
};

module.exports = {
    entry: {
        popup: path.join(srcDir, "popup.tsx"),
        options: path.join(srcDir, "options.tsx"),
        newtab: path.join(srcDir, "newtab.tsx"),
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
            patterns: [{ from: ".", to: "../", context: "public" }],
            options: {},
        }),
    ],
};
