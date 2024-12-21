const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    output: {
        path: path.join(__dirname, "../dist-firefox/js"),
        filename: "[name].js",
    },
    mode: "production",
});
