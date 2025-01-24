const webpack = require("webpack");
const path = require("path");

const srcDir = path.join(__dirname, "..", "src");

const config = {
    entry: {
        background: path.join(srcDir, "background.ts"),
        newtab: path.join(srcDir, "newtab.tsx"),
        popup: path.join(srcDir, "popup.tsx"),
        options: path.join(srcDir, "options.tsx"),
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
};

module.exports = config;
