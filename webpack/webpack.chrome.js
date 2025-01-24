const config = require("./webpack.common.js");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const chromeConfig = {
    ...config,
    ...{
        output: {
            path: path.join(__dirname, "../dist/chrome/js"),
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
                            if (resPath.includes("manifest-firefox.json"))
                                return false;
                            return true;
                        },
                    },
                ],
                options: {},
            }),
        ],
    },
};

module.exports = chromeConfig;
