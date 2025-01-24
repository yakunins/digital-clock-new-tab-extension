const config = require("./webpack.common.js");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const firefoxConfig = {
    ...config,
    ...{
        output: {
            path: path.join(__dirname, "../dist/firefox/js"),
            filename: "[name].js",
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
    },
};

module.exports = firefoxConfig;
